BEGIN;

-- 1. blog_posts に50年後に公開される記事を挿入
INSERT INTO blog_posts (
    id,
    title,
    thumbnail_image_id,
    post_date,
    last_update_date,
    published_at
)
VALUES (
    '12345678-90ab-cdef-1234-567890abcdef'::uuid,
    '50年後記事1',
    (SELECT id FROM images WHERE file_path = 'test-book' LIMIT 1),
    CURRENT_DATE,                                            -- 投稿日：マイグレーション実行日
    CURRENT_DATE,                                            -- 更新日：マイグレーション実行日
    CURRENT_TIMESTAMP + INTERVAL '50 years'                  -- 公開日：現在時刻から50年後
);

-- 2. post_contents に見出しと段落のプレースホルダーを追加
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = '50年後記事1' LIMIT 1),
    'heading',
    1
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM blog_posts WHERE title = '50年後記事1' LIMIT 1),
    'paragraph',
    2
  );

-- 3. heading_blocks に見出しテキストをセット
INSERT INTO heading_blocks (id, heading_level, text_content)
VALUES (
    (SELECT id
       FROM post_contents
      WHERE post_id = (SELECT id FROM blog_posts WHERE title = '50年後記事1' LIMIT 1)
        AND content_type = 'heading'
      LIMIT 1),
    2,
    '50年後記事1の見出し'
);

-- 4. paragraph_blocks に段落ブロックを作成
INSERT INTO paragraph_blocks (id)
VALUES (
    (SELECT id
       FROM post_contents
      WHERE post_id = (SELECT id FROM blog_posts WHERE title = '50年後記事1' LIMIT 1)
        AND content_type = 'paragraph'
      LIMIT 1)
);

-- 5. rich_texts に段落本文を1文だけ登録
INSERT INTO rich_texts (id, paragraph_block_id, text_content, sort_order)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM paragraph_blocks
       WHERE id = (
         SELECT id
           FROM post_contents
          WHERE post_id = (SELECT id FROM blog_posts WHERE title = '50年後記事1' LIMIT 1)
            AND content_type = 'paragraph'
          LIMIT 1
       )
    ),
    'これは50年後に公開される予定の記事の段落です。',
    1
);

COMMIT;