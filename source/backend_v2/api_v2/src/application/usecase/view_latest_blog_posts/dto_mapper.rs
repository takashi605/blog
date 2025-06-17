use crate::domain::blog_domain::blog_post_entity::content_entity::ContentEntity;
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use anyhow::Result;
use chrono::Utc;
use common::types::api::response::{BlogPostContent, Image};

use super::dto::{ViewLatestBlogPostDTO, ViewLatestBlogPostsDTO};

/// BlogPostEntityのVecからViewLatestBlogPostsDTOに変換する
pub fn blog_post_entities_to_view_latest_dto(entities: Vec<BlogPostEntity>) -> Result<ViewLatestBlogPostsDTO> {
  let mut blog_posts = Vec::new();

  for entity in entities {
    let dto = blog_post_entity_to_view_latest_single_dto(entity)?;
    blog_posts.push(dto);
  }

  Ok(ViewLatestBlogPostsDTO { blog_posts })
}

/// BlogPostEntityからViewLatestBlogPostDTOに変換する
fn blog_post_entity_to_view_latest_single_dto(entity: BlogPostEntity) -> Result<ViewLatestBlogPostDTO> {
  // サムネイル画像の変換
  let thumbnail = match entity.get_thumbnail() {
    Some(thumbnail_entity) => Image {
      id: thumbnail_entity.get_id(),
      path: thumbnail_entity.get_path().to_string(),
    },
    None => {
      return Err(anyhow::anyhow!("記事にサムネイル画像が設定されていません"));
    }
  };

  // コンテンツの変換
  let mut contents = Vec::new();
  for content_entity in entity.get_contents() {
    let content = convert_content_entity_to_blog_post_content(content_entity)?;
    contents.push(content);
  }

  Ok(ViewLatestBlogPostDTO {
    id: entity.get_id().to_string(),
    title: entity.get_title_text().to_string(),
    thumbnail,
    post_date: entity.get_post_date(),
    last_update_date: entity.get_last_update_date(),
    contents,
    published_date: Utc::now(), // 現在時刻を設定（実際の実装では適切な値を設定）
    is_public: true,            // 公開済みの記事のみ取得するため常にtrue
  })
}

/// ContentEntityをBlogPostContentに変換する
fn convert_content_entity_to_blog_post_content(content_entity: &ContentEntity) -> Result<BlogPostContent> {
  use common::types::api::response::*;

  match content_entity {
    ContentEntity::H2(h2_entity) => Ok(BlogPostContent::H2(H2Block {
      id: h2_entity.get_id(),
      text: h2_entity.get_value().to_string(),
    })),
    ContentEntity::H3(h3_entity) => Ok(BlogPostContent::H3(H3Block {
      id: h3_entity.get_id(),
      text: h3_entity.get_value().to_string(),
    })),
    ContentEntity::Paragraph(paragraph_entity) => {
      let rich_text_vo = paragraph_entity.get_value();
      let mut text_elements = Vec::new();

      for rich_text_part in rich_text_vo.get_text() {
        let link = match rich_text_part.get_link() {
          Some(link_vo) => Some(Link { url: link_vo.url.clone() }),
          None => None,
        };

        let rich_text_element = RichText {
          text: rich_text_part.get_text().to_string(),
          styles: Style {
            bold: rich_text_part.get_styles().bold,
            inline_code: rich_text_part.get_styles().inline_code,
          },
          link,
        };
        text_elements.push(rich_text_element);
      }

      Ok(BlogPostContent::Paragraph(ParagraphBlock {
        id: paragraph_entity.get_id(),
        text: text_elements,
      }))
    }
    ContentEntity::Image(image_entity) => Ok(BlogPostContent::Image(ImageBlock {
      id: image_entity.get_id(),
      path: image_entity.get_path().to_string(),
    })),
    ContentEntity::CodeBlock(code_entity) => Ok(BlogPostContent::Code(CodeBlock {
      id: code_entity.get_id(),
      title: code_entity.get_title().to_string(),
      code: code_entity.get_code().to_string(),
      language: code_entity.get_language().to_string(),
    })),
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::content_entity::ContentEntity;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use chrono::NaiveDate;
  use uuid::Uuid;

  #[test]
  fn test_空のリストを変換できる() {
    // Arrange
    let entities = Vec::new();

    // Act
    let result = blog_post_entities_to_view_latest_dto(entities);

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 0);
  }

  #[test]
  fn test_単一記事を変換できる() {
    // Arrange
    let post_id = Uuid::new_v4();
    let thumbnail_id = Uuid::new_v4();
    let content_id = Uuid::new_v4();

    let mut entity = BlogPostEntity::new(post_id, "テスト記事".to_string());
    entity.set_post_date(NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
    entity.set_last_update_date(NaiveDate::from_ymd_opt(2024, 1, 2).unwrap());

    // サムネイル設定
    entity.set_thumbnail(thumbnail_id, "test-thumbnail.jpg".to_string());

    // コンテンツ設定（現在はシンプルなH2コンテンツでテスト）
    let content = ContentEntity::h2(content_id, "テストコンテンツ".to_string());
    entity.add_content(content);

    let entities = vec![entity];

    // Act
    let result = blog_post_entities_to_view_latest_dto(entities);

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 1);

    let blog_post = &dto.blog_posts[0];
    assert_eq!(blog_post.id, post_id.to_string());
    assert_eq!(blog_post.title, "テスト記事");
    assert_eq!(blog_post.thumbnail.id, thumbnail_id);
    assert_eq!(blog_post.thumbnail.path, "test-thumbnail.jpg");
    assert_eq!(blog_post.post_date, NaiveDate::from_ymd_opt(2024, 1, 1).unwrap());
    assert_eq!(blog_post.last_update_date, NaiveDate::from_ymd_opt(2024, 1, 2).unwrap());
    assert_eq!(blog_post.contents.len(), 1);
    assert_eq!(blog_post.is_public, true);
  }

  #[test]
  fn test_複数記事を変換できる() {
    // Arrange
    let mut entities = Vec::new();

    for i in 1..=3 {
      let post_id = Uuid::new_v4();
      let thumbnail_id = Uuid::new_v4();

      let mut entity = BlogPostEntity::new(post_id, format!("記事{}", i));
      entity.set_post_date(NaiveDate::from_ymd_opt(2024, 1, i as u32).unwrap());
      entity.set_last_update_date(NaiveDate::from_ymd_opt(2024, 1, i as u32 + 10).unwrap());

      entity.set_thumbnail(thumbnail_id, format!("thumbnail{}.jpg", i));

      entities.push(entity);
    }

    // Act
    let result = blog_post_entities_to_view_latest_dto(entities);

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 3);

    for (i, blog_post) in dto.blog_posts.iter().enumerate() {
      assert_eq!(blog_post.title, format!("記事{}", i + 1));
      assert_eq!(blog_post.thumbnail.path, format!("thumbnail{}.jpg", i + 1));
      assert_eq!(blog_post.post_date, NaiveDate::from_ymd_opt(2024, 1, (i + 1) as u32).unwrap());
    }
  }
}
