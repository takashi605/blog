CLUSTER_NAME = blog

kind-up:
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down:
	kind delete cluster --name $(CLUSTER_NAME)

kind-load-all: kind-load-web
kind-load-web:
	kind load docker-image web:v0.0.0 --name $(CLUSTER_NAME)

docker-image-build:
	docker image build --target dev -f containers/frontend/web/Dockerfile -t web:v0.0.0 .
	docker system prune

helm-install:
	helm package k8s/blog-chart; \
	helm install blog ./blog-chart-0.1.0.tgz

helm-delete:
	helm delete blog

# 一度削除してから再インストール
helm-reinstall: helm-delete helm-install

# ingressclass の設定
setup-ingressclass:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

check-ingressclass:
	kubectl wait --namespace ingress-nginx \
		--for=condition=ready pod \
		--selector=app.kubernetes.io/component=controller \
		--timeout=90s

install:
	cd source/frontend && npm install
	cd source/frontend/web && npm install
check:
	cd source/frontend/web && npm run check
fix:
	cd source/frontend/web && npm run fix
test-unit:
	cd source/frontend/web && npm run test
