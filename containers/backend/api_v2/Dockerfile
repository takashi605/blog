# ベースイメージとして公式のRustイメージを使用
FROM rust:1.86-slim AS base
ARG APP_ROOT_DIR=source/backend_v2

# libssl-dev がある状態で pkg-config をインストールする必要あり
RUN apt-get update && apt-get install -y libssl-dev &&\
      apt-get install -y pkg-config iputils-ping net-tools dnsutils telnet \
      && rm -rf /var/lib/apt/lists/*

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

# キャッシュを効率的に使うために Cargo.toml だけをコピーして依存関係を解決
COPY --chown=rust:rust ./$APP_ROOT_DIR/Cargo.toml ./
COPY --chown=rust:rust ./$APP_ROOT_DIR/Cargo.lock ./
COPY --chown=rust:rust ./$APP_ROOT_DIR/bacon.toml ./
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2/Cargo.toml ./api_v2/
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2_test/Cargo.toml ./api_v2_test/
COPY --chown=rust:rust ./$APP_ROOT_DIR/common/Cargo.toml ./common/

# ワークスペースメンバーを解決するために空のソースを用意
RUN mkdir -p ./api_v2/src && echo "" > ./api_v2/src/main.rs
RUN mkdir -p ./api_v2_test/src && echo "" > ./api_v2_test/src/main.rs
RUN mkdir -p ./common/src && echo "" > ./common/src/lib.rs

RUN cargo fetch

COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2 ./api_v2
COPY --chown=rust:rust ./$APP_ROOT_DIR/common ./common

FROM base AS dev
ENV RUST_ENV=development

# 開発環境用にcurlをインストール（rootユーザーで実行）
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER rust:rust

RUN cargo install --locked bacon
RUN cargo install sqlx-cli --no-default-features --features postgres

# コンテナ起動時に実行するコマンド
CMD ["bacon", "--headless", "run-api"]

FROM base AS builder
ARG APP_ROOT_DIR=source/backend_v2

WORKDIR /$APP_ROOT_DIR
RUN cargo build --release -p blog-api-v2

# ステージング環境用に sqlx をインストール
RUN cargo install sqlx-cli --no-default-features --features postgres --root /tmp/sqlx-install

FROM gcr.io/distroless/cc-debian12:nonroot AS staging
ARG APP_ROOT_DIR=source/backend_v2
ENV RUST_ENV=production

WORKDIR /$APP_ROOT_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$APP_ROOT_DIR/target/release/blog-api-v2 ./blog-api-v2
COPY --from=builder --chown=nonroot:nonroot /tmp/sqlx-install/bin/sqlx ./sqlx
COPY --from=dev --chown=nonroot:nonroot /$APP_ROOT_DIR/api_v2/migrations ./migrations

CMD ["./blog-api-v2"]

FROM gcr.io/distroless/cc-debian12:nonroot AS prod
ARG APP_ROOT_DIR=source/backend_v2
ENV RUST_ENV=production

WORKDIR /$APP_ROOT_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$APP_ROOT_DIR/target/release/blog-api-v2 ./blog-api-v2
COPY --from=builder --chown=nonroot:nonroot /tmp/sqlx-install/bin/sqlx ./sqlx
COPY --from=dev --chown=nonroot:nonroot /$APP_ROOT_DIR/api_v2/migrations ./migrations

CMD ["./blog-api-v2"]