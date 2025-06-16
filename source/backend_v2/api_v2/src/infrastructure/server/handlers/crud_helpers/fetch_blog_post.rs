use crate::db::pool::POOL;
use std::vec;

use crate::{
  db::tables::{
    blog_posts_table::{fetch_all_latest_blog_posts_records, fetch_blog_post_by_id, BlogPostRecord, BlogPostRecordWithRelations},
    images_table::{fetch_image_by_id, ImageRecord},
    pickup_posts_table::fetch_all_pickup_blog_posts,
    popular_posts_table::fetch_all_popular_blog_posts,
    post_contents_table::{fetch_any_content_block, fetch_post_contents_by_post_id, AnyContentBlockRecord, PostContentRecord},
  },
  infrastructure::server::handlers::response::{convert_to_response::generate_blog_post_response, err::ApiCustomError},
};
use anyhow::{Context, Result};
use common::types::api::response::BlogPost;
use uuid::Uuid;

struct ContentWithOrder {
  sort_order: i32,
  content: PostContentRecord,
}
impl ContentWithOrder {
  fn new(sort_order: i32, content: PostContentRecord) -> Self {
    Self { sort_order, content }
  }
}

pub async fn fetch_single_blog_post(post_id: Uuid) -> Result<BlogPost, ApiCustomError> {
  let blog_post_record: BlogPostRecord = fetch_blog_post_with_api_err(post_id).await?;
  let blog_post_record_with_relations: BlogPostRecordWithRelations = fetch_blog_post_relations(blog_post_record).await?;
  let blog_post = generate_blog_post_response(blog_post_record_with_relations)
    .await
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  Ok(blog_post)
}

pub async fn fetch_all_latest_blog_posts() -> Result<Vec<BlogPost>, ApiCustomError> {
  let mut result: Vec<BlogPost> = vec![];

  let blog_post_records: Vec<BlogPostRecord> = fetch_all_latest_blog_posts_records(&*POOL).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorNotFound("ブログ記事が見つかりませんでした。"))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  for blog_post_record in blog_post_records {
    let blog_post_record_with_relations: BlogPostRecordWithRelations = fetch_blog_post_relations(blog_post_record).await?;
    let blog_post = generate_blog_post_response(blog_post_record_with_relations)
      .await
      .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
    result.push(blog_post);
  }
  Ok(result)
}

async fn fetch_blog_post_relations(blog_post_record: BlogPostRecord) -> Result<BlogPostRecordWithRelations, ApiCustomError> {
  let thumbnail_record: ImageRecord = fetch_thumbnail_record_with_api_err(blog_post_record.thumbnail_image_id).await?;

  let content_records: Vec<PostContentRecord> = fetch_content_records_with_api_err(blog_post_record.id).await?;
  // ソートしてからブロックを取得
  let sorted_content_records: Vec<PostContentRecord> = sort_contents(content_records);
  let content_block_records: Vec<AnyContentBlockRecord> = fetch_content_blocks(sorted_content_records).await?;

  Ok(BlogPostRecordWithRelations {
    blog_post_record,
    thumbnail_record,
    content_block_records,
  })
}

async fn fetch_blog_post_with_api_err(post_id: Uuid) -> Result<BlogPostRecord, ApiCustomError> {
  let blog_post_record = fetch_blog_post_by_id(&*POOL, post_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorNotFound("ブログ記事が見つかりませんでした。"))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  Ok(blog_post_record)
}

async fn fetch_thumbnail_record_with_api_err(image_id: Uuid) -> Result<ImageRecord, ApiCustomError> {
  let thumbnail_record = fetch_image_by_id(&*POOL, image_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事のサムネイル画像の取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  Ok(thumbnail_record)
}

async fn fetch_content_records_with_api_err(post_id: Uuid) -> Result<Vec<PostContentRecord>, ApiCustomError> {
  let content_records = fetch_post_contents_by_post_id(&*POOL, post_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事コンテンツの取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  Ok(content_records)
}

async fn fetch_content_blocks(content_records: Vec<PostContentRecord>) -> Result<Vec<AnyContentBlockRecord>, ApiCustomError> {
  let mut result: Vec<AnyContentBlockRecord> = vec![];
  for content_record in content_records {
    let content_block = fetch_content_block_with_api_err(content_record).await?;
    result.push(content_block);
  }
  Ok(result)
}

async fn fetch_content_block_with_api_err(content_record: PostContentRecord) -> Result<AnyContentBlockRecord, ApiCustomError> {
  let content_block = fetch_any_content_block(&*POOL, content_record).await.context("コンテンツブロックの取得に失敗しました。").map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "コンテンツブロックの取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  Ok(content_block)
}

// エラーが「データなし」のエラーかを判定する関数
fn is_row_not_found(err: &anyhow::Error) -> bool {
  // root_cause で一番根本のエラーを取得
  if let Some(sqlx::Error::RowNotFound) = err.root_cause().downcast_ref::<sqlx::Error>() {
    true
  } else {
    false
  }
}

fn sort_contents(content_records: Vec<PostContentRecord>) -> Vec<PostContentRecord> {
  let mut content_with_order: Vec<ContentWithOrder> = vec![];

  for content_record in content_records {
    let sort_order = content_record.sort_order; // content が move される前に変数化

    content_with_order.push(ContentWithOrder::new(sort_order, content_record));
  }
  content_with_order.sort_by(|a, b| a.sort_order.cmp(&b.sort_order));
  content_with_order.into_iter().map(|content| content.content).collect::<Vec<PostContentRecord>>()
}

pub async fn fetch_pickup_posts() -> Result<Vec<BlogPost>, ApiCustomError> {
  let pickup_posts = fetch_all_pickup_blog_posts(&*POOL).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の取得に失敗しました。")))?;
  let mut blog_posts: Vec<BlogPost> = vec![];
  for pickup_blog_post in pickup_posts {
    let blog_post = fetch_single_blog_post(pickup_blog_post.post_id).await?;
    blog_posts.push(blog_post);
  }
  Ok(blog_posts)
}
pub async fn fetch_popular_posts() -> Result<Vec<BlogPost>, ApiCustomError> {
  let popular_posts = fetch_all_popular_blog_posts(&*POOL).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("人気記事の取得に失敗しました。")))?;
  let mut blog_posts: Vec<BlogPost> = vec![];
  for popular_blog_post in popular_posts {
    let blog_post = fetch_single_blog_post(popular_blog_post.post_id).await?;
    blog_posts.push(blog_post);
  }
  Ok(blog_posts)
}
