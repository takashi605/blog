use crate::application::usecase::create_blog_post::dto::{
  CreateBlogPostDTO, CreateContentDTO, CreateImageDTO, CreateLinkDTO, CreateRichTextDTO, CreateStyleDTO,
};
use common::types::api;
use uuid::Uuid;

pub fn api_blog_post_to_create_dto(api_blog_post: api::BlogPost) -> CreateBlogPostDTO {
  CreateBlogPostDTO {
    title: api_blog_post.title,
    thumbnail: api_image_to_create_dto(api_blog_post.thumbnail),
    post_date: Some(api_blog_post.post_date),
    last_update_date: Some(api_blog_post.last_update_date),
    contents: api_blog_post.contents.into_iter().map(api_content_to_create_dto).collect(),
  }
}

fn api_image_to_create_dto(api_image: api::Image) -> CreateImageDTO {
  CreateImageDTO {
    id: api_image.id,
    path: api_image.path,
  }
}

fn api_content_to_create_dto(api_content: api::BlogPostContent) -> CreateContentDTO {
  match api_content {
    api::BlogPostContent::H2(h2) => CreateContentDTO::H2 { id: h2.id, text: h2.text },
    api::BlogPostContent::H3(h3) => CreateContentDTO::H3 { id: h3.id, text: h3.text },
    api::BlogPostContent::Paragraph(paragraph) => CreateContentDTO::Paragraph {
      id: paragraph.id,
      text: paragraph.text.into_iter().map(api_rich_text_to_create_dto).collect(),
    },
    api::BlogPostContent::Image(image) => CreateContentDTO::Image {
      id: image.id,
      path: image.path,
    },
    api::BlogPostContent::Code(code) => CreateContentDTO::CodeBlock {
      id: code.id,
      title: code.title,
      code: code.code,
      language: code.language,
    },
  }
}

fn api_rich_text_to_create_dto(api_rich_text: api::RichText) -> CreateRichTextDTO {
  CreateRichTextDTO {
    text: api_rich_text.text,
    styles: api_style_to_create_dto(api_rich_text.styles),
    link: api_rich_text.link.map(api_link_to_create_dto),
  }
}

fn api_style_to_create_dto(api_style: api::Style) -> CreateStyleDTO {
  CreateStyleDTO {
    bold: api_style.bold,
    inline_code: api_style.inline_code,
  }
}

fn api_link_to_create_dto(api_link: api::Link) -> CreateLinkDTO {
  CreateLinkDTO { url: api_link.url }
}

// 新しいリクエスト型用の変換関数
pub fn api_create_blog_post_request_to_create_dto(request: api::CreateBlogPostRequest) -> CreateBlogPostDTO {
  CreateBlogPostDTO {
    title: request.title,
    thumbnail: api_create_image_request_to_create_dto(request.thumbnail),
    post_date: Some(request.post_date),
    last_update_date: Some(request.last_update_date),
    contents: request.contents.into_iter().map(api_create_content_request_to_create_dto).collect(),
  }
}

fn api_create_image_request_to_create_dto(request: api::CreateImageRequest) -> CreateImageDTO {
  CreateImageDTO {
    id: request.id.unwrap_or_else(|| Uuid::new_v4()), // IDが指定されていれば使用、なければ新規生成
    path: request.path,
  }
}

fn api_create_content_request_to_create_dto(request: api::CreateBlogPostContentRequest) -> CreateContentDTO {
  match request {
    api::CreateBlogPostContentRequest::H2(h2) => CreateContentDTO::H2 {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: h2.text,
    },
    api::CreateBlogPostContentRequest::H3(h3) => CreateContentDTO::H3 {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: h3.text,
    },
    api::CreateBlogPostContentRequest::Paragraph(paragraph) => CreateContentDTO::Paragraph {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: paragraph.text.into_iter().map(api_rich_text_to_create_dto).collect(),
    },
    api::CreateBlogPostContentRequest::Image(image) => CreateContentDTO::Image {
      id: Uuid::new_v4(), // 新しいIDを生成
      path: image.path,
    },
    api::CreateBlogPostContentRequest::Code(code) => CreateContentDTO::CodeBlock {
      id: Uuid::new_v4(), // 新しいIDを生成
      title: code.title,
      code: code.code,
      language: code.language,
    },
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::NaiveDate;
  use uuid::Uuid;

  fn create_test_api_blog_post() -> api::BlogPost {
    api::BlogPost {
      id: Uuid::new_v4(),
      title: "テスト記事".to_string(),
      thumbnail: api::Image {
        id: Uuid::new_v4(),
        path: "/images/test.jpg".to_string(),
      },
      post_date: NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      last_update_date: NaiveDate::from_ymd_opt(2024, 1, 2).unwrap(),
      contents: vec![
        api::BlogPostContent::H2(api::H2Block {
          id: Uuid::new_v4(),
          text: "見出し2".to_string(),
        }),
        api::BlogPostContent::H3(api::H3Block {
          id: Uuid::new_v4(),
          text: "見出し3".to_string(),
        }),
        api::BlogPostContent::Paragraph(api::ParagraphBlock {
          id: Uuid::new_v4(),
          text: vec![
            api::RichText {
              text: "通常テキスト".to_string(),
              styles: api::Style {
                bold: false,
                inline_code: false,
              },
              link: None,
            },
            api::RichText {
              text: "太字テキスト".to_string(),
              styles: api::Style {
                bold: true,
                inline_code: false,
              },
              link: None,
            },
            api::RichText {
              text: "リンクテキスト".to_string(),
              styles: api::Style {
                bold: false,
                inline_code: false,
              },
              link: Some(api::Link {
                url: "https://example.com".to_string(),
              }),
            },
          ],
        }),
        api::BlogPostContent::Image(api::ImageBlock {
          id: Uuid::new_v4(),
          path: "/images/content.jpg".to_string(),
        }),
        api::BlogPostContent::Code(api::CodeBlock {
          id: Uuid::new_v4(),
          title: "Rustコード".to_string(),
          code: "fn main() { println!(\"Hello\"); }".to_string(),
          language: "rust".to_string(),
        }),
      ],
    }
  }

  #[test]
  fn test_api_blog_post_to_create_dto_basic_fields() {
    let api_blog_post = create_test_api_blog_post();
    let expected_title = api_blog_post.title.clone();
    let expected_post_date = Some(api_blog_post.post_date);
    let expected_thumbnail_id = api_blog_post.thumbnail.id;
    let expected_thumbnail_path = api_blog_post.thumbnail.path.clone();

    let dto = api_blog_post_to_create_dto(api_blog_post);

    assert_eq!(dto.title, expected_title);
    assert_eq!(dto.post_date, expected_post_date);
    assert_eq!(dto.last_update_date, Some(create_test_api_blog_post().last_update_date));
    assert_eq!(dto.thumbnail.id, expected_thumbnail_id);
    assert_eq!(dto.thumbnail.path, expected_thumbnail_path);
    assert_eq!(dto.contents.len(), 5);
  }

  #[test]
  fn test_api_image_to_create_dto() {
    let api_image = api::Image {
      id: Uuid::new_v4(),
      path: "/test/path.jpg".to_string(),
    };
    let expected_id = api_image.id;
    let expected_path = api_image.path.clone();

    let dto = api_image_to_create_dto(api_image);

    assert_eq!(dto.id, expected_id);
    assert_eq!(dto.path, expected_path);
  }

  #[test]
  fn test_api_content_to_create_dto_h2() {
    let id = Uuid::new_v4();
    let text = "テスト見出し2".to_string();
    let api_content = api::BlogPostContent::H2(api::H2Block { id, text: text.clone() });

    let dto = api_content_to_create_dto(api_content);

    match dto {
      CreateContentDTO::H2 { id: dto_id, text: dto_text } => {
        assert_eq!(dto_id, id);
        assert_eq!(dto_text, text);
      }
      _ => panic!("Expected H2 content"),
    }
  }

  #[test]
  fn test_api_content_to_create_dto_h3() {
    let id = Uuid::new_v4();
    let text = "テスト見出し3".to_string();
    let api_content = api::BlogPostContent::H3(api::H3Block { id, text: text.clone() });

    let dto = api_content_to_create_dto(api_content);

    match dto {
      CreateContentDTO::H3 { id: dto_id, text: dto_text } => {
        assert_eq!(dto_id, id);
        assert_eq!(dto_text, text);
      }
      _ => panic!("Expected H3 content"),
    }
  }

  #[test]
  fn test_api_content_to_create_dto_paragraph() {
    let id = Uuid::new_v4();
    let api_content = api::BlogPostContent::Paragraph(api::ParagraphBlock {
      id,
      text: vec![api::RichText {
        text: "テストテキスト".to_string(),
        styles: api::Style {
          bold: true,
          inline_code: false,
        },
        link: None,
      }],
    });

    let dto = api_content_to_create_dto(api_content);

    match dto {
      CreateContentDTO::Paragraph { id: dto_id, text } => {
        assert_eq!(dto_id, id);
        assert_eq!(text.len(), 1);
        assert_eq!(text[0].text, "テストテキスト");
        assert!(text[0].styles.bold);
        assert!(!text[0].styles.inline_code);
        assert!(text[0].link.is_none());
      }
      _ => panic!("Expected Paragraph content"),
    }
  }

  #[test]
  fn test_api_content_to_create_dto_image() {
    let id = Uuid::new_v4();
    let path = "/test/image.jpg".to_string();
    let api_content = api::BlogPostContent::Image(api::ImageBlock { id, path: path.clone() });

    let dto = api_content_to_create_dto(api_content);

    match dto {
      CreateContentDTO::Image { id: dto_id, path: dto_path } => {
        assert_eq!(dto_id, id);
        assert_eq!(dto_path, path);
      }
      _ => panic!("Expected Image content"),
    }
  }

  #[test]
  fn test_api_content_to_create_dto_code_block() {
    let id = Uuid::new_v4();
    let title = "テストコード".to_string();
    let code = "console.log('test');".to_string();
    let language = "javascript".to_string();
    let api_content = api::BlogPostContent::Code(api::CodeBlock {
      id,
      title: title.clone(),
      code: code.clone(),
      language: language.clone(),
    });

    let dto = api_content_to_create_dto(api_content);

    match dto {
      CreateContentDTO::CodeBlock {
        id: dto_id,
        title: dto_title,
        code: dto_code,
        language: dto_language,
      } => {
        assert_eq!(dto_id, id);
        assert_eq!(dto_title, title);
        assert_eq!(dto_code, code);
        assert_eq!(dto_language, language);
      }
      _ => panic!("Expected CodeBlock content"),
    }
  }

  #[test]
  fn test_api_rich_text_to_create_dto() {
    let api_rich_text = api::RichText {
      text: "リンク付きテキスト".to_string(),
      styles: api::Style { bold: true, inline_code: true },
      link: Some(api::Link {
        url: "https://test.com".to_string(),
      }),
    };

    let dto = api_rich_text_to_create_dto(api_rich_text);

    assert_eq!(dto.text, "リンク付きテキスト");
    assert!(dto.styles.bold);
    assert!(dto.styles.inline_code);
    assert!(dto.link.is_some());
    assert_eq!(dto.link.unwrap().url, "https://test.com");
  }

  #[test]
  fn test_api_style_to_create_dto() {
    let api_style = api::Style {
      bold: true,
      inline_code: false,
    };

    let dto = api_style_to_create_dto(api_style);

    assert!(dto.bold);
    assert!(!dto.inline_code);
  }

  #[test]
  fn test_api_link_to_create_dto() {
    let api_link = api::Link {
      url: "https://example.org".to_string(),
    };

    let dto = api_link_to_create_dto(api_link);

    assert_eq!(dto.url, "https://example.org");
  }

  #[test]
  fn test_complex_blog_post_conversion() {
    let api_blog_post = create_test_api_blog_post();
    let dto = api_blog_post_to_create_dto(api_blog_post);

    // 基本フィールドの確認
    assert_eq!(dto.title, "テスト記事");
    assert!(dto.post_date.is_some());

    // コンテンツの確認
    assert_eq!(dto.contents.len(), 5);

    // H2コンテンツの確認
    match &dto.contents[0] {
      CreateContentDTO::H2 { text, .. } => assert_eq!(text, "見出し2"),
      _ => panic!("Expected H2 content at index 0"),
    }

    // H3コンテンツの確認
    match &dto.contents[1] {
      CreateContentDTO::H3 { text, .. } => assert_eq!(text, "見出し3"),
      _ => panic!("Expected H3 content at index 1"),
    }

    // Paragraphコンテンツの確認
    match &dto.contents[2] {
      CreateContentDTO::Paragraph { text, .. } => {
        assert_eq!(text.len(), 3);
        assert_eq!(text[0].text, "通常テキスト");
        assert!(!text[0].styles.bold);
        assert!(text[0].link.is_none());

        assert_eq!(text[1].text, "太字テキスト");
        assert!(text[1].styles.bold);

        assert_eq!(text[2].text, "リンクテキスト");
        assert!(text[2].link.is_some());
        assert_eq!(text[2].link.as_ref().unwrap().url, "https://example.com");
      }
      _ => panic!("Expected Paragraph content at index 2"),
    }

    // Imageコンテンツの確認
    match &dto.contents[3] {
      CreateContentDTO::Image { path, .. } => assert_eq!(path, "/images/content.jpg"),
      _ => panic!("Expected Image content at index 3"),
    }

    // CodeBlockコンテンツの確認
    match &dto.contents[4] {
      CreateContentDTO::CodeBlock { title, code, language, .. } => {
        assert_eq!(title, "Rustコード");
        assert_eq!(code, "fn main() { println!(\"Hello\"); }");
        assert_eq!(language, "rust");
      }
      _ => panic!("Expected CodeBlock content at index 4"),
    }
  }
}
