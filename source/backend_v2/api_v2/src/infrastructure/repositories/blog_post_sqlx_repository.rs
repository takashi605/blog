pub mod domain_data_mapper;
pub mod record_mapper;
pub mod tables;

// 公開する必要のある型をre-export
pub use domain_data_mapper::*;
pub use record_mapper::*;
pub use tables::*;

use anyhow::{Context, Result};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
  domain::{
    blog_domain::{blog_post_entity::BlogPostEntity, blog_post_repository::BlogPostRepository, popular_post_set_entity::PopularPostSetEntity},
    image_domain::image_repository::ImageRepository,
  },
  infrastructure::repositories::{
    blog_post_sqlx_repository::blog_posts_table::{fetch_blog_post_by_id, fetch_latest_blog_posts_records_with_limit},
    image_sqlx_repository::convert_from_image_entity,
  },
};

use self::tables::{
  blog_posts_table::insert_blog_post_with_published_at,
  code_blocks_table::insert_code_block,
  heading_blocks_table::insert_heading_block,
  image_blocks_table::insert_image_block,
  paragraph_blocks_table::{insert_paragraph_block, insert_rich_text, insert_rich_text_link, insert_rich_text_style, insert_text_style_if_not_exists},
  post_contents_table::{fetch_any_content_block, fetch_post_contents_by_post_id, insert_blog_post_content},
};

/// SQLxを使用したBlogPostRepositoryの実装
pub struct BlogPostSqlxRepository<I: ImageRepository> {
  pool: PgPool,
  image_repository: I,
}

impl<I: ImageRepository> BlogPostSqlxRepository<I> {
  /// 新しいBlogPostSqlxRepositoryインスタンスを作成する
  pub fn new(pool: PgPool, image_repository: I) -> Self {
    Self { pool, image_repository }
  }
}

#[async_trait::async_trait]
impl<I: ImageRepository + Send + Sync> BlogPostRepository for BlogPostSqlxRepository<I> {
  async fn find(&self, id: &str) -> Result<BlogPostEntity> {
    let post_id = Uuid::parse_str(id).context("無効なUUID形式のIDです")?;

    // ブログ記事のメイン情報を取得
    let blog_post_record = match fetch_blog_post_by_id(&self.pool, post_id).await {
      Ok(record) => record,
      Err(err) => {
        // SQLx の RowNotFound エラーを特定してカスタムエラーに変換
        if let Some(sqlx_err) = err.downcast_ref::<sqlx::Error>() {
          if matches!(sqlx_err, sqlx::Error::RowNotFound) {
            return Err(anyhow::anyhow!("BlogPostNotFound:{}", id));
          }
        }
        return Err(err.context("ブログ記事の取得に失敗しました"));
      }
    };

    // サムネイル画像を取得
    let thumbnail_entity = self
      .image_repository
      .find(&blog_post_record.thumbnail_image_id.to_string())
      .await
      .map_err(|e| anyhow::anyhow!("サムネイル画像の取得に失敗しました: {:?}", e))?;

    // ImageEntityをImageRecordに変換（既存のconvert_to_blog_post_entity関数と互換性を保つため）
    let thumbnail_record = convert_from_image_entity(&thumbnail_entity);

    // コンテンツ一覧を取得
    let post_content_records = fetch_post_contents_by_post_id(&self.pool, post_id).await.context("コンテンツ一覧の取得に失敗しました")?;

    // 各コンテンツの詳細を取得
    let mut content_blocks = Vec::new();
    for post_content_record in post_content_records {
      let content_block = fetch_any_content_block(&self.pool, post_content_record.clone()).await.context("コンテンツブロックの取得に失敗しました")?;
      content_blocks.push((post_content_record, content_block));
    }

    // エンティティに変換
    convert_to_blog_post_entity(blog_post_record, thumbnail_record, content_blocks).context("BlogPostEntityへの変換に失敗しました")
  }

  async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
    // record_mapperを使用してBlogPostEntityをDBレコードに変換
    let (blog_post_record, content_records) = convert_from_blog_post_entity(blog_post).context("BlogPostEntityからDBレコードへの変換に失敗しました")?;

    // トランザクションを開始
    let mut tx = self.pool.begin().await.context("トランザクションの開始に失敗しました")?;

    // 1. ブログ記事の挿入
    insert_blog_post_with_published_at(&mut *tx, blog_post_record, chrono::Utc::now().naive_utc()).await.context("ブログ記事の挿入に失敗しました")?;

    // 2. コンテンツの挿入
    for (post_content_record, content_block_record) in content_records {
      // PostContentRecordの挿入
      insert_blog_post_content(&mut *tx, post_content_record).await.context("コンテンツレコードの挿入に失敗しました")?;

      // 各コンテンツタイプごとの詳細データを挿入
      match content_block_record {
        AnyContentBlockRecord::HeadingBlockRecord(heading) => {
          insert_heading_block(&mut *tx, heading).await.context("見出しブロックの挿入に失敗しました")?;
        }
        AnyContentBlockRecord::ParagraphBlockRecord(paragraph) => {
          // ParagraphBlockの挿入
          insert_paragraph_block(&mut *tx, paragraph.paragraph_block).await.context("段落ブロックの挿入に失敗しました")?;

          // RichTextRecordの挿入
          for rich_text_record in paragraph.rich_text_records_with_relations {
            let rich_text_id = rich_text_record.text_record.id;

            insert_rich_text(&mut *tx, rich_text_record.text_record).await.context("リッチテキストの挿入に失敗しました")?;

            // スタイルの挿入
            for style_record in rich_text_record.style_records {
              // text_stylesテーブルにスタイルが存在しない場合は挿入
              insert_text_style_if_not_exists(&mut *tx, style_record.clone()).await.context("テキストスタイルの挿入に失敗しました")?;

              let rich_text_style = crate::infrastructure::repositories::blog_post_sqlx_repository::tables::paragraph_blocks_table::RichTextStyleRecord {
                style_id: style_record.id,
                rich_text_id,
              };
              insert_rich_text_style(&mut *tx, rich_text_style).await.context("リッチテキストスタイルの挿入に失敗しました")?;
            }

            // リンクの挿入（存在する場合）
            if let Some(link_record) = rich_text_record.link_record {
              insert_rich_text_link(&mut *tx, link_record).await.context("リッチテキストリンクの挿入に失敗しました")?;
            }
          }
        }
        AnyContentBlockRecord::ImageBlockRecord(image_block) => {
          // 画像ブロックの挿入
          insert_image_block(&mut *tx, image_block.image_block_record).await.context("画像ブロックの挿入に失敗しました")?;
        }
        AnyContentBlockRecord::CodeBlockRecord(code_block) => {
          insert_code_block(&mut *tx, code_block).await.context("コードブロックの挿入に失敗しました")?;
        }
      }
    }

    // トランザクションをコミット
    tx.commit().await.context("トランザクションのコミットに失敗しました")?;

    // 保存されたデータを取得して返す
    self.find(&blog_post.get_id().to_string()).await
  }

  async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
    // 最新の記事一覧を取得（投稿日時の降順、オプションでlimit指定）
    let blog_post_records = fetch_latest_blog_posts_records_with_limit(&self.pool, quantity).await.context("最新記事一覧の取得に失敗しました")?;

    let mut blog_post_entities = Vec::new();

    for blog_post_record in blog_post_records {
      // サムネイル画像を取得
      let thumbnail_entity = self
        .image_repository
        .find(&blog_post_record.thumbnail_image_id.to_string())
        .await
        .map_err(|e| anyhow::anyhow!("サムネイル画像の取得に失敗しました: {:?}", e))?;

      // ImageEntityをImageRecordに変換（既存のconvert_to_blog_post_entity関数と互換性を保つため）
      let thumbnail_record = convert_from_image_entity(&thumbnail_entity);

      // コンテンツ一覧を取得
      let post_content_records = fetch_post_contents_by_post_id(&self.pool, blog_post_record.id).await.context("コンテンツ一覧の取得に失敗しました")?;

      // 各コンテンツの詳細を取得
      let mut content_blocks = Vec::new();
      for post_content_record in post_content_records {
        let content_block = fetch_any_content_block(&self.pool, post_content_record.clone()).await.context("コンテンツブロックの取得に失敗しました")?;
        content_blocks.push((post_content_record, content_block));
      }

      // エンティティに変換
      let blog_post_entity = convert_to_blog_post_entity(blog_post_record, thumbnail_record, content_blocks).context("BlogPostEntityへの変換に失敗しました")?;
      blog_post_entities.push(blog_post_entity);
    }

    Ok(blog_post_entities)
  }

  async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
    todo!("find_top_tech_pick メソッドは後で実装します")
  }

  async fn update_top_tech_pick_post(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
    todo!("reselect_top_tech_pick_post メソッドは後で実装します")
  }

  async fn find_pick_up_posts(&self, _quantity: u32) -> Result<Vec<BlogPostEntity>> {
    todo!("find_pick_up_posts メソッドは後で実装します")
  }

  async fn update_pick_up_posts(&self, _pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
    todo!("reselect_pick_up_posts メソッドは後で実装します")
  }

  async fn find_popular_posts(&self) -> Result<PopularPostSetEntity> {
    use self::tables::popular_posts_table::fetch_all_popular_blog_posts;

    // 人気記事レコードを取得（3件固定）
    let popular_post_records = fetch_all_popular_blog_posts(&self.pool).await.context("人気記事レコードの取得に失敗しました")?;

    // 各記事IDからBlogPostEntityを取得
    let mut blog_posts = Vec::new();
    for record in popular_post_records {
      let blog_post = self.find(&record.post_id.to_string()).await.context(format!("人気記事ID {}の取得に失敗しました", record.post_id))?;
      blog_posts.push(blog_post);
    }

    // Vec<BlogPostEntity>を[BlogPostEntity; 3]に変換してPopularPostSetEntityを作成
    let posts_array: [BlogPostEntity; 3] =
      blog_posts.try_into().map_err(|v: Vec<BlogPostEntity>| anyhow::anyhow!("人気記事は3件である必要があります。実際の件数: {}", v.len()))?;

    Ok(PopularPostSetEntity::new(posts_array))
  }

  async fn update_popular_posts(&self, popular_post_set: &PopularPostSetEntity) -> Result<PopularPostSetEntity> {
    use self::tables::popular_posts_table::update_popular_blog_posts;
    use crate::infrastructure::repositories::blog_post_sqlx_repository::domain_data_mapper::convert_popular_records_to_entity;
    use crate::infrastructure::repositories::blog_post_sqlx_repository::record_mapper::convert_popular_post_set_to_records;

    // PopularPostSetEntityをPopularPostRecordに変換
    let popular_post_records = convert_popular_post_set_to_records(popular_post_set);

    // トランザクションを開始
    let mut tx = self.pool.begin().await.context("トランザクションの開始に失敗しました")?;

    // データベースを更新
    update_popular_blog_posts(&mut tx, popular_post_records).await.context("人気記事の更新に失敗しました")?;

    // トランザクションをコミット
    tx.commit().await.context("トランザクションのコミットに失敗しました")?;

    // 更新後のデータを取得してPopularPostSetEntityとして返す
    let updated_records = self::tables::popular_posts_table::fetch_all_popular_blog_posts(&self.pool).await.context("更新後の人気記事取得に失敗しました")?;

    // 各記事を取得
    let mut blog_posts = Vec::new();
    for record in &updated_records {
      let blog_post = self.find(&record.post_id.to_string()).await.context(format!("人気記事ID {}の取得に失敗しました", record.post_id))?;
      blog_posts.push(blog_post);
    }

    convert_popular_records_to_entity(updated_records, blog_posts)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::{
    domain::blog_domain::blog_post_entity::{
      content_entity::ContentEntity,
      rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO},
      BlogPostEntity,
    },
    infrastructure::repositories::db_pool::create_db_pool,
  };
  use chrono::NaiveDate;

  /// テスト用に画像レコードを事前挿入するヘルパー関数
  async fn insert_test_images(pool: &PgPool, blog_post: &BlogPostEntity) -> Result<()> {
    let mut tx = pool.begin().await.context("トランザクションの開始に失敗しました")?;

    // サムネイル画像の挿入
    if let Some(thumbnail) = blog_post.get_thumbnail() {
      sqlx::query("INSERT INTO images (id, file_path) VALUES ($1, $2) ON CONFLICT (file_path) DO NOTHING")
        .bind(thumbnail.get_id())
        .bind(thumbnail.get_path())
        .execute(&mut *tx)
        .await
        .context("サムネイル画像の挿入に失敗しました")?;
    }

    // コンテンツ内の画像挿入
    for content in blog_post.get_contents() {
      if let ContentEntity::Image(image_content) = content {
        sqlx::query("INSERT INTO images (id, file_path) VALUES ($1, $2) ON CONFLICT (file_path) DO NOTHING")
          .bind(uuid::Uuid::new_v4()) // 画像コンテンツ用の新しいID
          .bind(image_content.get_path())
          .execute(&mut *tx)
          .await
          .context("画像コンテンツの挿入に失敗しました")?;
      }
    }

    tx.commit().await.context("トランザクションのコミットに失敗しました")?;
    Ok(())
  }

  fn create_test_blog_post() -> BlogPostEntity {
    create_test_blog_post_with_title("テスト記事")
  }

  fn create_test_blog_post_with_title(title: &str) -> BlogPostEntity {
    let blog_post_id = uuid::Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(blog_post_id, title.to_string());

    // サムネイル画像を設定（ユニークなファイルパスを生成）
    let thumbnail_id = uuid::Uuid::new_v4();
    let unique_thumbnail_path = format!("/images/test_thumbnail_{}.jpg", uuid::Uuid::new_v4());
    blog_post.set_thumbnail(thumbnail_id, unique_thumbnail_path);

    // 日付を設定
    let post_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
    blog_post.set_post_date(post_date);
    blog_post.set_last_update_date(post_date);

    // H2見出しを追加
    let h2_content = ContentEntity::h2(uuid::Uuid::new_v4(), "テスト見出し".to_string());
    blog_post.add_content(h2_content);

    // パラグラフを追加（リッチテキスト付き）
    let mut styles = RichTextStylesVO::default();
    styles.bold = true;

    let link = LinkVO {
      url: "https://example.com/test".to_string(),
    };

    let rich_text_part = RichTextPartVO::new("テストパラグラフ内容".to_string(), Some(styles), Some(link));
    let rich_text = RichTextVO::new(vec![rich_text_part]);
    let paragraph_content = ContentEntity::paragraph(uuid::Uuid::new_v4(), rich_text);
    blog_post.add_content(paragraph_content);

    // コードブロックを追加
    let code_block_content = ContentEntity::code_block(
      uuid::Uuid::new_v4(),
      "テストコード".to_string(),
      "fn test() { println!(\"Hello, World!\"); }".to_string(),
      "rust".to_string(),
    );
    blog_post.add_content(code_block_content);

    blog_post
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_save_blog_post_integration() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let image_repository = crate::infrastructure::repositories::image_sqlx_repository::ImageSqlxRepository::new(pool.clone());
    let repository = BlogPostSqlxRepository::new(pool.clone(), image_repository);

    // テスト用BlogPostEntityを作成
    let blog_post = create_test_blog_post();
    let original_id = blog_post.get_id();

    // テスト用画像を事前挿入
    insert_test_images(&pool, &blog_post).await.expect("テスト用画像の挿入に失敗しました");

    // saveメソッドを実行
    let result = repository.save(&blog_post).await;

    // 結果を検証
    assert!(result.is_ok(), "save操作が失敗しました: {:?}", result.err());
    let saved_blog_post = result.unwrap();

    // 基本情報の検証
    assert_eq!(saved_blog_post.get_id(), original_id);
    assert_eq!(saved_blog_post.get_title_text(), "テスト記事");

    // サムネイルの検証
    assert!(saved_blog_post.get_thumbnail().is_some());
    let thumbnail = saved_blog_post.get_thumbnail().unwrap();
    assert!(thumbnail.get_path().starts_with("/images/test_thumbnail_"));
    assert!(thumbnail.get_path().ends_with(".jpg"));

    // コンテンツの検証
    let contents = saved_blog_post.get_contents();
    assert_eq!(contents.len(), 3);

    // H2見出しの検証
    match &contents[0] {
      ContentEntity::H2(h2) => {
        assert_eq!(h2.get_value(), "テスト見出し");
      }
      _ => panic!("最初のコンテンツはH2見出しである必要があります"),
    }

    // パラグラフの検証
    match &contents[1] {
      ContentEntity::Paragraph(paragraph) => {
        let rich_text_parts = paragraph.get_value().get_text();
        assert_eq!(rich_text_parts.len(), 1);
        assert_eq!(rich_text_parts[0].get_text(), "テストパラグラフ内容");
        assert!(rich_text_parts[0].get_styles().bold);
        assert!(rich_text_parts[0].get_link().is_some());
        assert_eq!(rich_text_parts[0].get_link().unwrap().url, "https://example.com/test");
      }
      _ => panic!("2番目のコンテンツはパラグラフである必要があります"),
    }

    // コードブロックの検証
    match &contents[2] {
      ContentEntity::CodeBlock(code_block) => {
        assert_eq!(code_block.get_title(), "テストコード");
        assert_eq!(code_block.get_code(), "fn test() { println!(\"Hello, World!\"); }");
        assert_eq!(code_block.get_language(), "rust");
      }
      _ => panic!("3番目のコンテンツはコードブロックである必要があります"),
    }
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_save_and_find_blog_post_roundtrip() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("テスト用データベースプールの作成に失敗しました");
    let image_repository = crate::infrastructure::repositories::image_sqlx_repository::ImageSqlxRepository::new(pool.clone());
    let repository = BlogPostSqlxRepository::new(pool.clone(), image_repository);

    // テスト用BlogPostEntityを作成
    let original_blog_post = create_test_blog_post();
    let original_id = original_blog_post.get_id();

    // テスト用画像を事前挿入
    insert_test_images(&pool, &original_blog_post).await.expect("テスト用画像の挿入に失敗しました");

    // saveメソッドを実行
    let saved_result = repository.save(&original_blog_post).await;
    assert!(saved_result.is_ok(), "save操作が失敗しました: {:?}", saved_result.err());

    // findメソッドで保存したデータを取得
    let found_result = repository.find(&original_id.to_string()).await;
    assert!(found_result.is_ok(), "find操作が失敗しました: {:?}", found_result.err());
    let found_blog_post = found_result.unwrap();

    // 元のデータと取得したデータを比較
    assert_eq!(found_blog_post.get_id(), original_id);
    assert_eq!(found_blog_post.get_title_text(), original_blog_post.get_title_text());
    assert_eq!(found_blog_post.get_post_date(), original_blog_post.get_post_date());
    assert_eq!(found_blog_post.get_last_update_date(), original_blog_post.get_last_update_date());

    // コンテンツ数が一致することを確認
    assert_eq!(found_blog_post.get_contents().len(), original_blog_post.get_contents().len());

    // サムネイル情報の一致を確認
    let original_thumbnail = original_blog_post.get_thumbnail().unwrap();
    let found_thumbnail = found_blog_post.get_thumbnail().unwrap();
    assert_eq!(found_thumbnail.get_path(), original_thumbnail.get_path());
  }

  #[tokio::test]
  #[ignore = "データベース接続が必要なテスト"]
  async fn test_find_popular_posts_取得機能() {
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let image_repository = crate::infrastructure::repositories::image_sqlx_repository::ImageSqlxRepository::new(pool.clone());
    let repository = BlogPostSqlxRepository::new(pool.clone(), image_repository);

    // テスト用記事を3件作成して保存
    let mut test_posts = Vec::new();
    for i in 1..=3 {
      // 各記事に異なるタイトルを設定して完全な記事を作成
      let blog_post = create_test_blog_post_with_title(&format!("人気記事{}", i));
      test_posts.push(blog_post);
    }

    // 各記事をデータベースに保存
    for blog_post in &test_posts {
      insert_test_images(&pool, blog_post).await.expect("テスト用画像の挿入に失敗しました");
      repository.save(blog_post).await.expect("記事の保存に失敗しました");
    }

    // 人気記事テーブルに挿入
    let popular_post_records: Vec<popular_posts_table::PopularPostRecord> = test_posts
      .iter()
      .map(|post| popular_posts_table::PopularPostRecord {
        id: Uuid::new_v4(),
        post_id: post.get_id(),
      })
      .collect();

    use self::tables::popular_posts_table::update_popular_blog_posts;
    let mut tx = pool.begin().await.expect("トランザクションの開始に失敗しました");
    update_popular_blog_posts(&mut tx, popular_post_records).await.expect("人気記事の挿入に失敗しました");
    tx.commit().await.expect("トランザクションのコミットに失敗しました");

    // find_popular_postsをテスト
    let result = repository.find_popular_posts().await;
    assert!(
      result.is_ok(),
      "find_popular_posts操作が失敗しま
    した: {:?}",
      result.err()
    );

    let popular_posts = result.unwrap();
    let posts = popular_posts.get_all_posts();
    assert_eq!(posts.len(), 3, "人気記事は3件取得されるべきです");

    // 取得した記事のIDが期待されるものと一致することを確認
    let expected_ids: std::collections::HashSet<Uuid> = test_posts.iter().map(|post| post.get_id()).collect();
    let actual_ids: std::collections::HashSet<Uuid> = posts.iter().map(|post| post.get_id()).collect();
    assert_eq!(actual_ids, expected_ids, "取得した人気記事のIDが期待されるものと一致しません");
  }

  #[tokio::test]
  #[ignore = "データベース接続が必要なテスト"]
  async fn test_update_popular_posts_更新機能() {
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let image_repository = crate::infrastructure::repositories::image_sqlx_repository::ImageSqlxRepository::new(pool.clone());
    let repository = BlogPostSqlxRepository::new(pool.clone(), image_repository);

    // テスト用記事を3件作成して保存
    let mut test_posts = Vec::new();
    for i in 1..=3 {
      // 各記事に異なるタイトルを設定して完全な記事を作成
      let blog_post = create_test_blog_post_with_title(&format!("更新テスト記事{}", i));
      test_posts.push(blog_post);
    }

    // 各記事をデータベースに保存
    for blog_post in &test_posts {
      insert_test_images(&pool, blog_post).await.expect("テスト用画像の挿入に失敗しました");
      repository.save(blog_post).await.expect("記事の保存に失敗しました");
    }

    // PopularPostSetEntityを作成
    let posts_array: [BlogPostEntity; 3] = test_posts.try_into().expect("配列変換に失敗しました");
    let popular_post_set = PopularPostSetEntity::new(posts_array);

    // update_popular_postsをテスト
    let result = repository.update_popular_posts(&popular_post_set).await;
    assert!(result.is_ok(), "update_popular_posts操作が失敗しました: {:?}", result.err());

    let updated_popular_post_set = result.unwrap();
    let updated_posts = updated_popular_post_set.get_all_posts();
    assert_eq!(updated_posts.len(), 3, "更新後の人気記事は3件であるべきです");

    // 更新されたデータがデータベースに反映されていることを確認
    let verification_result = repository.find_popular_posts().await;
    assert!(verification_result.is_ok(), "更新後の検証取得が失敗しました");

    let verification_posts = verification_result.unwrap();
    let verification_posts_array = verification_posts.get_all_posts();
    assert_eq!(verification_posts_array.len(), 3, "検証用取得でも3件であるべきです");

    // 期待される記事IDと一致することを確認
    let expected_ids: std::collections::HashSet<Uuid> = updated_posts.iter().map(|post| post.get_id()).collect();
    let actual_ids: std::collections::HashSet<Uuid> = verification_posts_array.iter().map(|post| post.get_id()).collect();
    assert_eq!(actual_ids, expected_ids, "更新後の人気記事IDが期待されるものと一致しません");
  }
}
