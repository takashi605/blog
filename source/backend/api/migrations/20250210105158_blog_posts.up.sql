BEGIN;
-- テーブルの作成
CREATE TABLE IF NOT EXISTS images (
    id UUID PRIMARY KEY,
    file_name VARCHAR(255),
    file_path VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS text_styles (
    id UUID PRIMARY KEY,
    style_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    thumbnail_image_id UUID NOT NULL REFERENCES images(id),
    post_date DATE NOT NULL,
    last_update_date DATE NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_contents (
    id UUID PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES blog_posts(id),
    content_type VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS image_blocks (
    content_id UUID PRIMARY KEY REFERENCES post_contents(id),
    image_id UUID NOT NULL REFERENCES images(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS heading_blocks (
    content_id UUID PRIMARY KEY REFERENCES post_contents(id),
    heading_level SMALLINT NOT NULL,
    text_content VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS paragraph_blocks (
    content_id UUID PRIMARY KEY REFERENCES post_contents(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rich_texts (
    id UUID PRIMARY KEY,
    paragraph_block_id UUID NOT NULL REFERENCES paragraph_blocks(content_id),
    text_content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rich_text_styles (
    style_id UUID NOT NULL REFERENCES text_styles(id),
    rich_text_id UUID NOT NULL REFERENCES rich_texts(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (style_id, rich_text_id)
);

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
    '初めての技術スタックへの挑戦',
    (SELECT id FROM images WHERE file_path = 'test-coffee'),
    DATE '2021-01-01',
    Date '2021-01-02',
    CURRENT_TIMESTAMP
);

-- 3. post_contents に挿入
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    '8c4c5396-49bf-4ee6-839e-20989b004470',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'paragraph', 1
  ),
  (
    '16550f62-63f4-45fe-8a06-7922780eba79',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'heading', 2
  ),
  (
    'c6bb2773-6b4d-42af-ae31-ee95aea81f2b',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'heading', 3
  ),
  (
    '7b33c39f-6543-43ec-a660-9428e5bc3949',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'paragraph', 4
  ),
  (
    '3420346d-a3ea-46c3-8534-77e54f4d7085',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'heading', 5
  ),
  (
    'caea5ad7-3b97-4fc0-941a-20a598a4742c',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'heading', 6
  ),
  (
    '35739804-80f4-4307-b5b6-8999466a618e',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'paragraph', 7
  ),
  (
    '5cf4caf3-2f19-4bc5-8b43-2d98b0b13a71',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'heading', 8
  ),
  (
    'a0d774d7-5772-4cde-9593-788e3cdf5269',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'image', 9
  ),
  (
    'ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'paragraph', 10
  );

-- 4. heading_blocks に挿入 (id カラムを削除し、content_id を PRIMARY KEY としたので content_id のみ)
INSERT INTO heading_blocks (content_id, heading_level, text_content)
VALUES
  (
    '16550f62-63f4-45fe-8a06-7922780eba79',
    2,
    '最初のステップ'
  ),
  (
    'c6bb2773-6b4d-42af-ae31-ee95aea81f2b',
    3,
    '学習環境の準備'
  ),
  (
    '3420346d-a3ea-46c3-8534-77e54f4d7085',
    2,
    '学びの中での気づき'
  ),
  (
    'caea5ad7-3b97-4fc0-941a-20a598a4742c',
    3,
    '試行錯誤の重要性'
  ),
  (
    '5cf4caf3-2f19-4bc5-8b43-2d98b0b13a71',
    3,
    '課題に対処するプロセス'
  );

-- 5. paragraph_blocks に挿入 (同様に id は削除。content_id のみ)
INSERT INTO paragraph_blocks (content_id)
VALUES
  ('8c4c5396-49bf-4ee6-839e-20989b004470'),
  ('7b33c39f-6543-43ec-a660-9428e5bc3949'),
  ('35739804-80f4-4307-b5b6-8999466a618e'),
  ('ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52');

INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES
  (
    gen_random_uuid(),
    '8c4c5396-49bf-4ee6-839e-20989b004470',  -- paragraph_blocks(content_id)
    '新しい技術スタックに挑戦することは、いつも冒険と学びの場です。...'
  ),
  (
    gen_random_uuid(),
    '7b33c39f-6543-43ec-a660-9428e5bc3949',  -- paragraph_blocks(content_id)
    'すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。...'
  ),
  (
    gen_random_uuid(),
    '35739804-80f4-4307-b5b6-8999466a618e',  -- paragraph_blocks(content_id)
    '試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、...'
  ),
  (
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090',  -- style を指定するため id を明示
    '35739804-80f4-4307-b5b6-8999466a618e',  -- 同じ paragraph_block
    '繰り返しの実践が技術力を向上させる鍵です。'
  ),
  (
    gen_random_uuid(),
    '35739804-80f4-4307-b5b6-8999466a618e',
    '新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。'
  ),
  (
    gen_random_uuid(),
    'ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52',
    '技術の習得には多くの時間と試行錯誤が必要です。途中でエラーに遭遇したり、思った通りに動作しないこともありますが、...'
  );

-- 6. image_blocks に挿入 (同様に id は削除。content_id のみ)
INSERT INTO image_blocks (content_id, image_id)
VALUES (
    'a0d774d7-5772-4cde-9593-788e3cdf5269',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1)
);

-- 7. text_styles に挿入 (スタイルのマスタ)
INSERT INTO text_styles (id, style_type)
VALUES
  ('6f3af5a8-3a70-493e-8f2c-766da07b46c5', 'bold'),
  (gen_random_uuid(), 'italic'),
  (gen_random_uuid(), 'underline');

-- 8. rich_text_styles に挿入
INSERT INTO rich_text_styles (style_id, rich_text_id)
VALUES (
    '6f3af5a8-3a70-493e-8f2c-766da07b46c5',
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090'
);


COMMIT;
