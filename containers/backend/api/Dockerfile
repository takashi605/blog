# ベースイメージとして公式のRustイメージを使用
FROM rust:1.80-slim as base
ARG ROOT_DIR=source/backend/api

# ワーキングディレクトリを作成
WORKDIR /$ROOT_DIR

# Cargo.toml と Cargo.lock をコピー
COPY ./$ROOT_DIR ./

FROM base as dev

# コンテナ起動時に実行するコマンド
CMD ["cargo", "run"]
