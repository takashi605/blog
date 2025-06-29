BEGIN;

-- E2Eテスト用の記事編集テストデータ
-- テストID: e2e-edit-update-date-test

-- E2Eテスト専用記事を1件追加
INSERT INTO blog_posts (
    id,
    title,
    thumbnail_image_id,
    post_date,
    last_update_date,
    published_at
)
VALUES (
    'e2e00000-ed17-4000-b000-000000000001',
    'E2E編集テスト用記事',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1),
    DATE '2024-06-15',
    DATE '2024-06-15',
    DATE '2024-06-15'
);

-- post_contents に heading と paragraph を追加
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    'e2e00000-ed17-4000-b000-000000000001',
    'heading',
    1
  ),
  (
    gen_random_uuid(),
    'e2e00000-ed17-4000-b000-000000000001',
    'paragraph',
    2
  );

-- heading_blocks にテキストをセット
INSERT INTO heading_blocks (id, heading_level, text_content)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = 'e2e00000-ed17-4000-b000-000000000001'
       AND content_type = 'heading'
     LIMIT 1),
    2,
    'E2Eテスト用見出し'
);

-- paragraph_blocks に対応する段落データを1件
INSERT INTO paragraph_blocks (id)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = 'e2e00000-ed17-4000-b000-000000000001'
       AND content_type = 'paragraph'
     LIMIT 1)
);

-- rich_texts に1文だけ入れる
INSERT INTO rich_texts (id, paragraph_block_id, text_content, sort_order)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM paragraph_blocks
     WHERE id = (SELECT id FROM post_contents
                  WHERE post_id = 'e2e00000-ed17-4000-b000-000000000001'
                    AND content_type = 'paragraph'
                  LIMIT 1)
    ),
    'これはE2E編集テスト用のサンプル記事です。',
    1
);

COMMIT;
