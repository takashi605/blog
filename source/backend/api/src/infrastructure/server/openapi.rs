use actix_web::{HttpResponse, Responder};
use common::types::api::{BlogPost, BlogPostContent, CodeBlock, H2Block, H3Block, Image, ImageBlock, Link, ParagraphBlock, RichText, Style};
use utoipa::OpenApi;

#[derive(OpenApi)]
#[openapi(
  paths(
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_blog_post,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_latest_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_top_tech_pick_blog_post,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::put_top_tech_pick_blog_post,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_pickup_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::put_pickup_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_popular_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::put_popular_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::create_blog_post,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_admin_blog_posts,
    crate::infrastructure::server::handlers::blog_post_handlers::handle_funcs::get_admin_blog_post,
    crate::infrastructure::server::handlers::image_handlers::handle_funcs::get_images,
    crate::infrastructure::server::handlers::image_handlers::handle_funcs::create_image,
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

pub async fn openapi_handler() -> impl Responder {
  HttpResponse::Ok().json(ApiDoc::openapi())
}
