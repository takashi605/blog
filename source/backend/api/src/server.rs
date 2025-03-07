pub mod handlers;
use actix_web::{web, App, HttpResponse, HttpServer};
use anyhow::{Context, Result};
use handlers::{blog_post_handlers::blog_scope,response::err::ApiCustomError, sample_handler::sample_scope};

pub async fn start_api_server() -> Result<()> {
  println!("api started");
  HttpServer::new(|| App::new().service(blog_scope()).service(sample_scope()).default_service(web::route().to(route_unmatch)))
    .bind(("0.0.0.0", 8000))?
    .run()
    .await
    .context("api サーバーの起動に失敗しました")
}

async fn route_unmatch() -> Result<HttpResponse, ApiCustomError> {
  Err(ApiCustomError::NotFoundURL)
}
