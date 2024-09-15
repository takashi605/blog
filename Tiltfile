# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    make mk8s-delete-tilt-images image_name=web;

    docker image build --target dev -f containers/frontend/web/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune;
    crictl rmi --prune || true;
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
    make mk8s-delete-tilt-images image_name=e2e;

    docker image build -f containers/frontend/e2e/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
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
    make mk8s-delete-tilt-images image_name=api;

    docker image build --target dev -f containers/backend/api/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
  ''',
  deps=[
    'source/backend/api',
    'containers/backend/api'
  ],
  live_update=[
    sync('source/backend/api', '/source/backend/api'),
  ]
)

custom_build(
  'api-test:v0.0.0',
  '''
    make mk8s-delete-tilt-images image_name=api-test;

    docker image build -f containers/backend/api-test/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
  ''',
  deps=[
    'source/backend/api-test',
    'containers/backend/api-test'
  ],
  live_update=[
    sync('source/backend/api-test', '/source/backend/api-test'),
  ]
)

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='blog',
)
k8s_yaml(yaml)
