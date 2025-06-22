# ベースイメージとして公式のRustイメージを使用
FROM rust:1.86-slim AS base
ARG APP_ROOT_DIR=source/backend

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
COPY --chown=rust:rust ./$APP_ROOT_DIR/api/Cargo.toml ./api/
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_test/Cargo.toml ./api_test/
COPY --chown=rust:rust ./$APP_ROOT_DIR/common/Cargo.toml ./common/

# ワークスペースメンバーを解決するために空のソースを用意
RUN mkdir -p ./api/src && echo "" > ./api/src/main.rs
RUN mkdir -p ./api_test/src && echo "" > ./api_test/src/main.rs
RUN mkdir -p ./common/src && echo "" > ./common/src/lib.rs

RUN cargo fetch

COPY --chown=rust:rust ./$APP_ROOT_DIR/api ./api
COPY --chown=rust:rust ./$APP_ROOT_DIR/common ./common

FROM base AS dev
ENV RUST_ENV=development
# 増分コンパイルを有効化
ENV CARGO_INCREMENTAL=1
# コンパイルキャッシュを最適化
ENV CARGO_TARGET_DIR=/source/backend/target

# 開発環境用にcurlをインストール（rootユーザーで実行）
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
USER rust:rust

RUN cargo install --locked bacon
RUN cargo install sqlx-cli --no-default-features --features postgres

# targetディレクトリの権限を設定
RUN mkdir -p /source/backend/target && chown rust:rust /source/backend/target

# コンテナ起動時に実行するコマンド
CMD ["bacon", "--headless", "run-api"]

FROM base AS builder
ARG APP_ROOT_DIR=source/backend

WORKDIR /$APP_ROOT_DIR
RUN cargo build --release -p blog-api

# ステージング環境用に sqlx をインストール
RUN cargo install sqlx-cli --no-default-features --features postgres --root /tmp/sqlx-install

FROM gcr.io/distroless/cc-debian12:nonroot AS staging
ARG APP_ROOT_DIR=source/backend
ENV RUST_ENV=production

WORKDIR /$APP_ROOT_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$APP_ROOT_DIR/target/release/blog-api ./blog-api
COPY --from=builder --chown=nonroot:nonroot /tmp/sqlx-install/bin/sqlx ./sqlx
COPY --from=dev --chown=nonroot:nonroot /$APP_ROOT_DIR/api/migrations ./migrations

CMD ["./blog-api"]

FROM gcr.io/distroless/cc-debian12:nonroot AS prod
ARG APP_ROOT_DIR=source/backend
ENV RUST_ENV=production

WORKDIR /$APP_ROOT_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$APP_ROOT_DIR/target/release/blog-api ./blog-api
COPY --from=builder --chown=nonroot:nonroot /tmp/sqlx-install/bin/sqlx ./sqlx
COPY --from=dev --chown=nonroot:nonroot /$APP_ROOT_DIR/api/migrations ./migrations

CMD ["./blog-api"]