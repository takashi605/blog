FROM rust:1.80-slim
ARG APP_ROOT_DIR=source/backend/api-test

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

COPY --chown=rust:rust ./$APP_ROOT_DIR ./

# コンテナ起動時に実行するコマンド
CMD ["cargo", "run"]
