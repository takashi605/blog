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
    '初めての技術スタックへの挑戦',
    (SELECT id FROM images WHERE file_path = 'test-coffee'),
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

-- 4. heading_blocks に挿入
--   "heading" タイプの content_id を拾ってきて紐付ける
INSERT INTO heading_blocks (id, content_id, heading_level, text_content)
VALUES
  (
    gen_random_uuid(),
    '16550f62-63f4-45fe-8a06-7922780eba79',
    2,
    '最初のステップ'
  ),
  (
    gen_random_uuid(),
    'c6bb2773-6b4d-42af-ae31-ee95aea81f2b',
    3,
    '学習環境の準備'
  ),
  (
    gen_random_uuid(),
    '3420346d-a3ea-46c3-8534-77e54f4d7085',
    2,
    '学びの中での気づき'
  ),
  (
    gen_random_uuid(),
    'caea5ad7-3b97-4fc0-941a-20a598a4742c',
    3,
    '試行錯誤の重要性'
  ),
  (
    gen_random_uuid(),
    '5cf4caf3-2f19-4bc5-8b43-2d98b0b13a71',
    3,
    '課題に対処するプロセス'
  );

-- 5. paragraph_blocks に挿入
--   "paragraph" タイプの content_id を拾ってきて紐付ける
INSERT INTO paragraph_blocks (id, content_id)
VALUES
  (
    '8047039f-abbf-49bb-b647-0d10a19986c7',
    '8c4c5396-49bf-4ee6-839e-20989b004470'
  ),
  (
    '0018038e-e7a4-4889-80f3-392722a33ebc',
    '7b33c39f-6543-43ec-a660-9428e5bc3949'
  ),
  (
    '8058d217-8996-4e09-ac40-a4a466c6bb5e',
    '35739804-80f4-4307-b5b6-8999466a618e'
  ),
  (
    '6a423192-d5fa-469e-87d8-e66228c4536a',
    'ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52'
  );

INSERT INTO rich_texts (id, paragraph_block_id, text_content)
VALUES
  (
    gen_random_uuid(),
    '8047039f-abbf-49bb-b647-0d10a19986c7',
    '新しい技術スタックに挑戦することは、いつも冒険と学びの場です。未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。'
  ),
  (
    gen_random_uuid(),
    '0018038e-e7a4-4889-80f3-392722a33ebc',
    'すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。'
  ),
  (
    gen_random_uuid(),
    '8058d217-8996-4e09-ac40-a4a466c6bb5e',
    '試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。'
  ),
  (
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090',
    '8058d217-8996-4e09-ac40-a4a466c6bb5e',
    '繰り返しの実践が技術力を向上させる鍵です。'
  ),
  (
    gen_random_uuid(),
    '8058d217-8996-4e09-ac40-a4a466c6bb5e',
    '新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。'
  ),
  (
    gen_random_uuid(),
    '6a423192-d5fa-469e-87d8-e66228c4536a',
    '技術の習得には多くの時間と試行錯誤が必要です。途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。'
  );

-- 6. image_blocks に挿入
--   "image" タイプの content_id と images.image_id を紐付ける
INSERT INTO image_blocks (id, content_id, image_id)
VALUES (
    gen_random_uuid(),
    'a0d774d7-5772-4cde-9593-788e3cdf5269',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1)
);

-- 7. text_styles に挿入 (スタイルのマスタ)
INSERT INTO text_styles (id, style_type)
VALUES
  ('6f3af5a8-3a70-493e-8f2c-766da07b46c5', 'bold'),
  (gen_random_uuid(), 'italic'),
  (gen_random_uuid(), 'underline');

-- 8. paragraph_block_styles に挿入 (テキストブロックにスタイルを適用する中間テーブル)
--   ここでは "bold" スタイルを適用する例
INSERT INTO rich_text_styles (style_id, rich_text_id)
VALUES (
    '6f3af5a8-3a70-493e-8f2c-766da07b46c5',
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090'
);
