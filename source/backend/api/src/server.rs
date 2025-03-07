pub mod handlers;

use actix_cors::Cors;
use actix_web::{http, middleware::Condition, web, App, HttpResponse, HttpServer};
use anyhow::{Context, Result};
use handlers::{blog_post_handlers::blog_scope, response::err::ApiCustomError, sample_handler::sample_scope};
use std::env;

pub async fn start_api_server() -> Result<()> {
  println!("api started");
  let env = env::var("RUST_ENV").expect("RUST_ENV must be set");
  let is_dev = env == "development";

  // 開発環境でのみ Cors を設定する
  // 本番環境では Nginx などで設定する
  HttpServer::new(move || {
    App::new().wrap(Condition::new(is_dev, configure_cors())).service(blog_scope()).service(sample_scope()).default_service(web::route().to(route_unmatch))
  })
  .bind(("0.0.0.0", 8000))?
  .run()
  .await
  .context("api サーバーの起動に失敗しました")
}

fn configure_cors() -> Cors {
  Cors::default()
    .allow_any_origin()
    .allowed_methods(vec!["GET", "POST"])
    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT, http::header::CONTENT_TYPE])
    .max_age(3600)
}

async fn route_unmatch() -> Result<HttpResponse, ApiCustomError> {
  Err(ApiCustomError::NotFoundURL)
}
