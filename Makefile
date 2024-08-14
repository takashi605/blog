CLUSTER_NAME = blog

docker-image-build:
	docker image build --target dev -f containers/frontend/web/Dockerfile -t web:v0.0.0 .
	docker system prune

kind-up:
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down:
	kind delete cluster --name $(CLUSTER_NAME)

kind-load-all: kind-load-web
kind-load-web:
	kind load docker-image web:v0.1.0 --name $(CLUSTER_NAME)

helm-install:
	helm package k8s/blog-chart; \
	helm install blog ./blog-chart-0.1.0.tgz

helm-upgrade:
	helm package k8s/blog-chart; \
	helm upgrade blog ./blog-chart-0.1.0.tgz

helm-delete:
	helm delete blog

# 一度削除してから再インストール
helm-reinstall: helm-delete helm-install

# 環境構築 #
## MetalLB ##

# MetalLB のインストール
setup-metallb:
	$(MAKE) update-kube-proxy
	helm repo add metallb https://metallb.github.io/metallb
	helm install metallb metallb/metallb
	$(MAKE) metallb-apply

# MetalLB のインストールの準備として、ネームスペース「kubesystem」内の
# configmap リソース「 kube-proxy 」の strictARP を true に変更する
update-kube-proxy:
	kubectl get configmap kube-proxy -n kube-system -o yaml | \
	sed -e "s/strictARP: false/strictARP: true/" | \
	kubectl apply -f - -n kube-system

metallb-apply:
	kubectl apply -f k8s/metallb-resources.yaml

setup-ingressclass:
	helm upgrade --install ingress-nginx ingress-nginx \
		--repo https://kubernetes.github.io/ingress-nginx

default-set-ingressclass:
	kubectl patch ingressclass nginx \
	-p '{"metadata": {"annotations": {"ingressclass.kubernetes.io/is-default-class": "true"}}}'
