pub mod handlers;
pub mod openapi;

use actix_cors::Cors;
use actix_web::{http, middleware::Condition, web, App, HttpResponse, HttpServer};
use anyhow::{Context, Result};
use handlers::{
  blog_post_handlers::{admin_scope, blog_scope},
  response::err::ApiCustomError,
};
use openapi::openapi_handler;
use std::env;

pub async fn start_api_server() -> Result<()> {
  println!("api started");
  
  // 開発環境でのみ Cors を設定する
  // 本番環境では Nginx などで設定する
  HttpServer::new(move || {
    let env = env::var("RUST_ENV").expect("RUST_ENV must be set");
    let is_dev = env == "development";

    let mut app = App::new()
      .wrap(Condition::new(is_dev, configure_cors()))
      .service(admin_scope())
      .service(blog_scope())
      .default_service(web::route().to(route_unmatch));
    
    // 開発環境でのみOpenAPI仕様書エンドポイントを有効化
    if is_dev {
      app = app.route("/openapi.json", web::get().to(openapi_handler));
    }
    
    app
  })
  .bind(("0.0.0.0", 8001))?
  .run()
  .await
  .context("api サーバーの起動に失敗しました")
}

fn configure_cors() -> Cors {
  Cors::default()
    .allow_any_origin()
    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT, http::header::CONTENT_TYPE])
    .max_age(3600)
}

async fn route_unmatch() -> Result<HttpResponse, ApiCustomError> {
  Err(ApiCustomError::NotFoundURL)
}
