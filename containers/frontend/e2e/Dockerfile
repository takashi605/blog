FROM ubuntu:20.04 AS base
ARG FRONTEND_DIR=source/frontend
ARG E2E_DIR=$FRONTEND_DIR/packages/e2e

WORKDIR /$FRONTEND_DIR
COPY ./$FRONTEND_DIR ./
RUN rm -rf /$FRONTEND_DIR/packages/web

FROM mcr.microsoft.com/playwright:v1.53.1-noble
ARG FRONTEND_DIR=source/frontend
ARG E2E_DIR=$FRONTEND_DIR/packages/e2e

RUN npm install -g pnpm@9.9.0

# ベースイメージに含まれるユーザーを使う
USER pwuser

WORKDIR /$FRONTEND_DIR

# プロジェクト全体の共通設定ファイルをコピー
WORKDIR /$FRONTEND_DIR
COPY --from=base --chown=pwuser:pwuser ./$FRONTEND_DIR ./

RUN pnpm install
RUN pnpm tsc

# 基本的に exec でコマンドを実行する運用のため sleep で起動を維持
CMD ["sleep", "infinity"]
