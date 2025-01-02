-- テーブルの削除
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS text_styles;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS post_contents;
DROP TABLE IF EXISTS image_blocks;
DROP TABLE IF EXISTS heading_blocks;
DROP TABLE IF EXISTS text_blocks;
DROP TABLE IF EXISTS text_block_styles;

-- テーブルの作成
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255),
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
    heading_text VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS text_blocks (
    id UUID PRIMARY KEY,
    content_id UUID NOT NULL REFERENCES post_contents(id),
    text_content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS text_block_styles (
    style_id UUID NOT NULL REFERENCES text_styles(id),
    text_block_id UUID NOT NULL REFERENCES text_blocks(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (style_id, text_block_id));

-- 1. images に挿入
INSERT INTO images (id, file_name, file_path, caption)
VALUES
  (gen_random_uuid(), 'thumbnail1.png', '/path/to/thumbnail1.png', 'Thumbnail caption'),
  (gen_random_uuid(), 'photo1.png', '/path/to/photo1.png', 'Photo #1'),
  (gen_random_uuid(), 'photo2.png', '/path/to/photo2.png', 'Photo #2');

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
    gen_random_uuid(),
    'First Blog Post',
    (SELECT id FROM images WHERE file_name = 'thumbnail1.png' LIMIT 1),
    CURRENT_DATE,
    CURRENT_DATE,
    CURRENT_TIMESTAMP
);

-- 3. post_contents に挿入
--   blog_posts の post_id と紐付ける
--   content_type, sort_order を任意に指定
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1),
    'text', 1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1),
    'heading', 2
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1),
    'image', 3
  );

-- 4. heading_blocks に挿入
--   "heading" タイプの content_id を拾ってきて紐付ける
INSERT INTO heading_blocks (id, content_id, heading_level, heading_text)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM post_contents
       WHERE content_type = 'heading'
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1)
       LIMIT 1
    ),
    2,
    'This is a sub-heading'
);

-- 5. text_blocks に挿入
--   "text" タイプの content_id を拾ってきて紐付ける
INSERT INTO text_blocks (id, content_id, text_content)
VALUES (
    gen_random_uuid(),
    (
      SELECT id
        FROM post_contents
       WHERE content_type = 'text'
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1)
       LIMIT 1
    ),
    'Hello world! This is the first blog content.'
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
         AND post_id = (SELECT id FROM blog_posts WHERE title = 'First Blog Post' LIMIT 1)
       LIMIT 1
    ),
    (SELECT id FROM images WHERE file_name = 'photo1.png' LIMIT 1)
);

-- 7. text_styles に挿入 (スタイルのマスタ)
INSERT INTO text_styles (id, style_type)
VALUES
  (gen_random_uuid(), 'bold'),
  (gen_random_uuid(), 'italic'),
  (gen_random_uuid(), 'underline');

-- 8. styles_for_text に挿入 (テキストブロックにスタイルを適用する中間テーブル)
--   ここでは "bold" スタイルを適用する例
INSERT INTO text_block_styles (style_id, text_block_id)
VALUES (
    (
      SELECT id
        FROM text_styles
       WHERE style_type = 'bold'
       LIMIT 1
    ),
    (
      SELECT id
        FROM text_blocks
        LIMIT 1
    )
);
