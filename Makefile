CLUSTER_NAME = blog

docker-image-build:
	docker image build -f containers/frontend/web/Dockerfile -t web:v0.1.0 .

kind-up: 
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down: 
	kind delete cluster --name $(CLUSTER_NAME)

kind-load-all: kind-load-web
kind-load-web:
	kind load docker-image web:v0.1.0 --name $(CLUSTER_NAME)

helm-install:
	helm package k8s/chart; \
	helm install blog ./chart-0.1.0.tgz

helm-upgrade:
	helm package k8s/chart; \
	helm upgrade blog ./chart-0.1.0.tgz

helm-delete:
	helm delete blog

# 一度削除してから再インストール
helm-reinstall: helm-delete helm-install