use std::sync::Arc;
use uuid::Uuid;

use super::{
  blog_post_entity::{
    content_entity::ContentEntity,
    rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO},
    BlogPostEntity,
  },
  image_content_factory::{ImageContentFactory, ImageContentFactoryError},
  jst_date_vo::JstDate,
};

// ファクトリの入力用構造体（APIレスポンス型を参考にドメイン層独自に定義）

#[derive(Debug)]
pub struct CreateBlogPostInput {
  pub title: String,
  pub thumbnail: Option<CreateImageInput>,
  pub post_date: Option<JstDate>,
  pub last_update_date: Option<JstDate>,
  pub published_date: Option<JstDate>,
  pub contents: Vec<CreateContentInput>,
}

#[derive(Debug)]
pub struct CreateImageInput {
  pub id: Uuid,
  pub path: String,
}

#[derive(Debug)]
pub enum CreateContentInput {
  H2 { id: Uuid, text: String },
  H3 { id: Uuid, text: String },
  Paragraph { id: Uuid, text: Vec<CreateRichTextInput> },
  Image { id: Uuid, path: String },
  CodeBlock { id: Uuid, title: String, code: String, language: String },
}

#[derive(Debug)]
pub struct CreateRichTextInput {
  pub text: String,
  pub styles: CreateStyleInput,
  pub link: Option<CreateLinkInput>,
}

#[derive(Debug)]
pub struct CreateStyleInput {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Debug)]
pub struct CreateLinkInput {
  pub url: String,
}

// BlogPostFactory 構造体

#[derive(Debug, PartialEq)]
pub enum BlogPostFactoryError {
  ImageContentCreationFailed(String),
}

impl std::fmt::Display for BlogPostFactoryError {
  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
    match self {
      BlogPostFactoryError::ImageContentCreationFailed(msg) => write!(f, "Image content creation failed: {}", msg),
    }
  }
}

impl std::error::Error for BlogPostFactoryError {}

impl From<ImageContentFactoryError> for BlogPostFactoryError {
  fn from(error: ImageContentFactoryError) -> Self {
    BlogPostFactoryError::ImageContentCreationFailed(format!("Image content creation failed: {:?}", error))
  }
}

pub struct BlogPostFactory {
  image_content_factory: Arc<ImageContentFactory>,
}

impl BlogPostFactory {
  pub fn new(image_content_factory: Arc<ImageContentFactory>) -> Self {
    Self { image_content_factory }
  }

  pub async fn create(&self, input: CreateBlogPostInput) -> Result<BlogPostEntity, BlogPostFactoryError> {
    // 新しいIDを生成
    let post_id = Uuid::new_v4();

    // BlogPostEntityを作成
    let mut blog_post = BlogPostEntity::new(post_id, input.title);

    // 投稿日を設定（指定があれば設定、なければデフォルトの現在日付）
    if let Some(ref post_date) = input.post_date {
      blog_post.set_post_date(post_date.clone());
    }

    // 最終更新日を設定（指定があれば設定、なければpost_dateと同じ値）
    if let Some(last_update_date) = input.last_update_date {
      blog_post.set_last_update_date(last_update_date);
    } else if let Some(ref post_date) = input.post_date {
      blog_post.set_last_update_date(post_date.clone());
    }

    // 公開日を設定（指定があれば設定、なければデフォルトの今日の日付）
    if let Some(published_date) = input.published_date {
      blog_post.set_published_date(published_date);
    }

    // サムネイルを設定
    if let Some(thumbnail_input) = input.thumbnail {
      blog_post.set_thumbnail(thumbnail_input.id, thumbnail_input.path);
    }

    // コンテンツを変換して追加
    for content_input in input.contents {
      let content_entity = self.convert_content(content_input).await?;
      blog_post.add_content(content_entity);
    }

    Ok(blog_post)
  }

  async fn convert_content(&self, input: CreateContentInput) -> Result<ContentEntity, BlogPostFactoryError> {
    match input {
      CreateContentInput::H2 { id, text } => Ok(ContentEntity::h2(id, text)),
      CreateContentInput::H3 { id, text } => Ok(ContentEntity::h3(id, text)),
      CreateContentInput::Paragraph { id, text } => {
        let rich_text_parts: Vec<RichTextPartVO> = text.into_iter().map(Self::convert_rich_text).collect();
        let rich_text = RichTextVO::new(rich_text_parts);
        Ok(ContentEntity::paragraph(id, rich_text))
      }
      CreateContentInput::Image { id: _unused_id, path } => {
        // pathを使ってImageContentFactoryから適切なエンティティを作成
        let image_content = self.image_content_factory.create(path).await?;
        Ok(ContentEntity::image_from_entity(image_content))
      }
      CreateContentInput::CodeBlock { id, title, code, language } => Ok(ContentEntity::code_block(id, title, code, language)),
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
  use crate::domain::image_domain::{image_entity::ImageEntity, image_repository::ImageRepository, image_repository::ImageRepositoryError};
  use async_trait::async_trait;
  use std::collections::HashMap;
  use std::sync::Arc;

  // テスト用のモックリポジトリ
  pub struct MockImageRepository {
    images: HashMap<String, ImageEntity>,
  }

  impl MockImageRepository {
    pub fn new() -> Self {
      Self { images: HashMap::new() }
    }

    pub fn add_image(&mut self, path: String, image: ImageEntity) {
      self.images.insert(path, image);
    }
  }

  #[async_trait]
  impl ImageRepository for MockImageRepository {
    async fn find(&self, _id: &str) -> Result<ImageEntity, ImageRepositoryError> {
      Err(ImageRepositoryError::FindFailed("not implemented".to_string()))
    }

    async fn find_by_path(&self, path: &str) -> Result<ImageEntity, ImageRepositoryError> {
      match self.images.get(path) {
        Some(image) => Ok(ImageEntity::new(image.get_id(), image.get_path().to_string())),
        None => Err(ImageRepositoryError::FindByPathFailed(format!("Image not found for path: {}", path))),
      }
    }

    async fn save(&self, _image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
      Err(ImageRepositoryError::SaveFailed("not implemented".to_string()))
    }

    async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
      Err(ImageRepositoryError::FindAllFailed("not implemented".to_string()))
    }
  }

  #[tokio::test]
  async fn basic_blog_post_creation() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let input = CreateBlogPostInput {
      title: "テスト記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    assert_eq!(blog_post.get_title_text(), "テスト記事");
    assert!(blog_post.get_thumbnail().is_none());
    assert_eq!(blog_post.get_contents().len(), 0);
    assert_eq!(blog_post.get_post_date(), &JstDate::today());
  }

  #[tokio::test]
  async fn blog_post_creation_with_thumbnail() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let thumbnail_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let input = CreateBlogPostInput {
      title: "サムネイル付き記事".to_string(),
      thumbnail: Some(CreateImageInput {
        id: thumbnail_id,
        path: "path/to/thumbnail.jpg".to_string(),
      }),
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    let thumbnail = blog_post.get_thumbnail().unwrap();
    assert_eq!(thumbnail.get_id(), thumbnail_id);
    assert_eq!(thumbnail.get_path(), "path/to/thumbnail.jpg");
  }

  #[tokio::test]
  async fn blog_post_creation_with_multiple_content_types() {
    let mut mock_repo = MockImageRepository::new();
    let image_entity_id = Uuid::new_v4();
    let image_path = "path/to/image.jpg".to_string();
    let image_entity = ImageEntity::new(image_entity_id, image_path.clone());
    mock_repo.add_image(image_path.clone(), image_entity);

    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

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
      published_date: None,
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
        CreateContentInput::Image { id: img_id, path: image_path },
        CreateContentInput::CodeBlock {
          id: code_id,
          title: "サンプルコード".to_string(),
          code: "println!(\"Hello, world!\");".to_string(),
          language: "rust".to_string(),
        },
      ],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

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

  #[tokio::test]
  async fn blog_post_creation_with_specified_dates() {
    use chrono::NaiveDate;

    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let specified_date = NaiveDate::from_ymd_opt(2024, 6, 15).unwrap();
    let input = CreateBlogPostInput {
      title: "日付指定記事".to_string(),
      thumbnail: None,
      post_date: Some(JstDate::from_naive_date(specified_date)),
      last_update_date: Some(JstDate::from_naive_date(specified_date)),
      published_date: None,
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    assert_eq!(blog_post.get_post_date(), &JstDate::from_naive_date(specified_date));
  }

  #[tokio::test]
  async fn rich_text_conversion_accuracy() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let para_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();

    let input = CreateBlogPostInput {
      title: "リッチテキスト記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
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

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

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

  #[tokio::test]
  async fn edge_case_empty_content() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let input = CreateBlogPostInput {
      title: "空の記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    assert_eq!(blog_post.get_contents().len(), 0);
    assert_eq!(blog_post.get_title_text(), "空の記事");
  }

  #[tokio::test]
  async fn factory_generates_unique_ids_automatically() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let input1 = CreateBlogPostInput {
      title: "記事1".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let input2 = CreateBlogPostInput {
      title: "記事2".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let result1 = factory.create(input1).await;
    let result2 = factory.create(input2).await;

    assert!(result1.is_ok());
    assert!(result2.is_ok());

    let blog_post1 = result1.unwrap();
    let blog_post2 = result2.unwrap();

    // 各記事が異なるIDを持つことを確認（重要なビジネスロジック）
    assert_ne!(blog_post1.get_id(), blog_post2.get_id());

    // IDがnilでないことを確認
    assert_ne!(blog_post1.get_id(), Uuid::nil());
    assert_ne!(blog_post2.get_id(), Uuid::nil());

    // IDがバージョン4 UUID（ランダム生成）であることを確認
    assert_eq!(blog_post1.get_id().get_version_num(), 4);
    assert_eq!(blog_post2.get_id().get_version_num(), 4);
  }

  #[tokio::test]
  async fn multiple_executions_generate_different_ids_each_time() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    // 同じ入力で10回記事を生成
    let mut generated_ids = std::collections::HashSet::new();
    for _ in 0..10 {
      let result = factory
        .create(CreateBlogPostInput {
          title: "テスト記事".to_string(),
          thumbnail: None,
          post_date: None,
          last_update_date: None,
          published_date: None,
          contents: vec![],
        })
        .await;

      assert!(result.is_ok());
      let blog_post = result.unwrap();

      // 重複するIDが生成されないことを確認
      assert!(generated_ids.insert(blog_post.get_id()), "重複したIDが生成されました: {}", blog_post.get_id());
    }

    // 10個の異なるIDが生成されたことを確認
    assert_eq!(generated_ids.len(), 10);
  }

  #[tokio::test]
  async fn blog_post_creation_with_specified_published_date() {
    use chrono::NaiveDate;

    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let specified_published_date = NaiveDate::from_ymd_opt(2024, 7, 20).unwrap();
    let input = CreateBlogPostInput {
      title: "公開日指定記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: Some(JstDate::from_naive_date(specified_published_date)),
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    assert_eq!(blog_post.get_published_date(), &JstDate::from_naive_date(specified_published_date));
    assert_eq!(blog_post.get_title_text(), "公開日指定記事");
  }

  #[tokio::test]
  async fn blog_post_creation_without_published_date_uses_default() {
    let mock_repo = MockImageRepository::new();
    let image_factory = Arc::new(ImageContentFactory::new(Arc::new(mock_repo)));
    let factory = BlogPostFactory::new(image_factory);

    let input = CreateBlogPostInput {
      title: "デフォルト公開日記事".to_string(),
      thumbnail: None,
      post_date: None,
      last_update_date: None,
      published_date: None,
      contents: vec![],
    };

    let result = factory.create(input).await;

    assert!(result.is_ok());
    let blog_post = result.unwrap();

    // デフォルトでは今日の日付が設定される
    assert_eq!(blog_post.get_published_date(), &JstDate::today());
    assert_eq!(blog_post.get_title_text(), "デフォルト公開日記事");
  }
}
