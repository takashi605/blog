BEGIN;

-- 1. blog_posts に3件追加
INSERT INTO blog_posts (
    id,
    title,
    thumbnail_image_id,
    post_date,
    last_update_date,
    published_at
)
VALUES
  (
    '20b73825-9a6f-4901-aa42-e104a8d2c4f6',
    'ミニマル記事1',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1),
    DATE '2025-01-01',
    DATE '2025-01-01',
    CURRENT_TIMESTAMP
  ),
  (
    '91450c47-9845-4398-ad3a-275118d223ea',
    'ミニマル記事2',
    (SELECT id FROM images WHERE file_path = 'test-mechanical' LIMIT 1),
    DATE '2025-02-01',
    DATE '2025-02-01',
    CURRENT_TIMESTAMP
  ),
  (
    'f735a7b7-8bbc-4cb5-b6cf-c188734f64d3',
    'ミニマル記事3',
    (SELECT id FROM images WHERE file_path = 'test-coffee' LIMIT 1),
    DATE '2025-03-01',
    DATE '2025-03-01',
    CURRENT_TIMESTAMP
  );

-- 以下、各記事の見出し1つ＋段落1つの構成例です。必要に応じて増減してください。

-- ■ ミニマル記事1 用
-- post_contents に heading と paragraph を追加
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事1' LIMIT 1),
    'heading',
    1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事1' LIMIT 1),
    'paragraph',
    2
  );

-- heading_blocks にテキストをセット
INSERT INTO heading_blocks (id, heading_level, text_content)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事1' LIMIT 1)
       AND content_type = 'heading'
     LIMIT 1),
    2,
    'ミニマル記事1の見出し'
);

-- paragraph_blocks に対応する段落データを1件
INSERT INTO paragraph_blocks (id)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事1' LIMIT 1)
       AND content_type = 'paragraph'
     LIMIT 1)
);

-- rich_texts に1文だけ入れる
INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM paragraph_blocks
     WHERE id = (SELECT id FROM post_contents
                  WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事1' LIMIT 1)
                    AND content_type = 'paragraph'
                  LIMIT 1)
    ),
    'これはミニマル記事1の段落です。'
);

-- ■ ミニマル記事2 用
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事2' LIMIT 1),
    'heading',
    1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事2' LIMIT 1),
    'paragraph',
    2
  );

INSERT INTO heading_blocks (id, heading_level, text_content)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事2' LIMIT 1)
       AND content_type = 'heading'
     LIMIT 1),
    2,
    'ミニマル記事2の見出し'
);

INSERT INTO paragraph_blocks (id)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事2' LIMIT 1)
       AND content_type = 'paragraph'
     LIMIT 1)
);

INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM paragraph_blocks
     WHERE id = (SELECT id FROM post_contents
                  WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事2' LIMIT 1)
                    AND content_type = 'paragraph'
                  LIMIT 1)
    ),
    'これはミニマル記事2の段落です。'
);

-- ■ ミニマル記事3 用
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事3' LIMIT 1),
    'heading',
    1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'ミニマル記事3' LIMIT 1),
    'paragraph',
    2
  );

INSERT INTO heading_blocks (id, heading_level, text_content)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事3' LIMIT 1)
       AND content_type = 'heading'
     LIMIT 1),
    2,
    'ミニマル記事3の見出し'
);

INSERT INTO paragraph_blocks (id)
VALUES (
    (SELECT id FROM post_contents
     WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事3' LIMIT 1)
       AND content_type = 'paragraph'
     LIMIT 1)
);

INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM paragraph_blocks
     WHERE id = (SELECT id FROM post_contents
                  WHERE post_id = (SELECT id FROM blog_posts WHERE title = 'ミニマル記事3' LIMIT 1)
                    AND content_type = 'paragraph'
                  LIMIT 1)
    ),
    'これはミニマル記事3の段落です。'
);

COMMIT;