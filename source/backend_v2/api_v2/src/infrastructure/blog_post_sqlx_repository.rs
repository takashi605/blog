mod tables;
mod converter;

use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use anyhow::{Result, Context};
use sqlx::PgPool;
use uuid::Uuid;

use tables::{BlogPostRecord, ImageRecord, PostContentRecord, AnyContentBlockRecord};
use converter::convert_to_blog_post_entity;

/// BlogPostRepositoryのSQLx実装
///
/// PostgreSQLデータベースとのやり取りを行い、
/// BlogPostEntityの永続化を担当する
pub struct BlogPostSqlxRepository {
  pool: PgPool,
}

impl BlogPostSqlxRepository {
  /// 新しいSqlxリポジトリを作成する
  ///
  /// # Arguments
  /// * `pool` - PostgreSQLコネクションプール
  pub fn new(pool: PgPool) -> Self {
    Self { pool }
  }

  /// コンテンツブロックの詳細を取得する
  async fn fetch_content_block_details(&self, content_record: &tables::PostContentRecord) -> Result<tables::AnyContentBlockRecord> {
    use tables::PostContentType;
    
    let content_type_enum = PostContentType::try_from(content_record.content_type.clone())
      .context("コンテントタイプの変換に失敗しました。")?;
    
    let result = match content_type_enum {
      PostContentType::Heading => {
        let heading_block = sqlx::query_as::<_, tables::HeadingBlockRecord>(
          "select id, heading_level, text_content from heading_blocks where id = $1"
        )
          .bind(content_record.id)
          .fetch_one(&self.pool)
          .await
          .context("見出しブロックの取得に失敗しました。")?;
        tables::AnyContentBlockRecord::HeadingBlockRecord(heading_block)
      }
      PostContentType::Image => {
        let image_block = sqlx::query_as::<_, tables::ImageBlockRecord>(
          "select id, image_id from image_blocks where id = $1"
        )
          .bind(content_record.id)
          .fetch_one(&self.pool)
          .await
          .context("画像ブロックの取得に失敗しました。")?;
        
        let image_record = sqlx::query_as::<_, tables::ImageRecord>(
          "select id, file_path from images where id = $1"
        )
          .bind(image_block.image_id)
          .fetch_one(&self.pool)
          .await
          .context("画像の取得に失敗しました。")?;
        
        tables::AnyContentBlockRecord::ImageBlockRecord(tables::ImageBlockRecordWithRelations {
          image_block_record: image_block,
          image_record,
        })
      }
      PostContentType::Paragraph => {
        let paragraph_block = sqlx::query_as::<_, tables::ParagraphBlockRecord>(
          "select id from paragraph_blocks where id = $1"
        )
          .bind(content_record.id)
          .fetch_one(&self.pool)
          .await
          .context("段落ブロックの取得に失敗しました。")?;
        
        let rich_text_records = self.fetch_rich_text_with_relations(paragraph_block.id)
          .await
          .context("リッチテキストの取得に失敗しました。")?;
        
        tables::AnyContentBlockRecord::ParagraphBlockRecord(tables::ParagraphBlockRecordWithRelations {
          paragraph_block,
          rich_text_records_with_relations: rich_text_records,
        })
      }
      PostContentType::CodeBlock => {
        let code_block = sqlx::query_as::<_, tables::CodeBlockRecord>(
          "select id, title, code, language from code_blocks where id = $1"
        )
          .bind(content_record.id)
          .fetch_one(&self.pool)
          .await
          .context("コードブロックの取得に失敗しました。")?;
        tables::AnyContentBlockRecord::CodeBlockRecord(code_block)
      }
    };
    
    Ok(result)
  }

  /// リッチテキストとその関連データを取得する
  async fn fetch_rich_text_with_relations(&self, paragraph_id: uuid::Uuid) -> Result<Vec<tables::RichTextRecordWithRelations>> {
    let rich_text_records = sqlx::query_as::<_, tables::RichTextRecord>(
      "select id, paragraph_block_id, text_content, sort_order from rich_texts where paragraph_block_id = $1 order by sort_order asc"
    )
      .bind(paragraph_id)
      .fetch_all(&self.pool)
      .await
      .context("リッチテキストレコードの取得に失敗しました。")?;

    let mut rich_text_with_relations = Vec::new();
    for rich_text in rich_text_records {
      let styles = sqlx::query_as::<_, tables::TextStyleRecord>(
        "select id, style_type from text_styles where id in (select style_id from rich_text_styles where rich_text_id = $1)"
      )
        .bind(rich_text.id)
        .fetch_all(&self.pool)
        .await
        .context("スタイルレコードの取得に失敗しました。")?;

      let link = sqlx::query_as::<_, tables::RichTextLinkRecord>(
        "select id, rich_text_id, url from rich_text_links where rich_text_id = $1"
      )
        .bind(rich_text.id)
        .fetch_optional(&self.pool)
        .await
        .context("リンクレコードの取得に失敗しました。")?;

      rich_text_with_relations.push(tables::RichTextRecordWithRelations {
        text_record: rich_text,
        style_records: styles,
        link_record: link,
      });
    }

    Ok(rich_text_with_relations)
  }
}

#[async_trait::async_trait]
impl BlogPostRepository for BlogPostSqlxRepository {
  async fn find(&self, id: &str) -> Result<BlogPostEntity> {
    // UUIDに変換
    let uuid = uuid::Uuid::parse_str(id)
      .context("無効なUUID形式です")?;

    // 記事の基本情報を取得
    let blog_post_record = sqlx::query_as::<_, tables::BlogPostRecord>(
      "select id, title, thumbnail_image_id, post_date, last_update_date from blog_posts where id = $1 and published_at < CURRENT_TIMESTAMP"
    )
      .bind(uuid)
      .fetch_one(&self.pool)
      .await
      .context("記事の取得に失敗しました")?;

    // サムネイル画像を取得
    let thumbnail_record = sqlx::query_as::<_, tables::ImageRecord>(
      "select id, file_path from images where id = $1"
    )
      .bind(blog_post_record.thumbnail_image_id)
      .fetch_one(&self.pool)
      .await
      .context("サムネイル画像の取得に失敗しました")?;

    // 記事コンテンツを取得
    let post_content_records = sqlx::query_as::<_, tables::PostContentRecord>(
      "select id, post_id, content_type, sort_order from post_contents where post_id = $1 order by sort_order asc"
    )
      .bind(uuid)
      .fetch_all(&self.pool)
      .await
      .context("記事コンテンツの取得に失敗しました")?;

    // 各コンテンツの詳細を取得
    let mut content_with_details = Vec::new();
    for content_record in post_content_records {
      let content_block = self.fetch_content_block_details(&content_record)
        .await
        .context("コンテンツブロックの取得に失敗しました")?;
      content_with_details.push((content_record, content_block));
    }

    // エンティティに変換
    let blog_post_entity = convert_to_blog_post_entity(
      blog_post_record,
      thumbnail_record,
      content_with_details,
    ).context("エンティティへの変換に失敗しました")?;

    Ok(blog_post_entity)
  }

  async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
    // TODO: SQLxでデータベースに記事を保存する実装
    todo!("saveメソッドの実装が必要です")
  }

  async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
    // TODO: SQLxで最新記事を取得する実装
    todo!("find_latestsメソッドの実装が必要です")
  }

  async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
    // TODO: SQLxでトップテックピック記事を取得する実装
    todo!("find_top_tech_pickメソッドの実装が必要です")
  }

  async fn reselect_top_tech_pick_post(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
    // TODO: SQLxでトップテックピック記事を更新する実装
    todo!("reselect_top_tech_pick_postメソッドの実装が必要です")
  }

  async fn find_pick_up_posts(&self, quantity: u32) -> Result<Vec<BlogPostEntity>> {
    // TODO: SQLxでピックアップ記事を取得する実装
    todo!("find_pick_up_postsメソッドの実装が必要です")
  }

  async fn reselect_pick_up_posts(&self, pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
    // TODO: SQLxでピックアップ記事を更新する実装
    todo!("reselect_pick_up_postsメソッドの実装が必要です")
  }

  async fn find_popular_posts(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
    // TODO: SQLxで人気記事を取得する実装
    todo!("find_popular_postsメソッドの実装が必要です")
  }

  async fn reselect_popular_posts(&self, popular_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
    // TODO: SQLxで人気記事を更新する実装
    todo!("reselect_popular_postsメソッドの実装が必要です")
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::content_entity::ContentEntity;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use uuid::Uuid;

  /// SQLxテスト用のセットアップ関数
  ///
  /// 注意: この関数は実際のテスト環境でのみ動作します
  ///
  async fn setup_test_pool() -> PgPool {
    // TODO: テスト用のデータベース接続プールを作成
    // 現在はコンパイルエラーを避けるため、パニックで対応
    panic!("テスト用データベース接続の設定が必要です")
  }

  /// テスト用のサンプルBlogPostEntityを作成する
  fn create_sample_blog_post() -> BlogPostEntity {
    let mut blog_post = BlogPostEntity::new(Uuid::new_v4(), "テスト記事".to_string());

    // H2コンテンツを追加
    let h2_content = ContentEntity::h2(Uuid::new_v4(), "テスト見出し".to_string());
    blog_post.add_content(h2_content);

    // サムネイル画像を設定
    blog_post.set_thumbnail(Uuid::new_v4(), "/images/test.jpg".to_string());

    blog_post
  }

  #[tokio::test]
  #[ignore] // データベース接続が必要なため、通常のテストではスキップ
  async fn test_find_blog_post_success() {
    // Arrange
    let pool = setup_test_pool().await;
    let repository = BlogPostSqlxRepository::new(pool);
    let sample_post = create_sample_blog_post();
    let test_id = sample_post.get_id().to_string();

    // TODO: テストデータをデータベースに事前挿入

    // Act
    let result = repository.find(&test_id).await;

    // Assert
    assert!(result.is_ok());
    let found_post = result.unwrap();
    assert_eq!(found_post.get_id(), sample_post.get_id());
    assert_eq!(found_post.get_title_text(), sample_post.get_title_text());
  }

  #[tokio::test]
  #[ignore] // データベース接続が必要なため、通常のテストではスキップ
  async fn test_find_blog_post_not_found() {
    // Arrange
    let pool = setup_test_pool().await;
    let repository = BlogPostSqlxRepository::new(pool);
    let non_existent_id = Uuid::new_v4().to_string();

    // Act
    let result = repository.find(&non_existent_id).await;

    // Assert
    assert!(result.is_err());
  }
}
