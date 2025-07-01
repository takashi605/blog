use crate::domain::blog_domain::blog_post_entity::content_entity::ContentEntity;
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use anyhow::Result;

use super::dto::{
  ViewLatestBlogPostCodeBlockDTO, ViewLatestBlogPostContentDTO, ViewLatestBlogPostH2BlockDTO, ViewLatestBlogPostH3BlockDTO, ViewLatestBlogPostImageBlockDTO,
  ViewLatestBlogPostImageDTO, ViewLatestBlogPostItemDTO, ViewLatestBlogPostLinkDTO, ViewLatestBlogPostParagraphBlockDTO, ViewLatestBlogPostRichTextDTO,
  ViewLatestBlogPostStyleDTO, ViewLatestBlogPostsDTO,
};

/// BlogPostEntityのVecからViewLatestBlogPostsDTOに変換する
pub fn blog_post_entities_to_view_latest_dto(entities: Vec<BlogPostEntity>) -> Result<ViewLatestBlogPostsDTO> {
  let mut blog_posts = Vec::new();

  for entity in entities {
    let dto = blog_post_entity_to_view_latest_single_dto(entity)?;
    blog_posts.push(dto);
  }

  Ok(ViewLatestBlogPostsDTO { blog_posts })
}

/// BlogPostEntityからViewLatestBlogPostItemDTOに変換する
fn blog_post_entity_to_view_latest_single_dto(entity: BlogPostEntity) -> Result<ViewLatestBlogPostItemDTO> {
  // サムネイル画像の変換
  let thumbnail = match entity.get_thumbnail() {
    Some(thumbnail_entity) => ViewLatestBlogPostImageDTO {
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
    let content = convert_content_entity_to_view_latest_content(content_entity)?;
    contents.push(content);
  }

  Ok(ViewLatestBlogPostItemDTO {
    id: entity.get_id().to_string(),
    title: entity.get_title_text().to_string(),
    thumbnail,
    post_date: entity.get_post_date().to_naive_date(),
    last_update_date: entity.get_last_update_date().to_naive_date(),
    contents,
    published_date: entity.get_published_date().to_naive_date(),
    is_public: true, // 公開済みの記事のみ取得するため常にtrue
  })
}

/// ContentEntityをViewLatestBlogPostContentDTOに変換する
fn convert_content_entity_to_view_latest_content(content_entity: &ContentEntity) -> Result<ViewLatestBlogPostContentDTO> {
  match content_entity {
    ContentEntity::H2(h2_entity) => Ok(ViewLatestBlogPostContentDTO::H2(ViewLatestBlogPostH2BlockDTO {
      id: h2_entity.get_id(),
      text: h2_entity.get_value().to_string(),
    })),
    ContentEntity::H3(h3_entity) => Ok(ViewLatestBlogPostContentDTO::H3(ViewLatestBlogPostH3BlockDTO {
      id: h3_entity.get_id(),
      text: h3_entity.get_value().to_string(),
    })),
    ContentEntity::Paragraph(paragraph_entity) => {
      let rich_text_vo = paragraph_entity.get_value();
      let mut text_elements = Vec::new();

      for rich_text_part in rich_text_vo.get_text() {
        let link = match rich_text_part.get_link() {
          Some(link_vo) => Some(ViewLatestBlogPostLinkDTO { url: link_vo.url.clone() }),
          None => None,
        };

        let rich_text_element = ViewLatestBlogPostRichTextDTO {
          text: rich_text_part.get_text().to_string(),
          styles: ViewLatestBlogPostStyleDTO {
            bold: rich_text_part.get_styles().bold,
            inline_code: rich_text_part.get_styles().inline_code,
          },
          link,
        };
        text_elements.push(rich_text_element);
      }

      Ok(ViewLatestBlogPostContentDTO::Paragraph(ViewLatestBlogPostParagraphBlockDTO {
        id: paragraph_entity.get_id(),
        text: text_elements,
      }))
    }
    ContentEntity::Image(image_entity) => Ok(ViewLatestBlogPostContentDTO::Image(ViewLatestBlogPostImageBlockDTO {
      id: image_entity.get_id(),
      path: image_entity.get_path().to_string(),
    })),
    ContentEntity::CodeBlock(code_entity) => Ok(ViewLatestBlogPostContentDTO::Code(ViewLatestBlogPostCodeBlockDTO {
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
  use crate::domain::blog_domain::jst_date_vo::JstDate;
  use chrono::NaiveDate;
  use uuid::Uuid;

  #[test]
  fn test_can_convert_empty_list() {
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
  fn test_can_convert_single_article() {
    // Arrange
    let post_id = Uuid::new_v4();
    let thumbnail_id = Uuid::new_v4();
    let content_id = Uuid::new_v4();

    let mut entity = BlogPostEntity::new(post_id, "テスト記事".to_string());
    entity.set_post_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, 1).unwrap()));
    entity.set_last_update_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, 2).unwrap()));

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
  fn test_can_convert_multiple_articles() {
    // Arrange
    let mut entities = Vec::new();

    for i in 1..=3 {
      let post_id = Uuid::new_v4();
      let thumbnail_id = Uuid::new_v4();

      let mut entity = BlogPostEntity::new(post_id, format!("記事{}", i));
      entity.set_post_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, i as u32).unwrap()));
      entity.set_last_update_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, i as u32 + 10).unwrap()));

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

  #[test]
  fn test_can_convert_all_content_types_correctly() {
    use crate::domain::blog_domain::blog_post_entity::rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO};

    // Arrange
    let post_id = Uuid::new_v4();
    let thumbnail_id = Uuid::new_v4();
    let h2_id = Uuid::new_v4();
    let h3_id = Uuid::new_v4();
    let paragraph_id = Uuid::new_v4();
    let image_id = Uuid::new_v4();
    let code_id = Uuid::new_v4();

    let mut entity = BlogPostEntity::new(post_id, "コンテンツ変換テスト記事".to_string());
    entity.set_post_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, 1).unwrap()));
    entity.set_last_update_date(JstDate::from_naive_date(NaiveDate::from_ymd_opt(2024, 1, 2).unwrap()));
    entity.set_thumbnail(thumbnail_id, "test-thumbnail.jpg".to_string());

    // H2コンテンツ
    let h2_content = ContentEntity::h2(h2_id, "見出し2".to_string());
    entity.add_content(h2_content);

    // H3コンテンツ
    let h3_content = ContentEntity::h3(h3_id, "見出し3".to_string());
    entity.add_content(h3_content);

    // Paragraphコンテンツ（リッチテキスト含む）
    let rich_text_parts = vec![
      RichTextPartVO::new(
        "通常のテキスト".to_string(),
        Some(RichTextStylesVO {
          bold: false,
          inline_code: false,
        }),
        None,
      ),
      RichTextPartVO::new(
        "太字のテキスト".to_string(),
        Some(RichTextStylesVO {
          bold: true,
          inline_code: false,
        }),
        None,
      ),
      RichTextPartVO::new(
        "リンクテキスト".to_string(),
        Some(RichTextStylesVO {
          bold: false,
          inline_code: false,
        }),
        Some(LinkVO {
          url: "https://example.com".to_string(),
        }),
      ),
    ];
    let rich_text_vo = RichTextVO::new(rich_text_parts);
    let paragraph_content = ContentEntity::paragraph(paragraph_id, rich_text_vo);
    entity.add_content(paragraph_content);

    // Imageコンテンツ
    use crate::domain::blog_domain::blog_post_entity::image_content_entity::ImageContentEntity;
    use crate::domain::image_domain::image_entity::ImageEntity;
    let image_entity = ImageEntity::new(uuid::Uuid::new_v4(), "test-image.jpg".to_string());
    let image_content_entity = ImageContentEntity::new(image_id, image_entity);
    let image_content = ContentEntity::image_from_entity(image_content_entity);
    entity.add_content(image_content);

    // CodeBlockコンテンツ
    let code_content = ContentEntity::code_block(
      code_id,
      "サンプルコード".to_string(),
      "console.log('Hello, World!');".to_string(),
      "javascript".to_string(),
    );
    entity.add_content(code_content);

    let entities = vec![entity];

    // Act
    let result = blog_post_entities_to_view_latest_dto(entities);

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.blog_posts.len(), 1);

    let blog_post = &dto.blog_posts[0];
    assert_eq!(blog_post.id, post_id.to_string());
    assert_eq!(blog_post.title, "コンテンツ変換テスト記事");
    assert_eq!(blog_post.contents.len(), 5);

    // H2コンテンツの検証
    match &blog_post.contents[0] {
      ViewLatestBlogPostContentDTO::H2(h2_block) => {
        assert_eq!(h2_block.id, h2_id);
        assert_eq!(h2_block.text, "見出し2");
      }
      _ => panic!("期待されたH2コンテンツではありません"),
    }

    // H3コンテンツの検証
    match &blog_post.contents[1] {
      ViewLatestBlogPostContentDTO::H3(h3_block) => {
        assert_eq!(h3_block.id, h3_id);
        assert_eq!(h3_block.text, "見出し3");
      }
      _ => panic!("期待されたH3コンテンツではありません"),
    }

    // Paragraphコンテンツの検証
    match &blog_post.contents[2] {
      ViewLatestBlogPostContentDTO::Paragraph(paragraph_block) => {
        assert_eq!(paragraph_block.id, paragraph_id);
        assert_eq!(paragraph_block.text.len(), 3);

        // 通常のテキスト
        assert_eq!(paragraph_block.text[0].text, "通常のテキスト");
        assert!(!paragraph_block.text[0].styles.bold);
        assert!(!paragraph_block.text[0].styles.inline_code);
        assert!(paragraph_block.text[0].link.is_none());

        // 太字のテキスト
        assert_eq!(paragraph_block.text[1].text, "太字のテキスト");
        assert!(paragraph_block.text[1].styles.bold);
        assert!(!paragraph_block.text[1].styles.inline_code);
        assert!(paragraph_block.text[1].link.is_none());

        // リンクテキスト
        assert_eq!(paragraph_block.text[2].text, "リンクテキスト");
        assert!(!paragraph_block.text[2].styles.bold);
        assert!(!paragraph_block.text[2].styles.inline_code);
        assert_eq!(paragraph_block.text[2].link.as_ref().unwrap().url, "https://example.com");
      }
      _ => panic!("期待されたParagraphコンテンツではありません"),
    }

    // Imageコンテンツの検証
    match &blog_post.contents[3] {
      ViewLatestBlogPostContentDTO::Image(image_block) => {
        assert_eq!(image_block.id, image_id);
        assert_eq!(image_block.path, "test-image.jpg");
      }
      _ => panic!("期待されたImageコンテンツではありません"),
    }

    // CodeBlockコンテンツの検証
    match &blog_post.contents[4] {
      ViewLatestBlogPostContentDTO::Code(code_block) => {
        assert_eq!(code_block.id, code_id);
        assert_eq!(code_block.title, "サンプルコード");
        assert_eq!(code_block.code, "console.log('Hello, World!');");
        assert_eq!(code_block.language, "javascript");
      }
      _ => panic!("期待されたCodeコンテンツではありません"),
    }
  }
}
