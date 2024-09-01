# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker exec $kind_node ctr -n k8s.io images ls | grep 'web:tilt-' | awk '{print $1}' | \
    xargs -r docker exec $kind_node ctr -n k8s.io images rm
    docker system prune

    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'web:tilt-' | xargs -I {} docker rmi {}
    docker image build --target dev -f containers/frontend/web/Dockerfile -t $EXPECTED_REF . && \
    kind load docker-image $EXPECTED_REF --name blog
  ''',
  deps=[
    'source/frontend',
    'containers/frontend/web'
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ],
)

custom_build(
  'e2e:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker exec $kind_node ctr -n k8s.io images ls | grep 'e2e:tilt-' | awk '{print $1}' | \
    xargs -r docker exec $kind_node ctr -n k8s.io images rm
    docker system prune

    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'e2e:tilt-' | xargs -I {} docker rmi {}
    docker image build -f containers/frontend/e2e/Dockerfile -t $EXPECTED_REF . && \
    kind load docker-image $EXPECTED_REF --name blog
  ''',
  deps=[
    'source/frontend',
    'containers/frontend/e2e'
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ],
)

custom_build(
  'api:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker exec $kind_node ctr -n k8s.io images ls | grep 'api:tilt-' | awk '{print $1}' | \
    xargs -r docker exec $kind_node ctr -n k8s.io images rm
    docker system prune

    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'api:tilt-' | xargs -I {} docker rmi {}
    docker image build --target dev -f containers/backend/api/Dockerfile -t $EXPECTED_REF . && \
    kind load docker-image $EXPECTED_REF --name blog
  ''',
  deps=[
    'source/backend/api',
    'containers/backend/api'
  ],
  live_update=[
    sync('source/backend/api', '/source/backend/api'),
  ],
)

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='default',
)
k8s_yaml(yaml)
