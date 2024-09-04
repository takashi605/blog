# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    make mk8s-delete-tilt-images
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'web:tilt-' | xargs -I {} docker rmi {} || true

    docker image build --target dev -f containers/frontend/web/Dockerfile -t $EXPECTED_REF .
    make mk8s-import-image $EXPECTED_REF

    docker system prune
  ''',
  deps=[
    'source/frontend',
    'containers/frontend/web'
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ]
)

custom_build(
  'e2e:v0.0.0',
  '''
    make mk8s-delete-tilt-images
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'e2e:tilt-' | xargs -I {} docker rmi {} || true

    docker image build -f containers/frontend/e2e/Dockerfile -t $EXPECTED_REF .
    make mk8s-import-image $EXPECTED_REF

    docker system prune
  ''',
  deps=[
    'source/frontend',
    'containers/frontend/e2e'
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ]
)

custom_build(
  'api:v0.0.0',
  '''
    make mk8s-delete-tilt-images
    docker images --format '{{.Repository}}:{{ .Tag }}' | grep 'api:tilt-' | xargs -I {} docker rmi {} || true

    docker image build --target dev -f containers/backend/api/Dockerfile -t $EXPECTED_REF .
    make mk8s-import-image $EXPECTED_REF

    docker system prune
  ''',
  deps=[
    'source/backend/api',
    'containers/backend/api'
  ],
  live_update=[
    sync('source/backend/api', '/source/backend/api'),
  ]
)

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='blog',
)
k8s_yaml(yaml)
