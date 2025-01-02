FROM rust:1.81-slim
ARG APP_ROOT_DIR=source/backend

RUN apt update && \
    apt install -y pkg-config libssl-dev

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

COPY --chown=rust:rust ./$APP_ROOT_DIR/Cargo.toml ./
COPY --chown=rust:rust ./$APP_ROOT_DIR/api/Cargo.toml ./api/
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_test/Cargo.toml ./api_test/

# ワークスペースメンバーを解決するために空のソースを用意
RUN mkdir -p ./api/src && echo "" > ./api/src/main.rs
RUN mkdir -p ./api_test/src && echo "" > ./api_test/src/main.rs

RUN cargo fetch

COPY --chown=rust:rust ./$APP_ROOT_DIR/api_test ./api_test

WORKDIR /$APP_ROOT_DIR/api_test

# 基本的に exec でコマンドを実行する運用のため sleep で起動を維持
CMD ["sleep", "infinity"]
