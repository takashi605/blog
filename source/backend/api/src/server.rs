pub mod handlers;

use actix_cors::Cors;
use actix_web::{http, middleware::Condition, web, App, HttpResponse, HttpServer, Responder};
use anyhow::{Context, Result};
use handlers::{
  blog_post_handlers::{admin_scope, blog_scope},
  response::err::ApiCustomError,
};
use std::env;
use utoipa::OpenApi;
use common::types::api::response::{BlogPost, Image, BlogPostContent, H2Block, H3Block, ParagraphBlock, RichText, ImageBlock, CodeBlock, Style, Link};

#[derive(OpenApi)]
#[openapi(
  paths(
    handlers::blog_post_handlers::handle_funcs::get_blog_post,
    handlers::blog_post_handlers::handle_funcs::get_latest_blog_posts,
    handlers::blog_post_handlers::handle_funcs::get_top_tech_pick_blog_post,
    handlers::blog_post_handlers::handle_funcs::put_top_tech_pick_blog_post,
    handlers::blog_post_handlers::handle_funcs::get_pickup_blog_posts,
    handlers::blog_post_handlers::handle_funcs::put_pickup_blog_posts,
    handlers::blog_post_handlers::handle_funcs::get_popular_blog_posts,
    handlers::blog_post_handlers::handle_funcs::put_popular_blog_posts,
    handlers::blog_post_handlers::handle_funcs::create_blog_post,
    handlers::image_handlers::handle_funcs::get_images,
    handlers::image_handlers::handle_funcs::create_image,
  ),
  components(
    schemas(BlogPost, Image, BlogPostContent, H2Block, H3Block, ParagraphBlock, RichText, ImageBlock, CodeBlock, Style, Link)
  ),
  tags(
    (name = "blog", description = "Blog API"),
    (name = "admin", description = "Admin API")
  )
)]
pub struct ApiDoc;

pub async fn start_api_server() -> Result<()> {
  println!("api started");
  let env = env::var("RUST_ENV").expect("RUST_ENV must be set");
  let is_dev = env == "development";

  // 開発環境でのみ Cors を設定する
  // 本番環境では Nginx などで設定する
  HttpServer::new(move || {
    App::new()
      .wrap(Condition::new(is_dev, configure_cors()))
      .route("/openapi.json", web::get().to(openapi_handler))
      .service(admin_scope())
      .service(blog_scope())
      .default_service(web::route().to(route_unmatch))
  })
  .bind(("0.0.0.0", 8000))?
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

async fn openapi_handler() -> impl Responder {
  HttpResponse::Ok().json(ApiDoc::openapi())
}

async fn route_unmatch() -> Result<HttpResponse, ApiCustomError> {
  Err(ApiCustomError::NotFoundURL)
}
