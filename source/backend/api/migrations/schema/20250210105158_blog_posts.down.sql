BEGIN;

-- rich_text_styles は rich_texts と text_styles に依存するため最初に削除
DROP TABLE IF EXISTS rich_text_styles;

-- rich_texts は paragraph_blocks に依存するため次に削除
DROP TABLE IF EXISTS rich_texts;

-- paragraph_blocks は post_contents に依存するため次に削除
DROP TABLE IF EXISTS paragraph_blocks;

-- heading_blocks も post_contents に依存
DROP TABLE IF EXISTS heading_blocks;

-- image_blocks も post_contents と images に依存
DROP TABLE IF EXISTS image_blocks;

-- post_contents は blog_posts に依存
DROP TABLE IF EXISTS post_contents;

-- blog_posts は images に依存
DROP TABLE IF EXISTS blog_posts;

-- text_styles は特に依存しないのでここで削除
DROP TABLE IF EXISTS text_styles;

-- images は最終的に削除
DROP TABLE IF EXISTS images;

COMMIT;
