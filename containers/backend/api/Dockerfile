# ベースイメージとして公式のRustイメージを使用
FROM rust:1.80-slim as base
ARG USER_HOME_DIR=/usr/src/app
ARG APP_ROOT_DIR=source/backend/api

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -m -d $USER_HOME_DIR -s /bin/bash -u 1000 -g rust rust

# ユーザーの権限を変更しておく
RUN chown -R rust:rust $USER_HOME_DIR

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$USER_HOME_DIR/$APP_ROOT_DIR

# Cargo.toml と Cargo.lock をコピー
COPY --chown=rust:rust ./$APP_ROOT_DIR ./

FROM base as dev

# コンテナ起動時に実行するコマンド
CMD ["cargo", "run"]
