CLUSTER_NAME = blog

###
## tilt 系
###
tilt-up:
	tilt up
tilt-down:
	tilt down
	$(MAKE) tilt-delete-image
	docker system prune -f
	crictl rmi --prune

# tilt によって生成された Docker Image を全て削除する
tilt-delete-image:
	docker images --format '{{.Repository}}:{{.Tag}}' | grep 'tilt-' | xargs -I {} docker rmi {}

###
## microk8s 系
###
mk8s-setup:
	sudo snap install microk8s --classic --channel=1.31 && \
  sudo microk8s.enable dns && \
  sudo microk8s.enable registry
mk8s-make-local-cluster:
	sudo microk8s.kubectl config view --flatten > ~/.kube/microk8s-config && \
	KUBECONFIG=~/.kube/microk8s-config:~/.kube/config kubectl config view --flatten > ~/.kube/temp-config && \
	mv ~/.kube/temp-config ~/.kube/config && \
	kubectl config use-context microk8s

mk8s-import-image:
	docker save $(image_name) | sudo microk8s.ctr image import -
mk8s-get-tilt-images:
	@sudo microk8s.ctr image list | grep $(image_name):tilt- | awk '{print $$1}'
mk8s-delete-tilt-images:
	$(MAKE) mk8s-get-tilt-images image_name=$(image_name) --no-print-directory | xargs -r sudo microk8s.ctr images remove || true
	docker images --format '{{.Repository}}:{{ .Tag }}' | grep $(image_name):tilt- | xargs -r -I {} docker rmi {} || true

###
## ingress 系
###
# MetalLB のインストール
setup-metallb:
	microk8s enable metallb:192.168.100.100-192.168.100.100

setup-metallb-for-kind:
	$(MAKE) update-kube-proxy-for-kind
	helm repo add metallb https://metallb.github.io/metallb
	helm install metallb metallb/metallb
	$(MAKE) metallb-apply

# MetalLB のインストールの準備として、ネームスペース「kubesystem」内の
# configmap リソース「 kube-proxy 」の strictARP を true に変更する
update-kube-proxy-for-kind:
	kubectl get configmap kube-proxy -n kube-system -o yaml | \
	sed -e "s/strictARP: false/strictARP: true/" | \
	kubectl apply -f - -n kube-system

metallb-apply:
	kubectl wait -n metallb-system --for=condition=ready pod -l app=metallb --timeout=120s
	kubectl apply -f k8s/metallb.yaml

ingress-controller-install:
	kubectl create namespace ingress
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm install custom-ingress-nginx ingress-nginx/ingress-nginx --namespace ingress --set controller.ingressClassResource.name=custom-nginx

ingress-controller-set-metallb:
	kubectl -n ingress patch service custom-ingress-nginx-controller \
		-p '{"metadata":{"annotations":{"metallb.universe.tf/address-pool": "addresspool", "metallb.universe.tf/ip-address": "192.168.1.1"}}}'

ingress-controller-default-set:
	kubectl patch ingressclass custom-nginx \
  -p '{"metadata": {"annotations": {"ingressclass.kubernetes.io/is-default-class": "true"}}}'

###
## Kubernetes 系
###
kube-switch-working-namespace:
	kubectl create namespace blog
	kubectl config set-context --current --namespace=blog
kube-switch-default-namespace:
	kubectl config set-context --current --namespace=default

# ingress-controller にあたる Pod を直接ポートフォワーディングしている
# そのため、ingress のルールは適用されない
# wsl2 上で google-chrome 等を起動することで ingress の動作は確認可能
kube-port-forward-ingress:
	kubectl -n ingress port-forward nginx-ingress-microk8s-controller-spwnj 8080:80

###
## Helm 系
## 基本的には tilt が管理してくれるのであまり使わない
###
helm-install:
	helm install blog k8s/blog-chart

helm-delete:
	helm delete blog

# 一度削除してから再インストール
helm-reinstall: helm-delete helm-install

###
## frontend 系
###

# ホスト上で install してもコンテナ内は別途 install しないと動かない
# なぜかは不明だが、そもそも node_modules が同期されていないようなので連続で install しても問題ないはず
# node_modules は明示的に ignore したほうがいいかも
frontend-install:
	cd source/frontend && pnpm install

frontend-install-with-container:
	$(MAKE) frontend-install
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm install
	kubectl exec -it $(shell $(MAKE) web-pod-name) -c web -- pnpm install

frontend-check:
	cd source/frontend/ && pnpm web run check
frontend-fix:
	cd source/frontend && pnpm web run fix
frontend-test-unit:
	cd source/frontend && pnpm web run test

###
## e2e 系
###
e2e-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep e2e

e2e-sh:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- bash
e2e-run:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm run e2e-test

# CI でもコンテナ上で実行する関係で明示的に環境変数を指定
# DISPLAY 環境変数をクリアしないとなぜかタイムアウトする
# 参考: https://github.com/microsoft/playwright/issues/18255
e2e-run-ci:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- bash -c 'DISPLAY= CI=true pnpm run e2e-test'
e2e-run-ui:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm run e2e-ui

###
## web 系
###
web-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep web

###
## api 系
###
api-run:
	docker container run --rm api:v0.0.0
api-sh:
	docker container run --rm -it api:v0.0.0 /bin/bash
api-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep api

###
## api テスト系
## Pod「api」内に api テスト用コンテナがある
###
api-test-sh:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api-test -- bash
api-test-run:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api-test -- cargo test
