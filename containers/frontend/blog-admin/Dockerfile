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
RUN pnpm tsc

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

# ビルド時に Cloudinary の認証情報を設定
ARG NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
ARG NEXT_PUBLIC_CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

# ビルド時に Basic 認証情報を設定
ARG NEXT_PUBLIC_BASIC_AUTHENTICATION
ENV NEXT_PUBLIC_BASIC_AUTHENTICATION=$NEXT_PUBLIC_BASIC_AUTHENTICATION

# ビルド時に実際の api の URL を指定
ARG NEXT_PUBLIC_WEB_URL="http://blog.example"
ARG NEXT_PUBLIC_API_URL="http://api.blog.example"

ENV NEXT_PUBLIC_WEB_URL=$NEXT_PUBLIC_WEB_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}" \
    NEXT_PUBLIC_CLOUDINARY_API_KEY="${NEXT_PUBLIC_CLOUDINARY_API_KEY}" \
    CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}"

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

# 実行開始
CMD ["server.js"]
