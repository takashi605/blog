mod server;

use actix_cors::Cors;
use actix_web::{http, App, HttpServer};
use server::handlers::sample_handler::sample_scope;
// use chrono::{DateTime, NaiveDate, Utc};
// use serde::{Deserialize, Serialize};
// use sqlx::postgres::PgPoolOptions;
// use std::env;
// use uuid::Uuid;

// #[derive(Debug, Serialize, Deserialize)]
// pub struct BlogPost {
//   pub article_id: Uuid,
//   pub title: String,
//   pub thumbnail_path: String,
//   pub created_post_date: NaiveDate,
//   pub updated_post_date: NaiveDate,
//   pub published_at: DateTime<Utc>,
//   pub created_at: DateTime<Utc>,
//   pub updated_at: DateTime<Utc>,
// }

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  println!("api started");
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
  HttpServer::new(|| {
    let cors = Cors::default()
      .allow_any_origin()
      .allowed_methods(vec!["GET", "POST"])
      // .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
      .allowed_header(http::header::CONTENT_TYPE)
      .max_age(3600);
    App::new().wrap(cors).service(sample_scope())
  })
  .bind(("0.0.0.0", 8000))?
  .run()
  .await
}
