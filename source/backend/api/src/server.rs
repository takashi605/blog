pub mod handlers;

use actix_cors::Cors;
use actix_web::{http, App, HttpServer};
use anyhow::{Context, Result};
use handlers::{blog_post_handler::blog_scope, sample_handler::sample_scope};

pub async fn start_api_server() -> Result<()> {
  println!("api started");
  HttpServer::new(|| App::new().wrap(configure_cors()).service(sample_scope()).service(blog_scope()))
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
    .context("api サーバーの起動に失敗しました")
}

fn configure_cors() -> Cors {
  Cors::default()
    .allow_any_origin()
    .allowed_methods(vec!["GET", "POST"])
    // .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
    .allowed_header(http::header::CONTENT_TYPE)
    .max_age(3600)
}
