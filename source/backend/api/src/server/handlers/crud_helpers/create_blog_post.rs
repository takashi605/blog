use anyhow::Result;
use common::types::api::response::BlogPost;
use futures::future::join_all;

use crate::{
  db::tables::{
    blog_posts_table::insert_blog_post,
    generate_blog_post_records_by,
    heading_blocks_table::insert_heading_block,
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

  let (blog_post_record, post_content_records, heading_block_records, paragraph_block_records, image_block_records, rich_text_records, rich_text_styles) =
    generate_blog_post_records_by(blog_post.clone(), text_style_records, image_records)
      .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  insert_blog_post(blog_post_record).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let mut insert_content_tasks = vec![];
  for content in post_content_records {
    let task = tokio::spawn(insert_blog_post_content(content));
    insert_content_tasks.push(task);
  }
  join_all(insert_content_tasks).await;

  let mut insert_heading_tasks = vec![];
  for heading in heading_block_records {
    let task = tokio::spawn(insert_heading_block(heading));
    insert_heading_tasks.push(task);
  }
  join_all(insert_heading_tasks).await;

  let mut insert_paragraph_tasks = vec![];
  for paragraph in paragraph_block_records {
    let task = tokio::spawn(insert_paragraph_block(paragraph));
    insert_paragraph_tasks.push(task);
  }
  join_all(insert_paragraph_tasks).await;

  let mut insert_rich_text_tasks = vec![];
  for rich_text in rich_text_records {
    let task = tokio::spawn(insert_rich_text(rich_text));
    insert_rich_text_tasks.push(task);
  }
  join_all(insert_rich_text_tasks).await;

  let mut insert_rich_text_style_tasks = vec![];
  for rich_text_style in rich_text_styles {
    let task = tokio::spawn(insert_rich_text_style(rich_text_style));
    insert_rich_text_style_tasks.push(task);
  }
  let results = join_all(insert_rich_text_style_tasks).await;

  // TODO エラーハンドリングをする
  // 他の join_all も同じくエラーハンドリングが必要
  for task_result in results {
    match task_result {
      // タスク自体は正常終了、かつタスク内部の処理も成功
      Ok(Ok(_)) => {}
      // タスクは正常終了したが、中の処理がエラーを返した
      Ok(Err(e)) => {
        println!("Task returned an error: {:?}", e);
        // TODO ここで上位にエラーを返す
      }
      // タスク自体がpanicやキャンセルでJoinErrorになった
      Err(join_err) => {
        println!("Join error: {:?}", join_err);
        // TODO ここで上位にエラーを返す
      }
    }
  }

  let inserted_blog_post = fetch_single_blog_post(post_id).await?;

  // TODO 実際にデータベースに格納したデータを返すように変更
  Ok(inserted_blog_post)
}
