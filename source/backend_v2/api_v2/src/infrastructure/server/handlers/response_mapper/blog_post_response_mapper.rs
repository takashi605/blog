use anyhow::{anyhow, Result};
use common::types::api::BlogPost;
use uuid::Uuid;

use crate::application::usecase::view_blog_post::dto::ViewBlogPostDTO;

/// ViewBlogPostDTOをAPIレスポンス用のBlogPostに変換
pub fn view_blog_post_dto_to_response(dto: ViewBlogPostDTO) -> Result<BlogPost> {
    let id = Uuid::parse_str(&dto.id)
        .map_err(|_| anyhow!("DTOのIDをUUIDに変換できませんでした: {}", dto.id))?;

    Ok(BlogPost {
        id,
        title: dto.title,
        thumbnail: dto.thumbnail,
        post_date: dto.post_date,
        last_update_date: dto.last_update_date,
        contents: dto.contents,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use chrono::{NaiveDate, Utc};
    use common::types::api::{BlogPostContent, H2Block, Image};
    use uuid::Uuid;

    #[test]
    fn test_view_blog_post_dto_to_response_success() {
        let dto = ViewBlogPostDTO {
            id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
            title: "テスト記事".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/test/image.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents: vec![BlogPostContent::H2(H2Block {
                id: Uuid::new_v4(),
                text: "見出し".to_string(),
            })],
            published_date: Utc::now(),
            is_public: true,
        };

        let result = view_blog_post_dto_to_response(dto.clone()).unwrap();

        assert_eq!(result.id.to_string(), "550e8400-e29b-41d4-a716-446655440000");
        assert_eq!(result.title, dto.title);
        assert_eq!(result.thumbnail, dto.thumbnail);
        assert_eq!(result.post_date, dto.post_date);
        assert_eq!(result.last_update_date, dto.last_update_date);
        assert_eq!(result.contents, dto.contents);
    }

    #[test]
    fn test_view_blog_post_dto_to_response_invalid_uuid() {
        let dto = ViewBlogPostDTO {
            id: "invalid-uuid".to_string(),
            title: "テスト記事".to_string(),
            thumbnail: Image {
                id: Uuid::new_v4(),
                path: "/test/image.jpg".to_string(),
            },
            post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
            last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
            contents: vec![],
            published_date: Utc::now(),
            is_public: true,
        };

        let result = view_blog_post_dto_to_response(dto);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("DTOのIDをUUIDに変換できませんでした"));
    }
}