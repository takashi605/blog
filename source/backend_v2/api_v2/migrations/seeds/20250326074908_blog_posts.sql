BEGIN;

INSERT INTO top_tech_pick_post (
  id,
  post_id
)
VALUES
  (
    '4f7c188d-33aa-4c2c-bcf1-f9e64fbfaa2c',
    '672f2772-72b5-404a-8895-b1fbbf310801' -- 過去のマイグレーションで挿入した記事の id を指定
  );

COMMIT;