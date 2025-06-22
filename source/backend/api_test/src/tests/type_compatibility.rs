#[cfg(test)]
mod tests {
    use anyhow::Result;
    use common::types::api::{
        BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock,
        ParagraphBlock, RichText, Style, CodeBlock, Link,
    };
    use serde_json;
    use uuid::Uuid;
    use chrono::NaiveDate;

    /// BlogPost型のシリアライズ・デシリアライズテスト
    #[test]
    fn test_blog_post_serialization() -> Result<()> {
        let blog_post = create_test_blog_post();
        
        // JSONにシリアライズ
        let json_str = serde_json::to_string(&blog_post)?;
        
        // JSONからデシリアライズ
        let deserialized: BlogPost = serde_json::from_str(&json_str)?;
        
        // 元のデータと一致することを確認
        assert_eq!(blog_post.id, deserialized.id);
        assert_eq!(blog_post.title, deserialized.title);
        assert_eq!(blog_post.thumbnail.id, deserialized.thumbnail.id);
        assert_eq!(blog_post.post_date, deserialized.post_date);
        assert_eq!(blog_post.last_update_date, deserialized.last_update_date);
        assert_eq!(blog_post.contents.len(), deserialized.contents.len());
        
        Ok(())
    }

    /// 実際のAPIレスポンス形式との互換性テスト
    #[test]
    fn test_api_response_format_compatibility() -> Result<()> {
        // 実際のAPIレスポンスを模した JSON
        let json_response = r#"{
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "title": "テストブログ記事",
            "thumbnail": {
                "id": "660e8400-e29b-41d4-a716-446655440001",
                "path": "/images/test.jpg"
            },
            "postDate": "2024-01-01",
            "lastUpdateDate": "2024-01-01",
            "contents": [
                {
                    "type": "paragraph",
                    "id": "770e8400-e29b-41d4-a716-446655440002",
                    "text": [
                        {
                            "text": "これはテキストです",
                            "styles": {
                                "bold": false,
                                "inlineCode": false
                            },
                            "link": null
                        }
                    ]
                }
            ]
        }"#;

        // JSONをBlogPost型にデシリアライズできることを確認
        let blog_post: BlogPost = serde_json::from_str(json_response)?;
        
        assert_eq!(blog_post.title, "テストブログ記事");
        assert_eq!(blog_post.contents.len(), 1);
        
        Ok(())
    }

    /// BlogPostContent の Discriminated Union テスト
    #[test]
    fn test_blog_post_content_discriminated_union() -> Result<()> {
        // H2ブロックのテスト
        let h2_content = BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "見出し".to_string(),
        });
        
        let h2_json = serde_json::to_string(&h2_content)?;
        let h2_deserialized: BlogPostContent = serde_json::from_str(&h2_json)?;
        match h2_deserialized {
            BlogPostContent::H2(_) => (),
            _ => panic!("H2ブロックではありません"),
        }

        // 段落ブロックのテスト
        let paragraph_content = BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
                text: "段落テキスト".to_string(),
                styles: Style {
                    bold: true,
                    inline_code: false,
                },
                link: None,
            }],
        });
        
        let paragraph_json = serde_json::to_string(&paragraph_content)?;
        let paragraph_deserialized: BlogPostContent = serde_json::from_str(&paragraph_json)?;
        match paragraph_deserialized {
            BlogPostContent::Paragraph(_) => (),
            _ => panic!("Paragraphブロックではありません"),
        }

        // 画像ブロックのテスト
        let image_content = BlogPostContent::Image(ImageBlock {
            id: Uuid::new_v4(),
            path: "/images/content.jpg".to_string(),
        });
        
        let image_json = serde_json::to_string(&image_content)?;
        let image_deserialized: BlogPostContent = serde_json::from_str(&image_json)?;
        match image_deserialized {
            BlogPostContent::Image(_) => (),
            _ => panic!("Imageブロックではありません"),
        }

        // コードブロックのテスト
        let code_content = BlogPostContent::Code(CodeBlock {
            id: Uuid::new_v4(),
            title: "サンプルコード".to_string(),
            code: "console.log('Hello, World!');".to_string(),
            language: "javascript".to_string(),
        });
        
        let code_json = serde_json::to_string(&code_content)?;
        let code_deserialized: BlogPostContent = serde_json::from_str(&code_json)?;
        match code_deserialized {
            BlogPostContent::Code(_) => (),
            _ => panic!("Codeブロックではありません"),
        }

        Ok(())
    }

    /// 各ブロック型の個別テスト
    #[test]
    fn test_individual_block_types() -> Result<()> {
        // H2Block のテスト
        let h2_block = H2Block {
            id: Uuid::new_v4(),
            text: "見出しテキスト".to_string(),
        };
        
        let h2_json = serde_json::to_string(&h2_block)?;
        let h2_deserialized: H2Block = serde_json::from_str(&h2_json)?;
        assert_eq!(h2_deserialized.text, "見出しテキスト");

        // H3Block のテスト
        let h3_block = H3Block {
            id: Uuid::new_v4(),
            text: "小見出しテキスト".to_string(),
        };
        
        let h3_json = serde_json::to_string(&h3_block)?;
        let h3_deserialized: H3Block = serde_json::from_str(&h3_json)?;
        assert_eq!(h3_deserialized.text, "小見出しテキスト");

        // ParagraphBlock のテスト
        let paragraph_block = ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![
                RichText {
                    text: "通常テキスト".to_string(),
                    styles: Style {
                        bold: false,
                        inline_code: false,
                    },
                    link: None,
                },
                RichText {
                    text: "太字テキスト".to_string(),
                    styles: Style {
                        bold: true,
                        inline_code: false,
                    },
                    link: None,
                },
            ],
        };
        
        let paragraph_json = serde_json::to_string(&paragraph_block)?;
        let paragraph_deserialized: ParagraphBlock = serde_json::from_str(&paragraph_json)?;
        assert_eq!(paragraph_deserialized.text.len(), 2);

        // ImageBlock のテスト
        let image_block = ImageBlock {
            id: Uuid::new_v4(),
            path: "/images/test.jpg".to_string(),
        };
        
        let image_json = serde_json::to_string(&image_block)?;
        let image_deserialized: ImageBlock = serde_json::from_str(&image_json)?;
        assert_eq!(image_deserialized.path, "/images/test.jpg");

        Ok(())
    }

    /// 空のコンテンツ配列を持つBlogPostのテスト
    #[test]
    fn test_blog_post_with_empty_contents() -> Result<()> {
        let blog_post = BlogPost {
            id: Uuid::new_v4(),
            title: "空のコンテンツ".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/empty.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            contents: vec![],
        };

        let json = serde_json::to_string(&blog_post)?;
        let deserialized: BlogPost = serde_json::from_str(&json)?;
        
        assert_eq!(deserialized.contents.len(), 0);
        
        Ok(())
    }

    /// リンク付きリッチテキストのテスト
    #[test]
    fn test_rich_text_with_link() -> Result<()> {
        let rich_text = RichText {
            text: "リンク付きテキスト".to_string(),
            styles: Style {
                bold: false,
                inline_code: false,
            },
            link: Some(Link {
                url: "https://example.com".to_string(),
            }),
        };

        let json = serde_json::to_string(&rich_text)?;
        let deserialized: RichText = serde_json::from_str(&json)?;
        
        assert!(deserialized.link.is_some());
        assert_eq!(deserialized.link.unwrap().url, "https://example.com");
        
        Ok(())
    }

    /// 複数スタイルを持つリッチテキストのテスト
    #[test]
    fn test_rich_text_with_multiple_styles() -> Result<()> {
        let rich_text = RichText {
            text: "太字かつコード".to_string(),
            styles: Style {
                bold: true,
                inline_code: true,
            },
            link: None,
        };

        let json = serde_json::to_string(&rich_text)?;
        let deserialized: RichText = serde_json::from_str(&json)?;
        
        assert!(deserialized.styles.bold);
        assert!(deserialized.styles.inline_code);
        
        Ok(())
    }

    /// APIレスポンスの配列形式テスト
    #[test]
    fn test_blog_post_array_serialization() -> Result<()> {
        let blog_posts = vec![
            create_test_blog_post(),
            create_test_blog_post(),
            create_test_blog_post(),
        ];

        let json = serde_json::to_string(&blog_posts)?;
        let deserialized: Vec<BlogPost> = serde_json::from_str(&json)?;
        
        assert_eq!(deserialized.len(), 3);
        
        Ok(())
    }

    /// CodeBlockを含むBlogPostのテスト
    #[test]
    fn test_blog_post_with_code_block() -> Result<()> {
        let blog_post = BlogPost {
            id: Uuid::new_v4(),
            title: "コードブロック記事".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/code.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            contents: vec![
                BlogPostContent::Code(CodeBlock {
                    id: Uuid::new_v4(),
                    title: "Rustのサンプル".to_string(),
                    code: "fn main() {\n    println!(\"Hello, World!\");\n}".to_string(),
                    language: "rust".to_string(),
                }),
            ],
        };

        let json = serde_json::to_string(&blog_post)?;
        let deserialized: BlogPost = serde_json::from_str(&json)?;
        
        match &deserialized.contents[0] {
            BlogPostContent::Code(code_block) => {
                assert_eq!(code_block.language, "rust");
                assert_eq!(code_block.title, "Rustのサンプル");
            }
            _ => panic!("コードブロックではありません"),
        }
        
        Ok(())
    }

    // ヘルパー関数
    fn create_test_blog_post() -> BlogPost {
        BlogPost {
            id: Uuid::new_v4(),
            title: "テストブログ記事".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/images/test.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            contents: vec![
                BlogPostContent::H2(H2Block {
                    id: Uuid::new_v4(),
                    text: "見出し".to_string(),
                }),
                BlogPostContent::Paragraph(ParagraphBlock {
                    id: Uuid::new_v4(),
                    text: vec![RichText {
                        text: "段落テキスト".to_string(),
                        styles: Style {
                            bold: true,
                            inline_code: false,
                        },
                        link: None,
                    }],
                }),
            ],
        }
    }
}