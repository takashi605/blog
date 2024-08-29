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
## docker 系
###
docker-image-build:
	$(MAKE) docker-image-build-web
	$(MAKE) docker-image-build-e2e
docker-image-build-web:
	docker image build --target prod -f containers/frontend/web/Dockerfile -t web:v0.0.0 .
docker-image-build-e2e:
	docker image build -f containers/frontend/e2e/Dockerfile -t e2e:v0.0.0 .

###
## kind 系
###
kind-up:
	kind create cluster --name $(CLUSTER_NAME) --config k8s/kind-config.yaml
kind-down:
	kind delete cluster --name $(CLUSTER_NAME)

kind-load-image: kind-load-web kind-load-e2e
kind-load-web:
	kind load docker-image web:v0.0.0 --name $(CLUSTER_NAME)
kind-load-e2e:
	kind load docker-image e2e:v0.0.0 --name $(CLUSTER_NAME)

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
	cd source/frontend && pnpm install
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm install

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
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- sh
e2e-run:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm run e2e-test
e2e-run-ci:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- bash -c 'CI=true pnpm run e2e'
e2e-run-ui:
	kubectl exec -it $(shell $(MAKE) e2e-pod-name) -c e2e -- pnpm run e2e-ui
