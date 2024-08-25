FROM mcr.microsoft.com/playwright:v1.46.1-jammy

# ベースイメージに含まれるユーザーを使う
USER pwuser

WORKDIR /source/frontend

# プロジェクト全体の共通設定ファイルをコピー
COPY --chown=pwuser:pwuser \
  ./source/frontend/tsconfig.json \
  ./source/frontend/.eslintrc.json \
  ./source/frontend/.prettierrc \
  ./source/frontend/package.json \
  ./source/frontend/package-lock.json \
  ./

# node_modules のみ .dockerignore および volume trick で除外しているため、
# npm ci で依存関係を解決
RUN npm install

WORKDIR /source/frontend/e2e

# プロジェクトのファイル全体をコピー
COPY --chown=pwuser:pwuser ./source/frontend/e2e .

RUN npm install

CMD ["npm","run","e2e-ui"]
