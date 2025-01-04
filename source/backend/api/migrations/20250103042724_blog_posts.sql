-- テーブルの作成
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS text_styles (
    id UUID PRIMARY KEY,
    style_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    thumbnail_image_id UUID NOT NULL REFERENCES images(id),
    post_date DATE NOT NULL,
    last_update_date DATE NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS post_contents (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id),
    content_type VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS image_blocks (
    id UUID PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES post_contents(id),
    image_id UUID NOT NULL REFERENCES images(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS heading_blocks (
    id UUID PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES post_contents(id),
    heading_level SMALLINT NOT NULL,
    text_content VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS paragraph_blocks (
    id UUID PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES post_contents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS rich_texts (
    id UUID PRIMARY KEY,
    paragraph_block_id UUID NOT NULL REFERENCES paragraph_blocks(id),
    text_content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS rich_text_styles (
    style_id UUID NOT NULL REFERENCES text_styles(id),
    rich_text_id UUID NOT NULL REFERENCES rich_texts(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (style_id, rich_text_id));

-- 1. images に挿入
INSERT INTO images (id, file_name, file_path, caption)
VALUES
  (gen_random_uuid(), 'book', 'test-book', '本の画像'),
  (gen_random_uuid(), 'mechanical', 'test-mechanical', '機械の画像'),
  (gen_random_uuid(), 'coffee', 'test-coffee', 'コーヒーの画像');

-- 2. blog_posts に挿入
INSERT INTO blog_posts (
    id,
    title,
    thumbnail_image_id,
    post_date,
    last_update_date,
    published_at
)
VALUES (
    '672f2772-72b5-404a-8895-b1fbbf310801',
    'テストタイトル',
    (SELECT id FROM images WHERE file_path = 'test-book'),
    DATE '2021-01-01',
    Date '2021-01-02',
    CURRENT_TIMESTAMP
);

-- 3. post_contents に挿入
--   blog_posts の post_id と紐付ける
--   content_type, sort_order を任意に指定
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1),
    'paragraph', 2
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1),
    'heading', 1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1),
    'image', 3
  );

-- 4. heading_blocks に挿入
--   "heading" タイプの content_id を拾ってきて紐付ける
INSERT INTO heading_blocks (id, content_id, heading_level, text_content)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM post_contents
       WHERE content_type = 'heading'
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1)
       LIMIT 1
    ),
    2,
    '見出し2'
);

-- 5. paragraph_blocks に挿入
--   "paragraph" タイプの content_id を拾ってきて紐付ける
INSERT INTO paragraph_blocks (id, content_id)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM post_contents
       WHERE content_type = 'paragraph'
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1)
       LIMIT 1
    )
);

INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM paragraph_blocks
        WHERE content_id = (
          SELECT id
            FROM post_contents
            WHERE content_type = 'paragraph'
            AND post_id = (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1)
        )
       LIMIT 1
    ),
    '段落'
);

-- 6. image_blocks に挿入
--   "image" タイプの content_id と images.image_id を紐付ける
INSERT INTO image_blocks (id, content_id, image_id)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM post_contents
       WHERE content_type = 'image'
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'テストタイトル' LIMIT 1)
       LIMIT 1
    ),
    (SELECT id FROM images WHERE file_path = 'test-coffee' LIMIT 1)
);

-- 7. text_styles に挿入 (スタイルのマスタ)
INSERT INTO text_styles (id, style_type)
VALUES
  (gen_random_uuid(), 'bold'),
  (gen_random_uuid(), 'italic'),
  (gen_random_uuid(), 'underline');

-- 8. paragraph_block_styles に挿入 (テキストブロックにスタイルを適用する中間テーブル)
--   ここでは "bold" スタイルを適用する例
INSERT INTO rich_text_styles (style_id, rich_text_id)
VALUES (
    (
      SELECT id
        FROM text_styles
       WHERE style_type = 'bold'
       LIMIT 1
    ),
    (
      SELECT id
        FROM rich_texts
        LIMIT 1
    )
);
