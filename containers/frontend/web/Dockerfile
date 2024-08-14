# / node の環境設定用に slim イメージを取得 /
FROM node:20-slim AS node

# / 基本的な設定を行うステージ /
FROM ubuntu:20.04 AS base

RUN apt-get update \
  && apt-get -qq install -y --no-install-recommends \
  tini \
  && rm -rf /var/lib/apt/lists/*

# / ↓↓ Node.js の環境設定 ↓↓ /
# おそらく Node.js のヘッダーファイルをコピーしている
# Chat GPT に聞いただけで具体的な情報元は見つけられなかった
# 以下の1行以外は情報元を発見済みのため信頼できそう
COPY --from=node /usr/local/include/ /usr/local/include/

# グローバルにインストールされた npm パッケージ群をコピー
COPY --from=node /usr/local/lib/ /usr/local/lib/
# npm 等の実行可能なバイナリ群をコピー
COPY --from=node /usr/local/bin/ /usr/local/bin/
# Node.js のパッケージマネージャーのバージョン管理ツールを停止・最有効化
# これにより、バージョン管理について最新の Node 環境に合わせることが可能
# Node 環境はすべて同じ場所からコピーしているため理論上は不要な処理だが、
# corepack そのものの挙動変更や今後他の環境からコピーする場合を考慮して実行する
RUN corepack disable && corepack enable
# / ↑↑ Node.js の環境設定 ↑↑ /

# プロジェクトのユーザー,グループを作成
RUN groupadd --gid 1000 node \
  && useradd --uid 1000 --gid node --shell /bin/bash --create-home node

# 作業ディレクトリを作成し、所有者を node ユーザーに変更
RUN mkdir -p /source/frontend/web \
  && chown -R node:node /source

# ユーザーを指定
# mkdir よりも前に記述するとパーミッションエラーが発生する
USER node

WORKDIR /source/frontend

# プロジェクト全体の共通設定ファイルをコピー
COPY --chown=node:node \
  ./source/frontend/tsconfig.json \
  ./source/frontend/.eslintrc.json \
  ./source/frontend/.prettierrc \
  ./source/frontend/package.json \
  ./source/frontend/package-lock.json \
  ./

RUN npm ci

# / 開発環境用ステージ /
FROM base AS dev
ENV NODE_ENV=development

EXPOSE 3000
USER node

WORKDIR /source/frontend/web

# プロジェクトのファイル全体をコピー
COPY --chown=node:node ./source/frontend/web .

RUN npm ci

CMD npm run dev


# / ビルド用ステージ /
FROM dev as builder

# production にしないと build 時にエラーする
ENV NODE_ENV production

USER node

WORKDIR /source/frontend/web

# .next ディレクトリにビルド成果物を生成
RUN npm run build


# / 本番環境用ステージ /
FROM gcr.io/distroless/nodejs22-debian12:nonroot as prod

ENV NODE_ENV production

WORKDIR /source/frontend/web

# ビルド用ステージから必要なファイルのみをコピー
COPY --from=builder --chown=nonroot:nonroot /source/frontend/web/public ./public
COPY --from=builder --chown=nonroot:nonroot /source/frontend/web/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /source/frontend/web/.next/static ./.next/static

# ポートを開放
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME="0.0.0.0"

# 実行開始
CMD ["server.js"]
