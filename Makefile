CLUSTER_NAME = blog

###
## tilt 系
###
tilt-up:
	tilt up
tilt-down:
	tilt down
	$(MAKE) tilt-delete-image

# tilt によって生成された Docker Image を全て削除する
tilt-delete-image:
	docker images --format '{{.Repository}}:{{.Tag}}' | grep 'tilt-' | xargs -I {} docker rmi {}

###
## kind 系
###
kind-up:
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down:
	kind delete cluster --name $(CLUSTER_NAME)

###
## ingressclass 系
## kind を入れなおしたら実行する必要あり
###
ingressclass-setup:
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml

# ingressclass-setup でリソースが生成されるまで待機する
ingressclass-is-complate-setup:
	kubectl wait --namespace ingress-nginx \
		--for=condition=ready pod \
		--selector=app.kubernetes.io/component=controller \
		--timeout=90s

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
frontend-install:
	cd source/frontend && npm install
	cd source/frontend/web && npm install
frontend-check:
	cd source/frontend/web && npm run check
frontend-fix:
	cd source/frontend/web && npm run fix
frontend-test-unit:
	cd source/frontend/web && npm run test

###
## e2e 系
###
e2e-pod-name:
	@kubectl get pods -o custom-columns=:metadata.name | grep e2e

e2e-sh:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- sh
e2e-run:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- npm run e2e
e2e-run-ui:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- npm run e2e-ui
