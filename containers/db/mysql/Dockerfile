# ベースイメージとして公式のMySQLイメージを使用
FROM mysql:8.0

# 環境変数を設定
# TODO テスト用に適当に設定しているので適切な管理に変更する
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=test_db
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=password

# デフォルトのMySQLポートを開放
EXPOSE 3306
