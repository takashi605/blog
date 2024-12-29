CREATE TABLE IF NOT EXISTS blog_posts (
    article_id UUID PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    thumbnail_path VARCHAR(255) NOT NULL,
    created_post_date DATE NOT NULL,
    updated_post_date DATE NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);

INSERT INTO blog_posts (
    article_id,
    title,
    thumbnail_path,
    created_post_date,
    updated_post_date,
    published_at,
    created_at,
    updated_at
) VALUES (
    '3f50d4c2-1e4b-4a6d-9b2c-8f9e2d3a4b5c',
    'PostgreSQLでのテーブル設計のベストプラクティス',
    'test-book',
    '2024-01-15',
    '2024-02-10',
    '2024-02-15 10:00:00+09',
    '2024-01-15 09:00:00+09',
    '2024-02-10 14:30:00+09'
);

INSERT INTO blog_posts (
    article_id,
    title,
    thumbnail_path,
    created_post_date,
    updated_post_date,
    published_at,
    created_at,
    updated_at
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
    'UUIDの使い方と利点',
    'test-coffee',
    '2024-03-05',
    '2024-03-20',
    '2024-03-25 12:00:00+09',
    '2024-03-05 11:15:00+09',
    '2024-03-20 16:45:00+09'
);

INSERT INTO blog_posts (
    article_id,
    title,
    thumbnail_path,
    created_post_date,
    updated_post_date,
    published_at,
    created_at,
    updated_at
) VALUES (
    'b7c8d9e0-f1a2-3b4c-5d6e-7f8a9b0c1d2e',
    'タイムスタンプの管理方法',
    'test-mechanical',
    '2024-04-10',
    '2024-04-15',
    '2024-04-20 08:30:00+09',
    '2024-04-10 07:45:00+09',
    '2024-04-15 10:20:00+09'
);
