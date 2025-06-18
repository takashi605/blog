use anyhow::{anyhow, Result};
use common::types::api::response::BlogPost;
use uuid::Uuid;

use crate::application::usecase::view_latest_blog_posts::dto::ViewLatestBlogPostsDTO;

/// ViewLatestBlogPostsDTOをAPIレスポンスのVec<BlogPost>に変換する
pub fn view_latest_blog_posts_dto_to_response(dto: ViewLatestBlogPostsDTO) -> Result<Vec<BlogPost>> {
    let mut blog_posts = Vec::new();

    for post_dto in dto.blog_posts {
        // IDをUUIDとしてパース
        let id = Uuid::parse_str(&post_dto.id)
            .map_err(|_| anyhow!("DTOのIDをUUIDに変換できませんでした: {}", post_dto.id))?;

        let blog_post = BlogPost {
            id,
            title: post_dto.title,
            thumbnail: post_dto.thumbnail,
            post_date: post_dto.post_date,
            last_update_date: post_dto.last_update_date,
            contents: post_dto.contents,
        };

        blog_posts.push(blog_post);
    }

    Ok(blog_posts)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::application::usecase::view_latest_blog_posts::dto::ViewLatestBlogPostDTO;
    use chrono::{NaiveDate, Utc};
    use common::types::api::response::{BlogPostContent, CodeBlock, H2Block, H3Block, Image, ImageBlock, Link, ParagraphBlock, RichText, Style};
    use uuid::Uuid;

    #[test]
    fn test_空のViewLatestBlogPostsDTOを変換できる() {
        // Arrange
        let dto = ViewLatestBlogPostsDTO {
            blog_posts: vec![]
        };

        // Act
        let result = view_latest_blog_posts_dto_to_response(dto);

        // Assert
        assert!(result.is_ok());
        let blog_posts = result.unwrap();
        assert_eq!(blog_posts.len(), 0);
    }

    #[test]
    fn test_単一記事のViewLatestBlogPostsDTOを変換できる() {
        // Arrange
        let post_id = Uuid::new_v4();
        let thumbnail_id = Uuid::new_v4();

        let post_dto = ViewLatestBlogPostDTO {
            id: post_id.to_string(),
            title: "テスト記事".to_string(),
            thumbnail: Image {
                id: thumbnail_id,
                path: "test-thumbnail.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents: vec![],
            published_date: Utc::now(),
            is_public: true,
        };

        let dto = ViewLatestBlogPostsDTO {
            blog_posts: vec![post_dto]
        };

        // Act
        let result = view_latest_blog_posts_dto_to_response(dto);

        // Assert
        assert!(result.is_ok());
        let blog_posts = result.unwrap();
        assert_eq!(blog_posts.len(), 1);

        let blog_post = &blog_posts[0];
        assert_eq!(blog_post.id, post_id);
        assert_eq!(blog_post.title, "テスト記事");
        assert_eq!(blog_post.thumbnail.id, thumbnail_id);
        assert_eq!(blog_post.thumbnail.path, "test-thumbnail.jpg");
        assert_eq!(blog_post.post_date, NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
        assert_eq!(blog_post.last_update_date, NaiveDate::from_ymd_opt(2024, 1, 2).unwrap());
    }

    #[test]
    fn test_複数記事のViewLatestBlogPostsDTOを変換できる() {
        // Arrange
        let mut blog_posts_dto = vec![];

        for i in 1..=3 {
            let post_id = Uuid::new_v4();
            let thumbnail_id = Uuid::new_v4();

            let post_dto = ViewLatestBlogPostDTO {
                id: post_id.to_string(),
                title: format!("記事{}", i),
                thumbnail: Image {
                    id: thumbnail_id,
                    path: format!("thumbnail{}.jpg", i),
                },
                post_date: NaiveDate::from_ymd_opt(2024, 1, i as u32).unwrap(),
                last_update_date: NaiveDate::from_ymd_opt(2024, 1, i as u32 + 10).unwrap(),
                contents: vec![],
                published_date: Utc::now(),
                is_public: true,
            };

            blog_posts_dto.push(post_dto);
        }

        let dto = ViewLatestBlogPostsDTO {
            blog_posts: blog_posts_dto
        };

        // Act
        let result = view_latest_blog_posts_dto_to_response(dto);

        // Assert
        assert!(result.is_ok());
        let blog_posts = result.unwrap();
        assert_eq!(blog_posts.len(), 3);

        for (i, blog_post) in blog_posts.iter().enumerate() {
            assert_eq!(blog_post.title, format!("記事{}", i + 1));
            assert_eq!(blog_post.thumbnail.path, format!("thumbnail{}.jpg", i + 1));
            assert_eq!(blog_post.post_date, NaiveDate::from_ymd_opt(2024, 1, (i + 1) as u32).unwrap());
        }
    }

    #[test]
    fn test_コンテンツ変換を含むViewLatestBlogPostsDTOを変換できる() {
        // Arrange
        let post_id = Uuid::new_v4();
        let thumbnail_id = Uuid::new_v4();
        let h2_id = Uuid::new_v4();
        let h3_id = Uuid::new_v4();
        let paragraph_id = Uuid::new_v4();
        let image_id = Uuid::new_v4();
        let code_id = Uuid::new_v4();

        let contents = vec![
            BlogPostContent::H2(H2Block {
                id: h2_id,
                text: "見出し2".to_string(),
            }),
            BlogPostContent::H3(H3Block {
                id: h3_id,
                text: "見出し3".to_string(),
            }),
            BlogPostContent::Paragraph(ParagraphBlock {
                id: paragraph_id,
                text: vec![
                    RichText {
                        text: "通常のテキスト".to_string(),
                        styles: Style {
                            bold: false,
                            inline_code: false,
                        },
                        link: None,
                    },
                    RichText {
                        text: "太字のテキスト".to_string(),
                        styles: Style {
                            bold: true,
                            inline_code: false,
                        },
                        link: None,
                    },
                    RichText {
                        text: "リンクテキスト".to_string(),
                        styles: Style {
                            bold: false,
                            inline_code: false,
                        },
                        link: Some(Link {
                            url: "https://example.com".to_string(),
                        }),
                    },
                ],
            }),
            BlogPostContent::Image(ImageBlock {
                id: image_id,
                path: "test-image.jpg".to_string(),
            }),
            BlogPostContent::Code(CodeBlock {
                id: code_id,
                title: "サンプルコード".to_string(),
                code: "console.log('Hello, World!');".to_string(),
                language: "javascript".to_string(),
            }),
        ];

        let post_dto = ViewLatestBlogPostDTO {
            id: post_id.to_string(),
            title: "コンテンツ変換テスト記事".to_string(),
            thumbnail: Image {
                id: thumbnail_id,
                path: "test-thumbnail.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents: contents.clone(),
            published_date: Utc::now(),
            is_public: true,
        };

        let dto = ViewLatestBlogPostsDTO {
            blog_posts: vec![post_dto]
        };

        // Act
        let result = view_latest_blog_posts_dto_to_response(dto);

        // Assert
        assert!(result.is_ok());
        let blog_posts = result.unwrap();
        assert_eq!(blog_posts.len(), 1);

        let blog_post = &blog_posts[0];
        assert_eq!(blog_post.id, post_id);
        assert_eq!(blog_post.title, "コンテンツ変換テスト記事");
        assert_eq!(blog_post.contents.len(), 5);

        // コンテンツの詳細チェック
        match &blog_post.contents[0] {
            BlogPostContent::H2(h2_block) => {
                assert_eq!(h2_block.id, h2_id);
                assert_eq!(h2_block.text, "見出し2");
            }
            _ => panic!("期待されたH2コンテンツではありません"),
        }

        match &blog_post.contents[1] {
            BlogPostContent::H3(h3_block) => {
                assert_eq!(h3_block.id, h3_id);
                assert_eq!(h3_block.text, "見出し3");
            }
            _ => panic!("期待されたH3コンテンツではありません"),
        }

        match &blog_post.contents[2] {
            BlogPostContent::Paragraph(paragraph_block) => {
                assert_eq!(paragraph_block.id, paragraph_id);
                assert_eq!(paragraph_block.text.len(), 3);
                
                // 通常のテキスト
                assert_eq!(paragraph_block.text[0].text, "通常のテキスト");
                assert!(!paragraph_block.text[0].styles.bold);
                assert!(paragraph_block.text[0].link.is_none());
                
                // 太字のテキスト
                assert_eq!(paragraph_block.text[1].text, "太字のテキスト");
                assert!(paragraph_block.text[1].styles.bold);
                
                // リンクテキスト
                assert_eq!(paragraph_block.text[2].text, "リンクテキスト");
                assert_eq!(paragraph_block.text[2].link.as_ref().unwrap().url, "https://example.com");
            }
            _ => panic!("期待されたParagraphコンテンツではありません"),
        }

        match &blog_post.contents[3] {
            BlogPostContent::Image(image_block) => {
                assert_eq!(image_block.id, image_id);
                assert_eq!(image_block.path, "test-image.jpg");
            }
            _ => panic!("期待されたImageコンテンツではありません"),
        }

        match &blog_post.contents[4] {
            BlogPostContent::Code(code_block) => {
                assert_eq!(code_block.id, code_id);
                assert_eq!(code_block.title, "サンプルコード");
                assert_eq!(code_block.code, "console.log('Hello, World!');");
                assert_eq!(code_block.language, "javascript");
            }
            _ => panic!("期待されたCodeコンテンツではありません"),
        }
    }

    #[test]
    fn test_ViewLatestBlogPostsDTO無効なUUID形式でエラーになる() {
        // Arrange
        let invalid_post_dto = ViewLatestBlogPostDTO {
            id: "invalid-uuid".to_string(),
            title: "テスト記事".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "test-thumbnail.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents: vec![],
            published_date: Utc::now(),
            is_public: true,
        };

        let dto = ViewLatestBlogPostsDTO {
            blog_posts: vec![invalid_post_dto]
        };

        // Act
        let result = view_latest_blog_posts_dto_to_response(dto);

        // Assert
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("DTOのIDをUUIDに変換できませんでした"));
    }
}