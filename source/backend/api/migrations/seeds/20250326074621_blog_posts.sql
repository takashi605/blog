BEGIN;
-- 1. images に挿入
INSERT INTO images (id, file_name, file_path, caption)
VALUES
  ('535c8105-fd92-47b7-93ce-dc01b379ae66', 'book', 'test-book', '本の画像'),
  ('ea933f80-aa80-4532-b5ab-99c7111d7fa4', 'mechanical', 'test-mechanical', '機械の画像'),
  ('343b12ab-95ce-4745-b18b-4ed41f6bae71', 'coffee', 'test-coffee', 'コーヒーの画像');

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

-- 4. heading_blocks に挿入
INSERT INTO heading_blocks (id, heading_level, text_content)
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

-- 5. paragraph_blocks に挿入
INSERT INTO paragraph_blocks (id)
VALUES
  ('8c4c5396-49bf-4ee6-839e-20989b004470'),
  ('7b33c39f-6543-43ec-a660-9428e5bc3949'),
  ('35739804-80f4-4307-b5b6-8999466a618e'),
  ('ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52');

INSERT INTO rich_texts (id, paragraph_block_id, text_content, sort_order)
VALUES
  (
    gen_random_uuid(),
    '8c4c5396-49bf-4ee6-839e-20989b004470',  -- paragraph_blocks(id)
    '新しい技術スタックに挑戦することは、いつも冒険と学びの場です。未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。',
    1
  ),
  (
    gen_random_uuid(),
    '7b33c39f-6543-43ec-a660-9428e5bc3949',  -- paragraph_blocks(id)
    'すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。',
    2
  ),
  (
    gen_random_uuid(),
    '35739804-80f4-4307-b5b6-8999466a618e',  -- paragraph_blocks(id)
    '試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。',
    3
  ),
  (
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090',  -- style を指定するため id を明示
    '35739804-80f4-4307-b5b6-8999466a618e',  -- 同じ paragraph_block
    '繰り返しの実践が技術力を向上させる鍵です。',
    4
  ),
  (
    '90d4b5ae-6970-4fb7-ba33-8bada6f5b775',  -- style を指定するため id を明示
    '35739804-80f4-4307-b5b6-8999466a618e',
    '新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。',
    5
  ),
  (
    gen_random_uuid(),
    'ca1a6538-7b91-4aa2-9ce8-4ff55dacfa52',
    '技術の習得には多くの時間と試行錯誤が必要です。途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。',
    6
  );

-- 6. image_blocks に挿入
INSERT INTO image_blocks (id, image_id)
VALUES (
    'a0d774d7-5772-4cde-9593-788e3cdf5269',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1)
);

-- 7. text_styles に挿入 (スタイルのマスタ)
INSERT INTO text_styles (id, style_type)
VALUES
  ('6f3af5a8-3a70-493e-8f2c-766da07b46c5', 'bold'),
  ('e730615e-a726-471c-9e11-8756031e4d24', 'inline-code'),
  (gen_random_uuid(), 'italic'),
  (gen_random_uuid(), 'underline');

-- 8. rich_text_styles に挿入
INSERT INTO rich_text_styles (style_id, rich_text_id)
VALUES
  (
    '6f3af5a8-3a70-493e-8f2c-766da07b46c5',
    'cc4b395f-6204-4f2f-8cd7-59ed10cf3090'
  ),
  (
    'e730615e-a726-471c-9e11-8756031e4d24',
    '90d4b5ae-6970-4fb7-ba33-8bada6f5b775'
  );

COMMIT;
