FROM mcr.microsoft.com/playwright:v1.46.1-jammy
ARG FRONTEND_DIR=source/frontend
ARG E2E_DIR=$FRONTEND_DIR/packages/e2e

RUN npm install -g pnpm

# ベースイメージに含まれるユーザーを使う
USER pwuser

WORKDIR /$FRONTEND_DIR

# プロジェクト全体の共通設定ファイルをコピー
COPY --chown=pwuser:pwuser \
  ./$FRONTEND_DIR/tsconfig.json \
  ./$FRONTEND_DIR/.eslintrc.json \
  ./$FRONTEND_DIR/.prettierrc \
  ./$FRONTEND_DIR/package.json \
  ./$FRONTEND_DIR/package-lock.json \
  ./$FRONTEND_DIR/pnpm-lock.yaml \
  ./$FRONTEND_DIR/pnpm-workspace.yaml \
  ./$FRONTEND_DIR/.npmrc \
  ./

RUN mkdir -p /$E2E_DIR

# プロジェクトのファイル全体をコピー
COPY --chown=pwuser:pwuser ./$E2E_DIR /$E2E_DIR

RUN pnpm install

# 基本的に exec でコマンドを実行する運用のため sleep で起動を維持
CMD ["sleep", "infinity"]
