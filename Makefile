CLUSTER_NAME = blog

tilt-up:
	tilt up
tilt-down:
	tilt down
	$(MAKE) tilt-delete-image

# tilt によって生成された Docker Image を全て削除する
tilt-delete-image:
	docker images --format '{{.Repository}}:{{.Tag}}' | grep 'tilt-' | xargs -I {} docker rmi {}

kind-up:
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down:
	kind delete cluster --name $(CLUSTER_NAME)

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
