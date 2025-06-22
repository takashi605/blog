MAKEFLAGS += --no-print-directory

CLUSTER_NAME = blog

###
## 下記コマンドで環境構築可能
## 上から順次実行で可能なことはテスト済みだが、make コマンド単体での実行は未検証
## リソースの構築完了前に次のコマンドを実行して停止するといったことがあり得るので、
## 途中で止まったら止まった地点から再実行する
###
up-all-env:
	$(MAKE) mk8s-setup
	$(MAKE) mk8s-make-local-cluster
	$(MAKE) kube-switch-working-namespace
	$(MAKE) coredns-apply
	$(MAKE) setup-metallb
	$(MAKE) metallb-apply
	$(MAKE) ingress-controller-install
	$(MAKE) ingress-controller-set-metallb
	$(MAKE) ingress-controller-default-set

###
## tilt 系
###
tilt-up:
	$(MAKE) tilt-down
	tilt up
tilt-down:
	tilt down
	$(MAKE) tilt-delete-image
	$(MAKE) mk8s-prune
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
	docker tag $(image_name) $(image_name)
	docker push $(image_name)

# 参考：https://discuss.kubernetes.io/t/microk8s-images-prune-utility-for-production-servers/15874/2
mk8s-prune:
	crictl -r unix:///var/snap/microk8s/common/run/containerd.sock rmi --prune

###
## ingress 系
###

# coredns の設定変更
coredns-apply:
	kubectl delete -f k8s/coredns.yaml -n kube-system || true
	kubectl apply -f k8s/coredns.yaml -n kube-system

# MetalLB のインストール
setup-metallb:
	helm repo add metallb https://metallb.github.io/metallb
	helm install metallb metallb/metallb --namespace metallb-system --create-namespace --wait
	$(MAKE) metallb-apply

metallb-apply:
	kubectl apply -f k8s/metallb.yaml -n metallb-system

setup-metallb-for-kind:
	$(MAKE) update-kube-proxy-for-kind
	$(MAKE) setup-metallb

# MetalLB のインストールの準備として、ネームスペース「kubesystem」内の
# configmap リソース「 kube-proxy 」の strictARP を true に変更する
update-kube-proxy-for-kind:
	kubectl get configmap kube-proxy -n kube-system -o yaml | \
	sed -e "s/strictARP: false/strictARP: true/" | \
	kubectl apply -f - -n kube-system

ingress-controller-install:
	kubectl create namespace ingress
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	helm install custom-ingress-nginx ingress-nginx/ingress-nginx --namespace ingress --set controller.ingressClassResource.name=custom-nginx --wait

ingress-controller-set-metallb:
	kubectl -n ingress patch service custom-ingress-nginx-controller \
		-p '{"metadata":{"annotations":{"metallb.universe.tf/address-pool": "addresspool", "metallb.universe.tf/ip-address": "192.168.0.1"}}}'

ingress-controller-default-set:
	kubectl patch ingressclass custom-nginx \
  -p '{"metadata": {"annotations": {"ingressclass.kubernetes.io/is-default-class": "true"}}}'

###
## Kubernetes 系
###
kube-switch-working-namespace:
	kubectl create namespace blog --dry-run=client -o yaml | kubectl apply -f -
	kubectl config set-context --current --namespace=blog
kube-switch-default-namespace:
	kubectl config set-context --current --namespace=default

# ingress-controller にあたる Pod を直接ポートフォワーディングしている
# そのため、ingress のルールは適用されない
# wsl2 上で google-chrome 等を起動することで ingress の動作は確認可能
kube-port-forward-ingress:
	kubectl -n ingress port-forward $(shell kubectl -n ingress get pod --template='{{(index .items 0).metadata.name}}') 8080:80
kube-port-forward-admin:
	kubectl port-forward svc/admin 8081:80
kube-port-forward-api:
	kubectl port-forward svc/api 8000:80

###
## Helm 系
## 基本的には tilt が管理してくれるのであまり使わない
###
helm-install:
	helm install blog k8s/blog-chart --wait --timeout 10m0s

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
	kubectl exec -it $(shell $(MAKE) blog-admin-pod-name) -c admin -- pnpm install

frontend-test:
	$(MAKE) frontend-tsc
	$(MAKE) frontend-test-unit-serialize
	$(MAKE) frontend-check
frontend-check:
	cd source/frontend/ && \
	printf "web\n blog-admin\n shared-lib\n" shared-test-data | \
	xargs -n 1 -P 5 -I {} pnpm {} run check
frontend-fix:
	cd source/frontend/ && \
	printf "web\n blog-admin\n shared-lib\n" shared-test-data | \
	xargs -n 1 -P 5 -I {} pnpm {} run fix

# 結果が見づらいけど並列実行するのでめちゃくちゃはやい
frontend-test-unit:
	cd source/frontend/ && \
	printf "web\n blog-admin\n shared-lib\n" shared-test-data | \
	xargs -n 1 -P 5 -I {} pnpm {} run test

# 直接実行するので見やすい
frontend-test-unit-serialize:
	cd source/frontend/ && \
	printf "web\n blog-admin\n shared-lib\n" shared-test-data | \
	xargs -n 1 -P 1 -I {} pnpm {} run test

frontend-tsc:
	cd source/frontend/ && pnpm tsc

# TypeScript型生成
frontend-generate-types:
	cd source/frontend/ && pnpm generate-types

###
## e2e 系
###
e2e-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep e2e

e2e-sh:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- bash
e2e-run:
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
	@kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm run e2e-test
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run

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
web-sh:
	kubectl exec -it $(shell $(MAKE) web-pod-name) -c web -- bash

# usage:
#   make api-migrate-add name=xxxxx
api-migrate-add-schema:
	cd source/backend/api && sqlx migrate add $(name) --source ./migrations/schema
api-migrate-add-seeds:
	cd source/backend/api && sqlx migrate add $(name) --source ./migrations/seeds

# OpenAPI仕様書生成
api-generate-openapi:
	kubectl exec $(shell $(MAKE) api-pod-name) -c api -- curl -s http://localhost:8001/openapi.json > source/frontend/openapi.json

###
## api  系
###
api-sh:
	kubectl exec -it $(shell $(MAKE) api-pod-name) /bin/bash
api-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep api
api-test-sh:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api-test -- bash
api-test-run:
	$(MAKE) api-create-db
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- cargo test
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api-test -- cargo test
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
api-test-run-include-ignored:
	$(MAKE) api-create-db
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- cargo test -- --include-ignored
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api-test -- cargo test -- --include-ignored
	$(MAKE) postgres-recreate-schema
	$(MAKE) api-migrate-run
api-test-unit:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- cargo test
api-create-db:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- sh -c "cd ./api && sqlx database create"
api-drop-db:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- sh -c "cd ./api && sqlx database drop -y"
api-migrate-run:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- sh -c "cd ./api && sqlx migrate run --source ./migrations/schema"
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- sh -c "cd ./api && sqlx migrate run --source ./migrations/seeds --ignore-missing"
api-migrate-revert:
	kubectl exec -it $(shell $(MAKE) api-pod-name) -c api -- sh -c "cd ./api && sqlx migrate revert --source ./migrations/schema"


###
## blog-admin 系
###
blog-admin-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep admin
blog-admin-sh:
	kubectl exec -it $(shell $(MAKE) blog-admin-pod-name) -c admin -- bash
blog-admin-build:
	docker image build --target dev -f containers/frontend/blog-admin/Dockerfile -t test-admin .

###
## postgres 系
###
postgres-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep postgres
postgres-sh:
	kubectl exec -it $(shell $(MAKE) postgres-pod-name) -c postgres -- bash
postgres-recreate-schema:
	kubectl exec -it $(shell $(MAKE) postgres-pod-name) -c postgres -- \
		psql -d blog -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

###
## 型生成系
###

# OpenAPI仕様書からTypeScript型を一括生成
generate-types:
	$(MAKE) api-generate-openapi
	$(MAKE) frontend-generate-types

###
## デバッグ用
###
check-docker-disk-usage:
	@sudo du -h --max-depth=1 /var/lib/docker/overlay2 | sort -hr
check-mk8s-disk-usage:
	@sudo du -h --max-depth=1 /var/snap/microk8s/common/default-storage | sort -hr
