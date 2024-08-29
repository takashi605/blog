# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    docker images --format 'web:{{.Tag}}' | grep 'tilt-' | xargs -I {} docker rmi {}
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
    docker images --format 'e2e:{{.Tag}}' | grep 'tilt-' | xargs -I {} docker rmi {}
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

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='default',
)
k8s_yaml(yaml)
