use anyhow::Result;
use common::types::api::response::BlogPost;

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost> {
  // TODO データベースに格納する処理を実装
  // TODO 実際にデータベースに格納したデータを返すように変更
  Ok(blog_post)
}
