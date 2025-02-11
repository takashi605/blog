use anyhow::Result;
use common::types::api::response::BlogPost;

use crate::db::tables::{blog_posts_table::insert_blog_post, records_from_blog_post};

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost> {
  let (blog_post_record, _blog_post_content) = records_from_blog_post(blog_post.clone())?;
  insert_blog_post(blog_post_record).await?;

  // TODO 実際にデータベースに格納したデータを返すように変更
  Ok(blog_post)
}
