mod server;
mod db;

use anyhow::Result;
use server::start_api_server;

#[actix_web::main]
async fn main() -> Result<()> {
  // let posts = sqlx::query_as!(
  //   BlogPost,
  //   "select article_id, title, thumbnail_path, created_post_date, updated_post_date, published_at, created_at, updated_at from blog_posts"
  // )
  // .fetch_all(&pool)
  // .await
  // .unwrap();
  // for post in posts {
  //   println!("{:?}", post);
  // }
  start_api_server().await

}
