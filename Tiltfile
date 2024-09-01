# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'web:tilt-' | xargs -I {} docker rmi {}

    docker exec $kind_node ctr -n k8s.io images prune --all
    docker system prune -f

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
  tag='v0.0.0'
)

custom_build(
  'e2e:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'e2e:tilt-' | xargs -I {} docker rmi {}

    docker exec $kind_node ctr -n k8s.io images prune --all
    docker system prune -f

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
  tag='v0.0.0'
)

custom_build(
  'api:v0.0.0',
  '''
    kind_node=$(docker ps --filter "name=blog-worker" --format "{{.ID}}")
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'api:tilt-' | xargs -I {} docker rmi {}

    docker exec $kind_node ctr -n k8s.io images prune --all
    docker system prune -f

    docker image build --target prod -f containers/backend/api/Dockerfile -t $EXPECTED_REF . && \
    kind load docker-image $EXPECTED_REF --name blog
  ''',
  deps=[
    'source/backend/api',
    'containers/backend/api'
  ],
  live_update=[
    sync('source/backend/api', '/source/backend/api'),
  ],
  tag='v0.0.0'
)

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='default',
)
k8s_yaml(yaml)
