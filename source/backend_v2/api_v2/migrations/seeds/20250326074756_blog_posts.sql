BEGIN;

INSERT INTO pickup_posts (
  id,
  post_id
)
VALUES
  (
    '5c5b5d53-a58a-4a54-8806-3d43ecec82a5',
    '20b73825-9a6f-4901-aa42-e104a8d2c4f6' -- 過去のマイグレーションで挿入した記事の id を指定
  ),
  (
    '50714c9c-268e-4186-9b7d-5d583516299b',
    '91450c47-9845-4398-ad3a-275118d223ea' -- 過去のマイグレーションで挿入した記事の id を指定
  ),
  (
    'fc830be1-fbdb-4ffe-962d-741c7b14f3ac',
    '672f2772-72b5-404a-8895-b1fbbf310801' -- 過去のマイグレーションで挿入した記事の id を指定
  );
COMMIT;
