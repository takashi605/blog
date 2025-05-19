-- Add migration script here
INSERT INTO rich_text_links (id, rich_text_id, url) VALUES
  (
    gen_random_uuid(),
    '25c2eb6c-0cf0-4808-9d73-f4b4a9ee338a',
    'https://example.com/first-link'
  );