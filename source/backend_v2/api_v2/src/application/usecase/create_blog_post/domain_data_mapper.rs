use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::domain::blog_domain::blog_post_factory::{
  CreateBlogPostInput, CreateContentInput, CreateImageInput, CreateLinkInput, CreateRichTextInput, CreateStyleInput,
};

// DTOの定義（APIリクエストから受け取るデータ構造）

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateBlogPostDTO {
  pub title: String,
  pub thumbnail: CreateImageDTO,
  pub post_date: Option<NaiveDate>,
  pub contents: Vec<CreateContentDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateImageDTO {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum CreateContentDTO {
  #[serde(rename = "h2")]
  H2 { id: Uuid, text: String },
  #[serde(rename = "h3")]
  H3 { id: Uuid, text: String },
  #[serde(rename = "paragraph")]
  Paragraph { id: Uuid, text: Vec<CreateRichTextDTO> },
  #[serde(rename = "image")]
  Image { id: Uuid, path: String },
  #[serde(rename = "code-block")]
  CodeBlock { id: Uuid, title: String, code: String, language: String },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateRichTextDTO {
  pub text: String,
  pub styles: CreateStyleDTO,
  pub link: Option<CreateLinkDTO>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateStyleDTO {
  pub bold: bool,
  #[serde(rename = "inline-code")]
  pub inline_code: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateLinkDTO {
  pub url: String,
}

// DTO -> ドメイン変換関数

/// CreateBlogPostDTOをCreateBlogPostInputに変換する
pub fn convert_dto_to_domain_input(dto: CreateBlogPostDTO) -> CreateBlogPostInput {
  CreateBlogPostInput {
    title: dto.title,
    thumbnail: Some(convert_image_dto_to_domain(dto.thumbnail)),
    post_date: dto.post_date,
    contents: dto.contents.into_iter().map(convert_content_dto_to_domain).collect(),
  }
}

/// CreateImageDTOをCreateImageInputに変換する
fn convert_image_dto_to_domain(dto: CreateImageDTO) -> CreateImageInput {
  CreateImageInput {
    id: dto.id,
    path: dto.path,
  }
}

/// CreateContentDTOをCreateContentInputに変換する
fn convert_content_dto_to_domain(dto: CreateContentDTO) -> CreateContentInput {
  match dto {
    CreateContentDTO::H2 { id, text } => CreateContentInput::H2 { id, text },
    CreateContentDTO::H3 { id, text } => CreateContentInput::H3 { id, text },
    CreateContentDTO::Paragraph { id, text } => CreateContentInput::Paragraph {
      id,
      text: text.into_iter().map(convert_rich_text_dto_to_domain).collect(),
    },
    CreateContentDTO::Image { id, path } => CreateContentInput::Image { id, path },
    CreateContentDTO::CodeBlock { id, title, code, language } => CreateContentInput::CodeBlock { id, title, code, language },
  }
}

/// CreateRichTextDTOをCreateRichTextInputに変換する
fn convert_rich_text_dto_to_domain(dto: CreateRichTextDTO) -> CreateRichTextInput {
  CreateRichTextInput {
    text: dto.text,
    styles: convert_style_dto_to_domain(dto.styles),
    link: dto.link.map(convert_link_dto_to_domain),
  }
}

/// CreateStyleDTOをCreateStyleInputに変換する
fn convert_style_dto_to_domain(dto: CreateStyleDTO) -> CreateStyleInput {
  CreateStyleInput {
    bold: dto.bold,
    inline_code: dto.inline_code,
  }
}

/// CreateLinkDTOをCreateLinkInputに変換する
fn convert_link_dto_to_domain(dto: CreateLinkDTO) -> CreateLinkInput {
  CreateLinkInput { url: dto.url }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::NaiveDate;
  use uuid::Uuid;

  #[test]
  fn test_convert_basic_blog_post_dto() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let dto = CreateBlogPostDTO {
      title: "テスト記事".to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: None,
      contents: vec![],
    };

    let domain_input = convert_dto_to_domain_input(dto);

    assert_eq!(domain_input.title, "テスト記事");
    let thumbnail = domain_input.thumbnail.unwrap();
    assert_eq!(thumbnail.id, thumbnail_id);
    assert_eq!(thumbnail.path, "path/to/thumbnail.jpg");
    assert!(domain_input.post_date.is_none());
    assert_eq!(domain_input.contents.len(), 0);
  }

  #[test]
  fn test_convert_blog_post_dto_with_post_date() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let dto = CreateBlogPostDTO {
      title: "日付指定記事".to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: Some(NaiveDate::from_ymd_opt(2024, 6, 15).unwrap()),
      contents: vec![],
    };

    let domain_input = convert_dto_to_domain_input(dto);

    assert_eq!(domain_input.title, "日付指定記事");
    
    let thumbnail = domain_input.thumbnail.unwrap();
    assert_eq!(thumbnail.id, thumbnail_id);
    assert_eq!(thumbnail.path, "path/to/thumbnail.jpg");
    
    assert_eq!(domain_input.post_date, Some(NaiveDate::from_ymd_opt(2024, 6, 15).unwrap()));
  }

  #[test]
  fn test_convert_all_content_types() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000000").unwrap();
    let h2_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let h3_id = Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap();
    let para_id = Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap();
    let img_id = Uuid::parse_str("00000000-0000-0000-0000-000000000004").unwrap();
    let code_id = Uuid::parse_str("00000000-0000-0000-0000-000000000005").unwrap();

    let dto = CreateBlogPostDTO {
      title: "複合記事".to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: None,
      contents: vec![
        CreateContentDTO::H2 {
          id: h2_id,
          text: "見出し2".to_string(),
        },
        CreateContentDTO::H3 {
          id: h3_id,
          text: "見出し3".to_string(),
        },
        CreateContentDTO::Paragraph {
          id: para_id,
          text: vec![CreateRichTextDTO {
            text: "段落テキスト".to_string(),
            styles: CreateStyleDTO {
              bold: false,
              inline_code: false,
            },
            link: None,
          }],
        },
        CreateContentDTO::Image {
          id: img_id,
          path: "path/to/image.jpg".to_string(),
        },
        CreateContentDTO::CodeBlock {
          id: code_id,
          title: "サンプルコード".to_string(),
          code: "println!(\"Hello, world!\");".to_string(),
          language: "rust".to_string(),
        },
      ],
    };

    let domain_input = convert_dto_to_domain_input(dto);

    assert_eq!(domain_input.contents.len(), 5);

    // 各コンテンツタイプの変換確認
    match &domain_input.contents[0] {
      CreateContentInput::H2 { id, text } => {
        assert_eq!(*id, h2_id);
        assert_eq!(text, "見出し2");
      }
      _ => panic!("期待されるコンテンツタイプはH2です"),
    }

    match &domain_input.contents[1] {
      CreateContentInput::H3 { id, text } => {
        assert_eq!(*id, h3_id);
        assert_eq!(text, "見出し3");
      }
      _ => panic!("期待されるコンテンツタイプはH3です"),
    }

    match &domain_input.contents[2] {
      CreateContentInput::Paragraph { id, text } => {
        assert_eq!(*id, para_id);
        assert_eq!(text.len(), 1);
        assert_eq!(text[0].text, "段落テキスト");
      }
      _ => panic!("期待されるコンテンツタイプはParagraphです"),
    }

    match &domain_input.contents[3] {
      CreateContentInput::Image { id, path } => {
        assert_eq!(*id, img_id);
        assert_eq!(path, "path/to/image.jpg");
      }
      _ => panic!("期待されるコンテンツタイプはImageです"),
    }

    match &domain_input.contents[4] {
      CreateContentInput::CodeBlock { id, title, code, language } => {
        assert_eq!(*id, code_id);
        assert_eq!(title, "サンプルコード");
        assert_eq!(code, "println!(\"Hello, world!\");");
        assert_eq!(language, "rust");
      }
      _ => panic!("期待されるコンテンツタイプはCodeBlockです"),
    }
  }

  #[test]
  fn test_convert_rich_text_with_styles_and_links() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000000").unwrap();
    let para_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();

    let dto = CreateBlogPostDTO {
      title: "リッチテキスト記事".to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: None,
      contents: vec![CreateContentDTO::Paragraph {
        id: para_id,
        text: vec![
          CreateRichTextDTO {
            text: "通常テキスト".to_string(),
            styles: CreateStyleDTO {
              bold: false,
              inline_code: false,
            },
            link: None,
          },
          CreateRichTextDTO {
            text: "太字テキスト".to_string(),
            styles: CreateStyleDTO {
              bold: true,
              inline_code: false,
            },
            link: None,
          },
          CreateRichTextDTO {
            text: "リンクテキスト".to_string(),
            styles: CreateStyleDTO {
              bold: false,
              inline_code: false,
            },
            link: Some(CreateLinkDTO {
              url: "https://example.com".to_string(),
            }),
          },
          CreateRichTextDTO {
            text: "インラインコード".to_string(),
            styles: CreateStyleDTO {
              bold: false,
              inline_code: true,
            },
            link: None,
          },
        ],
      }],
    };

    let domain_input = convert_dto_to_domain_input(dto);

    match &domain_input.contents[0] {
      CreateContentInput::Paragraph { text, .. } => {
        assert_eq!(text.len(), 4);

        // 通常テキスト
        assert_eq!(text[0].text, "通常テキスト");
        assert!(!text[0].styles.bold);
        assert!(!text[0].styles.inline_code);
        assert!(text[0].link.is_none());

        // 太字テキスト
        assert_eq!(text[1].text, "太字テキスト");
        assert!(text[1].styles.bold);
        assert!(!text[1].styles.inline_code);

        // リンクテキスト
        assert_eq!(text[2].text, "リンクテキスト");
        assert_eq!(text[2].link.as_ref().unwrap().url, "https://example.com");

        // インラインコード
        assert_eq!(text[3].text, "インラインコード");
        assert!(!text[3].styles.bold);
        assert!(text[3].styles.inline_code);
      }
      _ => panic!("期待されるコンテンツタイプはParagraphです"),
    }
  }

  #[test]
  fn test_convert_empty_contents() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let dto = CreateBlogPostDTO {
      title: "空の記事".to_string(),
      thumbnail: CreateImageDTO {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      },
      post_date: None,
      contents: vec![],
    };

    let domain_input = convert_dto_to_domain_input(dto);

    assert_eq!(domain_input.title, "空の記事");
    let thumbnail = domain_input.thumbnail.unwrap();
    assert_eq!(thumbnail.id, thumbnail_id);
    assert_eq!(thumbnail.path, "path/to/thumbnail.jpg");
    assert_eq!(domain_input.contents.len(), 0);
  }
}