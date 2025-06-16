use anyhow::Result;
use common::types::api::response::BlogPost;

use crate::{
  db::{
    pool::POOL,
    tables::{
      blog_posts_table::insert_blog_post,
      code_blocks_table::insert_code_block,
      generate_blog_post_records_by,
      heading_blocks_table::insert_heading_block,
      image_blocks_table::insert_image_block,
      images_table::{fetch_all_images, ImageRecord},
      paragraph_blocks_table::{fetch_text_styles_all, insert_paragraph_block, insert_rich_text, insert_rich_text_link, insert_rich_text_style, TextStyleRecord},
      post_contents_table::insert_blog_post_content,
    },
  },
  infrastructure::server::handlers::response::err::ApiCustomError,
};

use super::fetch_blog_post::fetch_single_blog_post;

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost, ApiCustomError> {
  let mut tx = POOL.begin().await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let post_id = blog_post.id;
  let text_style_records: Vec<TextStyleRecord> =
    fetch_text_styles_all(&mut tx).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  let image_records: Vec<ImageRecord> =
    fetch_all_images(&mut tx).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let (
    blog_post_record,
    post_content_records,
    heading_block_records,
    paragraph_block_records,
    image_block_records,
    code_block_records,
    rich_text_records,
    rich_text_styles,
    rich_text_link_records,
  ) = generate_blog_post_records_by(blog_post.clone(), text_style_records, image_records)
    .map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  insert_blog_post(&mut tx, blog_post_record).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  for content in post_content_records {
    insert_blog_post_content(&mut tx, content).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for heading in heading_block_records {
    insert_heading_block(&mut tx, heading).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for paragraph in paragraph_block_records {
    insert_paragraph_block(&mut tx, paragraph).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for rich_text in rich_text_records {
    insert_rich_text(&mut tx, rich_text).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for rich_text_style in rich_text_styles {
    insert_rich_text_style(&mut tx, rich_text_style).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for image_block in image_block_records {
    insert_image_block(&mut tx, image_block).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for code_block in code_block_records {
    insert_code_block(&mut tx, code_block).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  for rich_text_link in rich_text_link_records {
    insert_rich_text_link(&mut tx, rich_text_link).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  }

  tx.commit().await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;

  let inserted_blog_post = fetch_single_blog_post(post_id).await?;

  Ok(inserted_blog_post)
}
