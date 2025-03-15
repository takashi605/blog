use std::vec;

use crate::{
  db::tables::{
    blog_posts_table::fetch_blog_post_by_id,
    images_table::fetch_image_by_id,
    post_contents_table::{fetch_any_content_block, fetch_post_contents_by_post_id, AnyContentBlockRecord, PostContentRecord},
  },
  server::handlers::response::{convert_to_response::generate_blog_post_response, err::ApiCustomError},
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
  let blog_post_record = fetch_blog_post_by_id(post_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorNotFound("ブログ記事が見つかりませんでした。"))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let thumbnail_record = fetch_image_by_id(blog_post_record.thumbnail_image_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事のサムネイル画像の取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let content_records = fetch_post_contents_by_post_id(blog_post_record.id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事コンテンツの取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let sorted_content_records = sort_contents(content_records);
  let mut content_block_records: Vec<AnyContentBlockRecord> = vec![];
  for content_record in sorted_content_records {
    let content_block = fetch_any_content_block(content_record).await.context("コンテンツブロックの取得に失敗しました。").map_err(|err| {
      // RowNotFound なら 404、それ以外は 500
      if is_row_not_found(&err) {
        ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
          "コンテンツブロックの取得に失敗しました。(記事データの不整合)",
        ))
      } else {
        ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
      }
    })?;
    content_block_records.push(content_block);
  }

  let blog_post = generate_blog_post_response(blog_post_record, thumbnail_record, content_block_records)
    .await
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  Ok(blog_post)
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
