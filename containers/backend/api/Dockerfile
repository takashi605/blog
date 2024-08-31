# ベースイメージとして公式のRustイメージを使用
FROM rust:1.80-slim
ARG ROOT_DIR=source/backend/api

# ワーキングディレクトリを作成
WORKDIR /$ROOT_DIR

# Cargo.toml と Cargo.lock をコピー
COPY ./$ROOT_DIR ./

# コンテナ起動時に実行するコマンド
CMD ["cargo", "run"]
