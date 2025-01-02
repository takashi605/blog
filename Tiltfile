# Dockerビルド設定
custom_build(
  'web:v0.0.0',
  '''
    docker image build --target dev -f containers/frontend/web/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune;
    crictl rmi --prune || true;
    make mk8s-prune;
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
  'blog-admin:v0.0.0',
  '''
    docker image build --target dev -f containers/frontend/blog-admin/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune;
    crictl rmi --prune || true;
    make mk8s-prune;
  ''',
  deps=[
    'source/frontend',
    'containers/frontend/blog-admin'
  ],
  live_update=[
    sync('source/frontend', '/source/frontend'),
  ]
)

custom_build(
  'e2e:v0.0.0',
  '''
    docker image build -f containers/frontend/e2e/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
    make mk8s-prune;
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
    docker image build --target dev -f containers/backend/api/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
    make mk8s-prune;
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
    docker image build -f containers/backend/api_test/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
    make mk8s-prune;
  ''',
  deps=[
    'source/backend/api_test',
    'containers/backend/api_test'
  ],
  live_update=[
    sync('source/backend/api_test', '/source/backend/api_test'),
  ]
)

custom_build(
  'postgres:v0.0.0',
  '''
    docker image build -f containers/db/postgres/Dockerfile -t $EXPECTED_REF .;
    make mk8s-import-image image_name=$EXPECTED_REF;

    docker system prune -f;
    crictl rmi --prune || true;
    make mk8s-prune;
  ''',
  deps=[
    'containers/db/postgres'
  ]
)

# chart の読み込み
yaml = helm(
  'k8s/blog-chart',
  name='blog',
  namespace='blog',
)
k8s_yaml(yaml)

docker_prune_settings( disable = False, max_age_mins = 1, num_builds = 1, keep_recent = 1 )
