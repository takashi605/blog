mod server;

use sqlx::postgres::PgPoolOptions;
use std::{env, sync::LazyLock};

use anyhow::Result;
use server::start_api_server;

// シングルトンとしてのPgPoolの定義
static POOL: LazyLock<sqlx::Pool<sqlx::Postgres>> = LazyLock::new(|| {
  let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  PgPoolOptions::new().max_connections(5).connect_lazy(&database_url).expect("Failed to create pool")
});

#[actix_web::main]
async fn main() -> Result<()> {
  // let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  // let pool = PgPoolOptions::new().max_connections(5).connect(&database_url).await.unwrap();
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
