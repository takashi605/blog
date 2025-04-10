-- Add migration script here
INSERT INTO post_contents (id, post_id, content_type, sort_order)
VALUES
  (
    '61f5d5d2-c133-44fd-8593-1fa6860ff383',
    (SELECT id FROM blog_posts WHERE title = '初めての技術スタックへの挑戦' LIMIT 1),
    'code_block', 10
  );
INSERT INTO code_blocks (id, title, code, lang)
VALUES (
    '61f5d5d2-c133-44fd-8593-1fa6860ff383',
    'サンプルコード',
    'console.log("Hello, World!");',
    'javascript'
);