#[cfg(test)]
mod tests {
    use common::types::api::{
        BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock,
        ParagraphBlock, RichText, Style, CodeBlock, Link,
    };
    use serde_json;
    use uuid::Uuid;
    use chrono::NaiveDate;

    /// api_v2でのBlogPost型の使用確認テスト
    #[test]
    fn test_blog_post_type_usage() {
        // commonクレートのBlogPost型をapi_v2で正常に使用できることを確認
        let blog_post = BlogPost {
            id: Uuid::new_v4(),
            title: "API v2テスト".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/test.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            contents: vec![],
        };

        // 型が正しくインスタンス化できることを確認
        assert_eq!(blog_post.title, "API v2テスト");
    }

    /// 実際のハンドラーが返すデータ形式との互換性確認
    #[test]
    fn test_handler_response_format() {
        // ハンドラーが返すデータ構造を模擬
        let contents = vec![
            BlogPostContent::H2(H2Block {
                id: Uuid::new_v4(),
                text: "セクション見出し".to_string(),
            }),
            BlogPostContent::Paragraph(ParagraphBlock {
                id: Uuid::new_v4(),
                text: vec![RichText {
                    text: "本文テキスト".to_string(),
                    styles: Style {
                        bold: true,
                        inline_code: false,
                    },
                    link: None,
                }],
            }),
            BlogPostContent::Image(ImageBlock {
                id: Uuid::new_v4(),
                path: "/images/content.jpg".to_string(),
            }),
        ];

        let blog_post = BlogPost {
            id: Uuid::new_v4(),
            title: "ハンドラーレスポンステスト".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/thumbnail.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents,
        };

        // JSONシリアライズが正常に動作することを確認
        let json_result = serde_json::to_string(&blog_post);
        assert!(json_result.is_ok());

        // シリアライズされたJSONが期待する構造を持つことを確認
        let json_value: serde_json::Value = serde_json::to_value(&blog_post).unwrap();
        assert!(json_value.get("id").is_some());
        assert!(json_value.get("title").is_some());
        assert!(json_value.get("contents").unwrap().is_array());
        assert_eq!(json_value.get("contents").unwrap().as_array().unwrap().len(), 3);
    }

    /// すべてのStyle構造体のテスト
    #[test]
    fn test_style_struct() {
        let styles = vec![
            Style { bold: true, inline_code: false },
            Style { bold: false, inline_code: true },
            Style { bold: true, inline_code: true },
            Style { bold: false, inline_code: false },
        ];

        for style in &styles {
            let rich_text = RichText {
                text: "テストテキスト".to_string(),
                styles: style.clone(),
                link: None,
            };

            // JSONシリアライズ・デシリアライズ
            let json = serde_json::to_string(&rich_text).unwrap();
            let deserialized: RichText = serde_json::from_str(&json).unwrap();
            
            assert_eq!(rich_text.styles.bold, deserialized.styles.bold);
            assert_eq!(rich_text.styles.inline_code, deserialized.styles.inline_code);
        }
    }

    /// 実際のDBから取得したデータ形式との互換性確認
    #[test]
    fn test_database_to_response_conversion() {
        // DBから取得したデータを模擬（通常はDBクエリ結果）
        let db_id = Uuid::new_v4();
        let db_title = "データベースから取得したタイトル";
        let db_thumbnail_id = Uuid::new_v4();
        let db_post_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
        let db_update_date = NaiveDate::from_ymd_opt(2024, 1, 2).unwrap();

        // DBデータからBlogPost型への変換を模擬
        let blog_post = BlogPost {
            id: db_id,
            title: db_title.to_string(),
            thumbnail: Image {
                id: db_thumbnail_id,
                path: "/images/db-image.jpg".to_string(),
            },
            post_date: db_post_date,
            last_update_date: db_update_date,
            contents: vec![],
        };

        // 変換が正常に行われることを確認
        assert_eq!(blog_post.id, db_id);
        assert_eq!(blog_post.title, db_title);
        assert_eq!(blog_post.post_date, db_post_date);
    }

    /// H3ブロックを含むコンテンツのテスト
    #[test]
    fn test_h3_block_content() {
        let h3_content = BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "小見出しテキスト".to_string(),
        });

        let json = serde_json::to_string(&h3_content).unwrap();
        let deserialized: BlogPostContent = serde_json::from_str(&json).unwrap();

        match deserialized {
            BlogPostContent::H3(h3_block) => {
                assert_eq!(h3_block.text, "小見出しテキスト");
            }
            _ => panic!("H3ブロックではありません"),
        }
    }

    /// リンク付きリッチテキストのシリアライズテスト
    #[test]
    fn test_link_serialization() {
        let link = Link {
            url: "https://example.com".to_string(),
        };

        let json = serde_json::to_string(&link).unwrap();
        let deserialized: Link = serde_json::from_str(&json).unwrap();

        assert_eq!(link.url, deserialized.url);
    }

    /// camelCase変換のテスト
    #[test]
    fn test_camel_case_serialization() {
        let blog_post = BlogPost {
            id: Uuid::new_v4(),
            title: "キャメルケーステスト".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/camel.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            contents: vec![],
        };

        let json = serde_json::to_string(&blog_post).unwrap();
        let json_value: serde_json::Value = serde_json::from_str(&json).unwrap();

        // camelCaseに変換されていることを確認
        assert!(json_value.get("postDate").is_some());
        assert!(json_value.get("lastUpdateDate").is_some());
        assert!(json_value.get("post_date").is_none());
        assert!(json_value.get("last_update_date").is_none());
    }

    /// Discriminated Union のタグ確認テスト
    #[test] 
    fn test_discriminated_union_tags() {
        let contents = vec![
            BlogPostContent::H2(H2Block {
                id: Uuid::new_v4(),
                text: "H2".to_string(),
            }),
            BlogPostContent::H3(H3Block {
                id: Uuid::new_v4(),
                text: "H3".to_string(),
            }),
            BlogPostContent::Paragraph(ParagraphBlock {
                id: Uuid::new_v4(),
                text: vec![],
            }),
            BlogPostContent::Image(ImageBlock {
                id: Uuid::new_v4(),
                path: "/image.jpg".to_string(),
            }),
            BlogPostContent::Code(CodeBlock {
                id: Uuid::new_v4(),
                title: "コード".to_string(),
                code: "code".to_string(),
                language: "rust".to_string(),
            }),
        ];

        for content in contents {
            let json = serde_json::to_string(&content).unwrap();
            let json_value: serde_json::Value = serde_json::from_str(&json).unwrap();
            
            // typeフィールドが存在することを確認
            assert!(json_value.get("type").is_some());
            
            // 正しいタグ値が設定されていることを確認
            match content {
                BlogPostContent::H2(_) => assert_eq!(json_value.get("type").unwrap(), "h2"),
                BlogPostContent::H3(_) => assert_eq!(json_value.get("type").unwrap(), "h3"),
                BlogPostContent::Paragraph(_) => assert_eq!(json_value.get("type").unwrap(), "paragraph"),
                BlogPostContent::Image(_) => assert_eq!(json_value.get("type").unwrap(), "image"),
                BlogPostContent::Code(_) => assert_eq!(json_value.get("type").unwrap(), "codeBlock"),
            }
        }
    }
}