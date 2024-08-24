# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    docker image build --target dev -f containers/frontend/web/Dockerfile -t $EXPECTED_REF . && \
    docker system prune && \
    kind load docker-image $EXPECTED_REF --name blog
  ''',
  deps=[
    'source/frontend',
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ],
)

yaml = helm(
  'k8s/blog-chart',
  # The release name, equivalent to helm --name
  name='blog',
  # The namespace to install in, equivalent to helm --namespace
  namespace='default',
)
k8s_yaml(yaml)
