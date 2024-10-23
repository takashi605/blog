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

# / ビルド用ステージ /
FROM dev as builder
ENV NODE_ENV produciton

USER node
ARG FRONTEND_DIR=source/frontend
ARG ADMIN_DIR=$FRONTEND_DIR/packages/blog-admin

WORKDIR /$FRONTEND_DIR

RUN pnpm -F blog-admin deploy ./packages/pruned

WORKDIR /$FRONTEND_DIR/packages/pruned

ENV NEXT_PUBLIC_API_URL="http://api.blog.example"

# .next ディレクトリにビルド成果物を生成
RUN pnpm exec next build

# / 本番環境用ステージ /
FROM gcr.io/distroless/nodejs18-debian12:nonroot as prod

ENV NODE_ENV production
ARG FRONTEND_DIR=source/frontend
ARG ADMIN_DIR=$FRONTEND_DIR/packages/blog-admin

WORKDIR /$ADMIN_DIR

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /$FRONTEND_DIR/packages/pruned/public ./public
COPY --from=builder --chown=nonroot:nonroot /$FRONTEND_DIR/packages/pruned/.next/standalone/packages/pruned ./
COPY --from=builder --chown=nonroot:nonroot /$FRONTEND_DIR/packages/pruned/.next/static ./.next/static

# ポートを開放
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_PUBLIC_API_URL="http://api.blog.example"

# 実行開始
CMD ["server.js"]
