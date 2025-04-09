use anyhow::Result;
use common::types::api::response::BlogPost;
use futures::future::join_all;

use crate::{
  db::tables::{
    blog_posts_table::insert_blog_post,
    code_blocks_table::insert_code_block,
    generate_blog_post_records_by,
    heading_blocks_table::insert_heading_block,
    image_blocks_table::insert_image_block,
    images_table::{fetch_all_images, ImageRecord},
    paragraph_blocks_table::{fetch_text_styles_all, insert_paragraph_block, insert_rich_text, insert_rich_text_style, TextStyleRecord},
    post_contents_table::insert_blog_post_content,
  },
  server::handlers::response::err::ApiCustomError,
};

use super::fetch_blog_post::fetch_single_blog_post;

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost, ApiCustomError> {
  let post_id = blog_post.id;
  let text_style_records: Vec<TextStyleRecord> =
    fetch_text_styles_all().await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  let image_records: Vec<ImageRecord> =
    fetch_all_images().await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let (
    blog_post_record,
    post_content_records,
    heading_block_records,
    paragraph_block_records,
    image_block_records,
    code_block_records,
    rich_text_records,
    rich_text_styles,
  ) = generate_blog_post_records_by(blog_post.clone(), text_style_records, image_records)
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  insert_blog_post(blog_post_record).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_content_tasks = vec![];
  for content in post_content_records {
    let task = tokio::spawn(insert_blog_post_content(content));
    insert_content_tasks.push(task);
  }
  let results = join_all(insert_content_tasks).await;
  helper::result_err_handle(results, "コンテンツの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_heading_tasks = vec![];
  for heading in heading_block_records {
    let task = tokio::spawn(insert_heading_block(heading));
    insert_heading_tasks.push(task);
  }
  let results = join_all(insert_heading_tasks).await;
  helper::result_err_handle(results, "見出しブロックの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_paragraph_tasks = vec![];
  for paragraph in paragraph_block_records {
    let task = tokio::spawn(insert_paragraph_block(paragraph));
    insert_paragraph_tasks.push(task);
  }
  let results = join_all(insert_paragraph_tasks).await;
  helper::result_err_handle(results, "段落ブロックの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_rich_text_tasks = vec![];
  for rich_text in rich_text_records {
    let task = tokio::spawn(insert_rich_text(rich_text));
    insert_rich_text_tasks.push(task);
  }
  let results = join_all(insert_rich_text_tasks).await;
  helper::result_err_handle(results, "リッチテキストの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_rich_text_style_tasks = vec![];
  for rich_text_style in rich_text_styles {
    let task = tokio::spawn(insert_rich_text_style(rich_text_style));
    insert_rich_text_style_tasks.push(task);
  }
  let results = join_all(insert_rich_text_style_tasks).await;
  helper::result_err_handle(results, "リッチテキストスタイルの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_image_tasks = vec![];
  for image_block in image_block_records {
    let task = tokio::spawn(insert_image_block(image_block));
    insert_image_tasks.push(task);
  }
  let results = join_all(insert_image_tasks).await;
  helper::result_err_handle(results, "画像ブロックの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_code_tasks = vec![];
  for code_block in code_block_records {
    let task = tokio::spawn(insert_code_block(code_block));
    insert_code_tasks.push(task);
  }
  let results = join_all(insert_code_tasks).await;
  helper::result_err_handle(results, "コードブロックの挿入に失敗しました。")
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let inserted_blog_post = fetch_single_blog_post(post_id).await?;

  Ok(inserted_blog_post)
}

mod helper {
  use anyhow::{Error, Result};
  use tokio::task::JoinError;

  pub fn result_err_handle(results: Vec<Result<Result<(), Error>, JoinError>>, err_msg: &str) -> Result<()> {
    for result in results {
      match result {
        Ok(Ok(_)) => {}
        Ok(Err(e)) => {
          println!("{} 詳細なエラー：{:?}", err_msg, e);
          return Err(Error::msg(format!("{} 詳細なエラー：{:?}", err_msg, e)));
        }
        Err(e) => {
          println!("タスクの実行に失敗しました: {:?}", e);
          return Err(Error::msg(format!("タスクの実行に失敗しました: {:?}", e)));
        }
      }
    }
    Ok(())
  }
}
