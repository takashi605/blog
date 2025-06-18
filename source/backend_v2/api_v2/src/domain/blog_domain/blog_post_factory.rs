use chrono::NaiveDate;
use uuid::Uuid;

use super::blog_post_entity::{
  content_entity::ContentEntity,
  rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO},
  BlogPostEntity,
};

// ファクトリの入力用構造体（APIレスポンス型を参考にドメイン層独自に定義）

#[derive(Debug, Clone)]
pub struct CreateBlogPostInput {
  pub title: String,
  pub thumbnail: Option<CreateImageInput>,
  pub post_date: Option<NaiveDate>,
  pub last_update_date: Option<NaiveDate>,
  pub contents: Vec<CreateContentInput>,
}

#[derive(Debug, Clone)]
pub struct CreateImageInput {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug, Clone)]
pub enum CreateContentInput {
  H2 { id: Uuid, text: String },
  H3 { id: Uuid, text: String },
  Paragraph { id: Uuid, text: Vec<CreateRichTextInput> },
  Image { id: Uuid, path: String },
  CodeBlock { id: Uuid, title: String, code: String, language: String },
}

#[derive(Debug, Clone)]
pub struct CreateRichTextInput {
  pub text: String,
  pub styles: CreateStyleInput,
  pub link: Option<CreateLinkInput>,
}

#[derive(Debug, Clone)]
pub struct CreateStyleInput {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Debug, Clone)]
pub struct CreateLinkInput {
  pub url: String,
}

// BlogPostFactory 構造体

pub struct BlogPostFactory;

impl BlogPostFactory {
  pub fn create(input: CreateBlogPostInput) -> BlogPostEntity {
    // 新しいIDを生成
    let post_id = Uuid::new_v4();

    // BlogPostEntityを作成
    let mut blog_post = BlogPostEntity::new(post_id, input.title);

    // 投稿日を設定（指定があれば設定、なければデフォルトの現在日付）
    if let Some(post_date) = input.post_date {
      blog_post.set_post_date(post_date);
    }

    // 最終更新日を設定（指定があれば設定、なければpost_dateと同じ値）
    if let Some(last_update_date) = input.last_update_date {
      blog_post.set_last_update_date(last_update_date);
    } else if let Some(post_date) = input.post_date {
      blog_post.set_last_update_date(post_date);
    }

    // サムネイルを設定
    if let Some(thumbnail_input) = input.thumbnail {
      blog_post.set_thumbnail(thumbnail_input.id, thumbnail_input.path);
    }

    // コンテンツを変換して追加
    for content_input in input.contents {
      let content_entity = Self::convert_content(content_input);
      blog_post.add_content(content_entity);
    }

    blog_post
  }

  fn convert_content(input: CreateContentInput) -> ContentEntity {
    match input {
      CreateContentInput::H2 { id, text } => ContentEntity::h2(id, text),
      CreateContentInput::H3 { id, text } => ContentEntity::h3(id, text),
      CreateContentInput::Paragraph { id, text } => {
        let rich_text_parts: Vec<RichTextPartVO> = text.into_iter().map(Self::convert_rich_text).collect();
        let rich_text = RichTextVO::new(rich_text_parts);
        ContentEntity::paragraph(id, rich_text)
      }
      CreateContentInput::Image { id, path } => ContentEntity::image(id, path),
      CreateContentInput::CodeBlock { id, title, code, language } => ContentEntity::code_block(id, title, code, language),
    }
  }

  fn convert_rich_text(input: CreateRichTextInput) -> RichTextPartVO {
    let link_vo = input.link.map(|link| LinkVO { url: link.url });

    // スタイル情報を持つ場合とそうでない場合を判別
    let style_vo = if input.styles.bold || input.styles.inline_code {
      Some(RichTextStylesVO {
        bold: input.styles.bold,
        inline_code: input.styles.inline_code,
      })
    } else {
      None
    };

    RichTextPartVO::new(input.text, style_vo, link_vo)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::Local;

  #[test]
  fn 基本的な記事作成() {
    let input = CreateBlogPostInput {
      title: "テスト記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let blog_post = BlogPostFactory::create(input);

    assert_eq!(blog_post.get_title_text(), "テスト記事");
    assert!(blog_post.get_thumbnail().is_none());
    assert_eq!(blog_post.get_contents().len(), 0);
    assert_eq!(blog_post.get_post_date(), Local::now().date_naive());
  }

  #[test]
  fn サムネイル付き記事作成() {
    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let input = CreateBlogPostInput {
      title: "サムネイル付き記事".to_string(),
      thumbnail: Some(CreateImageInput {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      }),
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let blog_post = BlogPostFactory::create(input);

    let thumbnail = blog_post.get_thumbnail().unwrap();
    assert_eq!(thumbnail.get_id(), thumbnail_id);
    assert_eq!(thumbnail.get_path(), "path/to/thumbnail.jpg");
  }

  #[test]
  fn 複数コンテンツタイプを含む記事作成() {
    let h2_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let h3_id = Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap();
    let para_id = Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap();
    let img_id = Uuid::parse_str("00000000-0000-0000-0000-000000000004").unwrap();
    let code_id = Uuid::parse_str("00000000-0000-0000-0000-000000000005").unwrap();

    let input = CreateBlogPostInput {
      title: "複合記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![
        CreateContentInput::H2 {
          id: h2_id,
          text: "見出し2".to_string(),
        },
        CreateContentInput::H3 {
          id: h3_id,
          text: "見出し3".to_string(),
        },
        CreateContentInput::Paragraph {
          id: para_id,
          text: vec![CreateRichTextInput {
            text: "段落テキスト".to_string(),
            styles: CreateStyleInput {
              bold: false,
              inline_code: false,
            },
            link: None,
          }],
        },
        CreateContentInput::Image {
          id: img_id,
          path: "path/to/image.jpg".to_string(),
        },
        CreateContentInput::CodeBlock {
          id: code_id,
          title: "サンプルコード".to_string(),
          code: "println!(\"Hello, world!\");".to_string(),
          language: "rust".to_string(),
        },
      ],
    };

    let blog_post = BlogPostFactory::create(input);

    assert_eq!(blog_post.get_contents().len(), 5);

    // 各コンテンツタイプの確認
    let contents = blog_post.get_contents();

    match &contents[0] {
      ContentEntity::H2(h2) => assert_eq!(h2.get_value(), "見出し2"),
      _ => panic!("最初のコンテンツはH2である必要があります"),
    }

    match &contents[1] {
      ContentEntity::H3(h3) => assert_eq!(h3.get_value(), "見出し3"),
      _ => panic!("2番目のコンテンツはH3である必要があります"),
    }

    match &contents[2] {
      ContentEntity::Paragraph(_) => {}
      _ => panic!("3番目のコンテンツはParagraphである必要があります"),
    }

    match &contents[3] {
      ContentEntity::Image(_) => {}
      _ => panic!("4番目のコンテンツはImageである必要があります"),
    }

    match &contents[4] {
      ContentEntity::CodeBlock(_) => {}
      _ => panic!("5番目のコンテンツはCodeBlockである必要があります"),
    }
  }

  #[test]
  fn 日付指定ありの記事作成() {
    use chrono::NaiveDate;

    let specified_date = NaiveDate::from_ymd_opt(2024, 6, 15).unwrap();
    let input = CreateBlogPostInput {
      title: "日付指定記事".to_string(),
      thumbnail: None,
      post_date: Some(specified_date),
      last_update_date: Some(specified_date),
      contents: vec![],
    };

    let blog_post = BlogPostFactory::create(input);

    assert_eq!(blog_post.get_post_date(), specified_date);
  }

  #[test]
  fn リッチテキスト変換の正確性() {
    let para_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();

    let input = CreateBlogPostInput {
      title: "リッチテキスト記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![CreateContentInput::Paragraph {
        id: para_id,
        text: vec![
          CreateRichTextInput {
            text: "通常テキスト".to_string(),
            styles: CreateStyleInput {
              bold: false,
              inline_code: false,
            },
            link: None,
          },
          CreateRichTextInput {
            text: "太字テキスト".to_string(),
            styles: CreateStyleInput {
              bold: true,
              inline_code: false,
            },
            link: None,
          },
          CreateRichTextInput {
            text: "リンクテキスト".to_string(),
            styles: CreateStyleInput {
              bold: false,
              inline_code: false,
            },
            link: Some(CreateLinkInput {
              url: "https://example.com".to_string(),
            }),
          },
          CreateRichTextInput {
            text: "インラインコード".to_string(),
            styles: CreateStyleInput {
              bold: false,
              inline_code: true,
            },
            link: None,
          },
        ],
      }],
    };

    let blog_post = BlogPostFactory::create(input);

    let contents = blog_post.get_contents();
    match &contents[0] {
      ContentEntity::Paragraph(para) => {
        let rich_text = para.get_value();
        let parts = rich_text.get_text();

        assert_eq!(parts.len(), 4);

        // 通常テキスト
        assert_eq!(parts[0].get_text(), "通常テキスト");
        assert!(!parts[0].get_styles().bold);
        assert!(!parts[0].get_styles().inline_code);
        assert!(parts[0].get_link().is_none());

        // 太字テキスト
        assert_eq!(parts[1].get_text(), "太字テキスト");
        assert!(parts[1].get_styles().bold);
        assert!(!parts[1].get_styles().inline_code);

        // リンクテキスト
        assert_eq!(parts[2].get_text(), "リンクテキスト");
        assert_eq!(parts[2].get_link().unwrap().url, "https://example.com");

        // インラインコード
        assert_eq!(parts[3].get_text(), "インラインコード");
        assert!(!parts[3].get_styles().bold);
        assert!(parts[3].get_styles().inline_code);
      }
      _ => panic!("コンテンツはParagraphである必要があります"),
    }
  }

  #[test]
  fn エッジケース_空コンテンツ() {
    let input = CreateBlogPostInput {
      title: "空の記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let blog_post = BlogPostFactory::create(input);

    assert_eq!(blog_post.get_contents().len(), 0);
    assert_eq!(blog_post.get_title_text(), "空の記事");
  }

  #[test]
  fn ファクトリがユニークなIDを自動生成する() {
    let input1 = CreateBlogPostInput {
      title: "記事1".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let input2 = CreateBlogPostInput {
      title: "記事2".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    let blog_post1 = BlogPostFactory::create(input1);
    let blog_post2 = BlogPostFactory::create(input2);

    // 各記事が異なるIDを持つことを確認（重要なビジネスロジック）
    assert_ne!(blog_post1.get_id(), blog_post2.get_id());

    // IDがnilでないことを確認
    assert_ne!(blog_post1.get_id(), Uuid::nil());
    assert_ne!(blog_post2.get_id(), Uuid::nil());

    // IDがバージョン4 UUID（ランダム生成）であることを確認
    assert_eq!(blog_post1.get_id().get_version_num(), 4);
    assert_eq!(blog_post2.get_id().get_version_num(), 4);
  }

  #[test]
  fn 複数回実行しても毎回異なるIDが生成される() {
    let input = CreateBlogPostInput {
      title: "テスト記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      contents: vec![],
    };

    // 同じ入力で10回記事を生成
    let mut generated_ids = std::collections::HashSet::new();
    for _ in 0..10 {
      let blog_post = BlogPostFactory::create(CreateBlogPostInput {
        title: input.title.clone(),
        thumbnail: input.thumbnail.clone(),
        post_date: input.post_date,
        last_update_date: input.last_update_date,
        contents: input.contents.clone(),
      });

      // 重複するIDが生成されないことを確認
      assert!(generated_ids.insert(blog_post.get_id()), "重複したIDが生成されました: {}", blog_post.get_id());
    }

    // 10個の異なるIDが生成されたことを確認
    assert_eq!(generated_ids.len(), 10);
  }
}
