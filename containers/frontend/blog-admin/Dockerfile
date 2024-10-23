# / node の環境設定用に slim イメージを取得 /
FROM node:20-slim AS node

# / 基本的な設定を行うステージ /
FROM node AS base
ARG FRONTEND_DIR=source/frontend
ARG ADMIN_DIR=$FRONTEND_DIR/packages/blog-admin

RUN npm install -g pnpm@9.9.0

# 作業ディレクトリを作成し、所有者を node ユーザーに変更
RUN mkdir -p /$ADMIN_DIR \
  && chown -R node:node /source

# ユーザーを指定
# mkdir よりも前に記述するとパーミッションエラーが発生する
USER node

WORKDIR /$FRONTEND_DIR

# プロジェクトファイルをコピー
COPY --chown=node:node ./$FRONTEND_DIR ./
RUN rm -rf /$FRONTEND_DIR/packages/e2e

RUN pnpm install

# / 開発環境用ステージ /
FROM base AS dev
ENV NODE_ENV=development

EXPOSE 3000
USER node

WORKDIR /$FRONTEND_DIR

CMD ["pnpm", "run", "admin-dev"]
