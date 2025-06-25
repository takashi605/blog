BEGIN;

INSERT INTO popular_posts (
  post_id
)
VALUES
  (
    '91450c47-9845-4398-ad3a-275118d223ea' -- 過去のマイグレーションで挿入した記事の id を指定
  ),
  (
    'f735a7b7-8bbc-4cb5-b6cf-c188734f64d3' -- 過去のマイグレーションで挿入した記事の id を指定
  ),
  (
    '672f2772-72b5-404a-8895-b1fbbf310801' -- 過去のマイグレーションで挿入した記事の id を指定
  );

COMMIT;
