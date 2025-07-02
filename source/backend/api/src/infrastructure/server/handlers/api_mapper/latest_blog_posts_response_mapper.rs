use anyhow::{anyhow, Result};
use common::types::api::{BlogPost, BlogPostContent, CodeBlock, H2Block, H3Block, Image, ImageBlock, Link, ParagraphBlock, RichText, Style};
use uuid::Uuid;

use crate::application::usecase::view_latest_blog_posts::dto::{
  ViewLatestBlogPostCodeBlockDTO, ViewLatestBlogPostContentDTO, ViewLatestBlogPostH2BlockDTO, ViewLatestBlogPostH3BlockDTO, ViewLatestBlogPostImageBlockDTO,
  ViewLatestBlogPostImageDTO, ViewLatestBlogPostItemDTO, ViewLatestBlogPostLinkDTO, ViewLatestBlogPostParagraphBlockDTO, ViewLatestBlogPostRichTextDTO,
  ViewLatestBlogPostStyleDTO, ViewLatestBlogPostsDTO,
};

/// ViewLatestBlogPostsDTOをAPIレスポンスのVec<BlogPost>に変換する
pub fn view_latest_blog_posts_dto_to_response(dto: ViewLatestBlogPostsDTO) -> Result<Vec<BlogPost>> {
  let mut blog_posts = Vec::new();

  for post_dto in dto.blog_posts {
    let blog_post = convert_view_latest_blog_post_item_dto_to_blog_post(post_dto)?;
    blog_posts.push(blog_post);
  }

  Ok(blog_posts)
}

/// ViewLatestBlogPostItemDTOをBlogPostに変換する
fn convert_view_latest_blog_post_item_dto_to_blog_post(dto: ViewLatestBlogPostItemDTO) -> Result<BlogPost> {
  // IDをUUIDとしてパース
  let id = Uuid::parse_str(&dto.id).map_err(|_| anyhow!("DTOのIDをUUIDに変換できませんでした: {}", dto.id))?;

  Ok(BlogPost {
    id,
    title: dto.title,
    thumbnail: convert_view_latest_image_dto_to_api(dto.thumbnail),
    post_date: dto.post_date,
    last_update_date: dto.last_update_date,
    published_date: dto.published_date,
    contents: convert_view_latest_contents_dto_to_api(dto.contents),
  })
}

/// ViewLatestBlogPostImageDTOをAPI型のImageに変換
fn convert_view_latest_image_dto_to_api(dto: ViewLatestBlogPostImageDTO) -> Image {
  Image { id: dto.id, path: dto.path }
}

/// ViewLatestBlogPostContentDTOのVecをAPI型のBlogPostContentのVecに変換
fn convert_view_latest_contents_dto_to_api(dto_contents: Vec<ViewLatestBlogPostContentDTO>) -> Vec<BlogPostContent> {
  dto_contents.into_iter().map(convert_view_latest_content_dto_to_api).collect()
}

/// ViewLatestBlogPostContentDTOをAPI型のBlogPostContentに変換
fn convert_view_latest_content_dto_to_api(dto: ViewLatestBlogPostContentDTO) -> BlogPostContent {
  match dto {
    ViewLatestBlogPostContentDTO::H2(h2) => BlogPostContent::H2(convert_view_latest_h2_dto_to_api(h2)),
    ViewLatestBlogPostContentDTO::H3(h3) => BlogPostContent::H3(convert_view_latest_h3_dto_to_api(h3)),
    ViewLatestBlogPostContentDTO::Paragraph(para) => BlogPostContent::Paragraph(convert_view_latest_paragraph_dto_to_api(para)),
    ViewLatestBlogPostContentDTO::Image(img) => BlogPostContent::Image(convert_view_latest_image_block_dto_to_api(img)),
    ViewLatestBlogPostContentDTO::Code(code) => BlogPostContent::Code(convert_view_latest_code_block_dto_to_api(code)),
  }
}

/// ViewLatestBlogPostH2BlockDTOをAPI型のH2Blockに変換
fn convert_view_latest_h2_dto_to_api(dto: ViewLatestBlogPostH2BlockDTO) -> H2Block {
  H2Block { id: dto.id, text: dto.text }
}

/// ViewLatestBlogPostH3BlockDTOをAPI型のH3Blockに変換
fn convert_view_latest_h3_dto_to_api(dto: ViewLatestBlogPostH3BlockDTO) -> H3Block {
  H3Block { id: dto.id, text: dto.text }
}

/// ViewLatestBlogPostParagraphBlockDTOをAPI型のParagraphBlockに変換
fn convert_view_latest_paragraph_dto_to_api(dto: ViewLatestBlogPostParagraphBlockDTO) -> ParagraphBlock {
  ParagraphBlock {
    id: dto.id,
    text: dto.text.into_iter().map(convert_view_latest_rich_text_dto_to_api).collect(),
  }
}

/// ViewLatestBlogPostRichTextDTOをAPI型のRichTextに変換
fn convert_view_latest_rich_text_dto_to_api(dto: ViewLatestBlogPostRichTextDTO) -> RichText {
  RichText {
    text: dto.text,
    styles: convert_view_latest_style_dto_to_api(dto.styles),
    link: dto.link.map(convert_view_latest_link_dto_to_api),
  }
}

/// ViewLatestBlogPostStyleDTOをAPI型のStyleに変換
fn convert_view_latest_style_dto_to_api(dto: ViewLatestBlogPostStyleDTO) -> Style {
  Style {
    bold: dto.bold,
    inline_code: dto.inline_code,
  }
}

/// ViewLatestBlogPostLinkDTOをAPI型のLinkに変換
fn convert_view_latest_link_dto_to_api(dto: ViewLatestBlogPostLinkDTO) -> Link {
  Link { url: dto.url }
}

/// ViewLatestBlogPostImageBlockDTOをAPI型のImageBlockに変換
fn convert_view_latest_image_block_dto_to_api(dto: ViewLatestBlogPostImageBlockDTO) -> ImageBlock {
  ImageBlock { id: dto.id, path: dto.path }
}

/// ViewLatestBlogPostCodeBlockDTOをAPI型のCodeBlockに変換
fn convert_view_latest_code_block_dto_to_api(dto: ViewLatestBlogPostCodeBlockDTO) -> CodeBlock {
  CodeBlock {
    id: dto.id,
    title: dto.title,
    code: dto.code,
    language: dto.language,
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::NaiveDate;
  use uuid::Uuid;

  #[test]
  fn test_converts_empty_view_latest_blog_posts_dto() {
    // Arrange
    let dto = ViewLatestBlogPostsDTO { blog_posts: vec![] };

    // Act
    let result = view_latest_blog_posts_dto_to_response(dto);

    // Assert
    assert!(result.is_ok());
    let blog_posts = result.unwrap();
    assert_eq!(blog_posts.len(), 0);
  }

  #[test]
  fn test_converts_single_article_view_latest_blog_posts_dto() {
    // Arrange
    let post_id = Uuid::new_v4();
    let thumbnail_id = Uuid::new_v4();

    let post_dto = ViewLatestBlogPostItemDTO {
      id: post_id.to_string(),
      title: "テスト記事".to_string(),
      thumbnail: ViewLatestBlogPostImageDTO {
        id: thumbnail_id,
        path: "test-thumbnail.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents: vec![],
      published_date: NaiveDate::from_ymd_opt(2024, 1, 3).unwrap(),
      is_public: true,
    };

    let dto = ViewLatestBlogPostsDTO { blog_posts: vec![post_dto] };

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
  fn test_converts_multiple_articles_view_latest_blog_posts_dto() {
    // Arrange
    let mut blog_posts_dto = vec![];

    for i in 1..=3 {
      let post_id = Uuid::new_v4();
      let thumbnail_id = Uuid::new_v4();

      let post_dto = ViewLatestBlogPostItemDTO {
        id: post_id.to_string(),
        title: format!("記事{}", i),
        thumbnail: ViewLatestBlogPostImageDTO {
          id: thumbnail_id,
          path: format!("thumbnail{}.jpg", i),
        },
        post_date: NaiveDate::from_ymd_opt(2024, 1, i as u32).unwrap(),
        last_update_date: NaiveDate::from_ymd_opt(2024, 1, i as u32 + 10).unwrap(),
        contents: vec![],
        published_date: NaiveDate::from_ymd_opt(2024, 1, 3).unwrap(),
        is_public: true,
      };

      blog_posts_dto.push(post_dto);
    }

    let dto = ViewLatestBlogPostsDTO { blog_posts: blog_posts_dto };

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
  fn test_converts_view_latest_blog_posts_dto_with_content_conversion() {
    // Arrange
    let post_id = Uuid::new_v4();
    let thumbnail_id = Uuid::new_v4();
    let h2_id = Uuid::new_v4();
    let h3_id = Uuid::new_v4();
    let paragraph_id = Uuid::new_v4();
    let image_id = Uuid::new_v4();
    let code_id = Uuid::new_v4();

    let contents = vec![
      ViewLatestBlogPostContentDTO::H2(ViewLatestBlogPostH2BlockDTO {
        id: h2_id,
        text: "見出し2".to_string(),
      }),
      ViewLatestBlogPostContentDTO::H3(ViewLatestBlogPostH3BlockDTO {
        id: h3_id,
        text: "見出し3".to_string(),
      }),
      ViewLatestBlogPostContentDTO::Paragraph(ViewLatestBlogPostParagraphBlockDTO {
        id: paragraph_id,
        text: vec![
          ViewLatestBlogPostRichTextDTO {
            text: "通常のテキスト".to_string(),
            styles: ViewLatestBlogPostStyleDTO {
              bold: false,
              inline_code: false,
            },
            link: None,
          },
          ViewLatestBlogPostRichTextDTO {
            text: "太字のテキスト".to_string(),
            styles: ViewLatestBlogPostStyleDTO {
              bold: true,
              inline_code: false,
            },
            link: None,
          },
          ViewLatestBlogPostRichTextDTO {
            text: "リンクテキスト".to_string(),
            styles: ViewLatestBlogPostStyleDTO {
              bold: false,
              inline_code: false,
            },
            link: Some(ViewLatestBlogPostLinkDTO {
              url: "https://example.com".to_string(),
            }),
          },
        ],
      }),
      ViewLatestBlogPostContentDTO::Image(ViewLatestBlogPostImageBlockDTO {
        id: image_id,
        path: "test-image.jpg".to_string(),
      }),
      ViewLatestBlogPostContentDTO::Code(ViewLatestBlogPostCodeBlockDTO {
        id: code_id,
        title: "サンプルコード".to_string(),
        code: "console.log('Hello, World!');".to_string(),
        language: "javascript".to_string(),
      }),
    ];

    let post_dto = ViewLatestBlogPostItemDTO {
      id: post_id.to_string(),
      title: "コンテンツ変換テスト記事".to_string(),
      thumbnail: ViewLatestBlogPostImageDTO {
        id: thumbnail_id,
        path: "test-thumbnail.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents,
      published_date: NaiveDate::from_ymd_opt(2024, 1, 3).unwrap(),
      is_public: true,
    };

    let dto = ViewLatestBlogPostsDTO { blog_posts: vec![post_dto] };

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
  fn test_view_latest_blog_posts_dto_returns_error_with_invalid_uuid_format() {
    // Arrange
    let invalid_post_dto = ViewLatestBlogPostItemDTO {
      id: "invalid-uuid".to_string(),
      title: "テスト記事".to_string(),
      thumbnail: ViewLatestBlogPostImageDTO {
        id: Uuid::new_v4(),
        path: "test-thumbnail.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents: vec![],
      published_date: NaiveDate::from_ymd_opt(2024, 1, 3).unwrap(),
      is_public: true,
    };

    let dto = ViewLatestBlogPostsDTO {
      blog_posts: vec![invalid_post_dto],
    };

    // Act
    let result = view_latest_blog_posts_dto_to_response(dto);

    // Assert
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("DTOのIDをUUIDに変換できませんでした"));
  }
}
