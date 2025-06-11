FROM rust:1.86-slim
ARG APP_ROOT_DIR=source/backend_v2

RUN apt update && \
    apt install -y pkg-config libssl-dev

# グループとユーザーを追加
RUN groupadd -g 1000 rust && \
    useradd -s /bin/bash -u 1000 -g rust rust

# ユーザーを切り替え
USER rust:rust

# ワーキングディレクトリを作成
WORKDIR /$APP_ROOT_DIR

# キャッシュを効率的に使うために Cargo.toml だけをコピーして依存関係を解決
COPY --chown=rust:rust ./$APP_ROOT_DIR/Cargo.toml ./
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2/Cargo.toml ./api_v2/
COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2_test/Cargo.toml ./api_v2_test/
COPY --chown=rust:rust ./$APP_ROOT_DIR/common/Cargo.toml ./common/

# ワークスペースメンバーを解決するために空のソースを用意
RUN mkdir -p ./api_v2/src && echo "" > ./api_v2/src/main.rs
RUN mkdir -p ./api_v2_test/src && echo "" > ./api_v2_test/src/main.rs
RUN mkdir -p ./common/src && echo "" > ./common/src/lib.rs

RUN cargo fetch

COPY --chown=rust:rust ./$APP_ROOT_DIR/api_v2_test ./api_v2_test
COPY --chown=rust:rust ./$APP_ROOT_DIR/common ./common

WORKDIR /$APP_ROOT_DIR/api_v2_test

# 基本的に exec でコマンドを実行する運用のため sleep で起動を維持
CMD ["sleep", "infinity"]