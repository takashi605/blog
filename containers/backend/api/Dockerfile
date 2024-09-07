# ベースイメージとして公式のRustイメージを使用
FROM rust:1.80-slim as base
ARG APP_ROOT_DIR=source/backend/api

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

COPY --chown=rust:rust ./$APP_ROOT_DIR ./

FROM base as dev

# コンテナ起動時に実行するコマンド
CMD ["cargo", "run"]

FROM base as builder
ARG APP_ROOT_DIR=source/backend/api

WORKDIR /$APP_ROOT_DIR
RUN cargo build --release

FROM gcr.io/distroless/cc-debian12:nonroot as prod
ARG APP_ROOT_DIR=source/backend/api

WORKDIR /$APP_ROOT_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$APP_ROOT_DIR/target/release/api ./api

CMD ["./api"]
