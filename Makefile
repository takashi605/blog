CLUSTER_NAME = blog

kind-up: 
	kind create cluster --name $(CLUSTER_NAME) --config k8s/cluster/kind-config.yaml
kind-down: 
	kind delete cluster --name $(CLUSTER_NAME)
