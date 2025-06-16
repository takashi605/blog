use std::sync::Arc;

use crate::application::dto::{ViewBlogPostContentDTO, ViewBlogPostDTO};
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;

pub struct ViewBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl ViewBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, id: &str) -> anyhow::Result<ViewBlogPostDTO> {
    // リポジトリから記事を取得
    let blog_post = self.repository.find(id).await?;

    // BlogPostEntityからViewBlogPostDTOに変換
    let dto = self.convert_to_dto(blog_post);

    Ok(dto)
  }

  fn convert_to_dto(&self, blog_post: BlogPostEntity) -> ViewBlogPostDTO {
    ViewBlogPostDTO {
      id: blog_post.get_id().to_string(),
      title: blog_post.get_title_text().to_string(),
      content: ViewBlogPostContentDTO {
        paragraphs: vec![], // TODO: コンテンツ変換は将来実装
      },
      published_date: chrono::Utc::now(), // TODO: 実際の投稿日時を使用
      is_public: true,                    // TODO: 実際の公開状態を使用
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::{blog_domain::blog_post_repository::BlogPostRepository, image_domain::ImageEntity};
  use anyhow::Result;
  use async_trait::async_trait;
  use std::sync::Arc;
  use uuid::Uuid;

  // モックリポジトリ
  struct MockBlogPostRepository {
    expected_id: Uuid,
    expected_title: String,
  }

  impl MockBlogPostRepository {
    fn new_with_post_data(id: Uuid, title: String) -> Self {
      Self {
        expected_id: id,
        expected_title: title,
      }
    }
  }

  #[async_trait]
  impl BlogPostRepository for MockBlogPostRepository {
    async fn find(&self, _id: &str) -> Result<BlogPostEntity> {
      let post = BlogPostEntity::new(self.expected_id, self.expected_title.clone());
      Ok(post)
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn reselect_top_tech_pick_post(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
      todo!()
    }

    async fn find_pick_up_posts(&self, _quantity: u32) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn reselect_pick_up_posts(&self, _pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn find_popular_posts(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }

    async fn reselect_popular_posts(&self, _popular_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
      todo!()
    }
  }

  #[tokio::test]
  async fn test_記事閲覧用データをリポジトリから取得する() {
    // Arrange
    let test_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let _expected_post = BlogPostEntity::new(test_id, "テストタイトル".to_string());

    let mock_repository = Arc::new(MockBlogPostRepository::new_with_post_data(test_id, "テストタイトル".to_string()));
    let usecase = ViewBlogPostUseCase::new(mock_repository);

    // Act
    let result = usecase.execute("test-id").await;

    // Assert
    assert!(result.is_ok());
    let dto = result.unwrap();
    assert_eq!(dto.title, "テストタイトル");
    // DTOの詳細な検証は実装後に追加
  }

  #[test]
  fn test_convert_to_dto_全てのコンテンツタイプを正しく変換する() {
    use crate::domain::blog_domain::blog_post_entity::{
      BlogPostContentBlockEntity, CodeBlockEntity, H2BlockEntity, H3BlockEntity, ImageBlockEntity, ParagraphBlockEntity, RichTextLinkVO, RichTextPartVO,
      RichTextStyleVO, RichTextVO,
    };
    use chrono::NaiveDate;

    // Arrange
    let usecase = ViewBlogPostUseCase::new(Arc::new(MockBlogPostRepository::new_with_post_data(Uuid::new_v4(), "テスト".to_string())));

    // 複雑なコンテンツを含むBlogPostEntityを作成
    let blog_post_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440001").unwrap();
    let thumbnail_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440002").unwrap();
    let post_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
    let last_update_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();

    // RichTextVOの作成（スタイルとリンク付き）
    let rich_text = RichTextVO::new(vec![
      RichTextPartVO::new("通常のテキストと".to_string(), vec![], None),
      RichTextPartVO::new("太字テキスト".to_string(), vec![RichTextStyleVO::Bold], None),
      RichTextPartVO::new("と".to_string(), vec![], None),
      RichTextPartVO::new(
        "リンク付きテキスト".to_string(),
        vec![],
        Some(RichTextLinkVO::new("https://example.com".to_string())),
      ),
      RichTextPartVO::new("と".to_string(), vec![], None),
      RichTextPartVO::new("インラインコード".to_string(), vec![RichTextStyleVO::InlineCode], None),
    ]);

    // 各種コンテンツブロックを作成
    let contents = vec![
      BlogPostContentBlockEntity::H2(H2BlockEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440003").unwrap(),
        "見出し2".to_string(),
      )),
      BlogPostContentBlockEntity::H3(H3BlockEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440004").unwrap(),
        "見出し3".to_string(),
      )),
      BlogPostContentBlockEntity::Paragraph(ParagraphBlockEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440005").unwrap(),
        rich_text,
      )),
      BlogPostContentBlockEntity::Image(ImageBlockEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440006").unwrap(),
        "https://example.com/image.jpg".to_string(),
      )),
      BlogPostContentBlockEntity::Code(CodeBlockEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440007").unwrap(),
        "サンプルコード".to_string(),
        "fn main() { println!(\"Hello\"); }".to_string(),
        "rust".to_string(),
      )),
    ];

    let mut blog_post = BlogPostEntity::new(blog_post_id, "テストブログ記事".to_string());
    blog_post.set_thumbnail(thumbnail_id, "test/image/path".to_string());
    blog_post.set_post_date(post_date);
    blog_post.set_last_update_date(last_update_date);
    blog_post.add_content(contents[0].clone());
    blog_post.add_content(contents[1].clone());
    blog_post.add_content(contents[2].clone());
    blog_post.add_content(contents[3].clone());

    // Act
    let dto = usecase.convert_to_dto(blog_post);

    // Assert
    // 基本情報の検証
    assert_eq!(dto.id, "550e8400-e29b-41d4-a716-446655440001");
    assert_eq!(dto.title, "テストブログ記事");
    assert_eq!(dto.thumbnail.id, "550e8400-e29b-41d4-a716-446655440002");
    assert_eq!(dto.thumbnail.path, "test/image/path");
    assert_eq!(dto.post_date, post_date);
    assert_eq!(dto.last_update_date, last_update_date);

    // コンテンツの検証
    assert_eq!(dto.contents.len(), 5);

    // H2ブロックの検証
    match &dto.contents[0] {
      BlogPostContent::H2(h2) => {
        assert_eq!(h2.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440003").unwrap());
        assert_eq!(h2.text, "見出し2");
      }
      _ => panic!("Expected H2 block"),
    }

    // H3ブロックの検証
    match &dto.contents[1] {
      BlogPostContent::H3(h3) => {
        assert_eq!(h3.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440004").unwrap());
        assert_eq!(h3.text, "見出し3");
      }
      _ => panic!("Expected H3 block"),
    }

    // Paragraphブロックの検証
    match &dto.contents[2] {
      BlogPostContent::Paragraph(para) => {
        assert_eq!(para.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440005").unwrap());
        assert_eq!(para.text.len(), 6); // 6つのRichTextパート

        // 通常テキスト
        assert_eq!(para.text[0].text, "通常のテキストと");
        assert!(!para.text[0].styles.bold);
        assert!(!para.text[0].styles.inline_code);
        assert!(para.text[0].link.is_none());

        // 太字テキスト
        assert_eq!(para.text[1].text, "太字テキスト");
        assert!(para.text[1].styles.bold);
        assert!(!para.text[1].styles.inline_code);
        assert!(para.text[1].link.is_none());

        // 通常テキスト
        assert_eq!(para.text[2].text, "と");
        assert!(!para.text[2].styles.bold);
        assert!(!para.text[2].styles.inline_code);
        assert!(para.text[2].link.is_none());

        // リンク付きテキスト
        assert_eq!(para.text[3].text, "リンク付きテキスト");
        assert!(!para.text[3].styles.bold);
        assert!(!para.text[3].styles.inline_code);
        assert!(para.text[3].link.is_some());
        assert_eq!(para.text[3].link.as_ref().unwrap().url, "https://example.com");

        // 通常テキスト
        assert_eq!(para.text[4].text, "と");
        assert!(!para.text[4].styles.bold);
        assert!(!para.text[4].styles.inline_code);
        assert!(para.text[4].link.is_none());

        // インラインコード
        assert_eq!(para.text[5].text, "インラインコード");
        assert!(!para.text[5].styles.bold);
        assert!(para.text[5].styles.inline_code);
        assert!(para.text[5].link.is_none());
      }
      _ => panic!("Expected Paragraph block"),
    }

    // Imageブロックの検証
    match &dto.contents[3] {
      BlogPostContent::Image(img) => {
        assert_eq!(img.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440006").unwrap());
        assert_eq!(img.path, "https://example.com/image.jpg");
      }
      _ => panic!("Expected Image block"),
    }

    // CodeBlockの検証
    match &dto.contents[4] {
      BlogPostContent::Code(code) => {
        assert_eq!(code.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440007").unwrap());
        assert_eq!(code.title, "サンプルコード");
        assert_eq!(code.code, "fn main() { println!(\"Hello\"); }");
        assert_eq!(code.language, "rust");
      }
      _ => panic!("Expected Code block"),
    }
  }
}
