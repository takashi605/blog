use anyhow::Result;
use common::types::api::response::BlogPost;

use crate::db::tables::{
  blog_posts_table::insert_blog_post,
  generate_blog_post_records_by,
  paragraph_blocks_table::{fetch_text_styles_all, TextStyleRecord},
};

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost> {
  let text_style_records: Vec<TextStyleRecord> = fetch_text_styles_all().await?;

  let (blog_post_record, _blog_post_content, _heading_block_records, _paragraph_block_records, _rich_text_records, _rich_text_styles) =
    generate_blog_post_records_by(blog_post.clone(), text_style_records)?;
  insert_blog_post(blog_post_record).await?;

  // TODO 実際にデータベースに格納したデータを返すように変更
  Ok(blog_post)
}
