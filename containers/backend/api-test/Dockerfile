FROM rust:1.80-slim
ARG APP_ROOT_DIR=source/backend/api-test

RUN apt update && \
    apt install -y pkg-config libssl-dev

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

COPY --chown=rust:rust ./$APP_ROOT_DIR ./

# 基本的に exec でコマンドを実行する運用のため sleep で起動を維持
CMD ["sleep", "infinity"]
