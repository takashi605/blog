use actix_web::{web, Scope};
use utoipa::OpenApi;

use super::image_handlers::{admin_image_scope, image_scope};

// TODO image_scope が同階層の別モジュールとなっており構造的に気持ち悪いので、上手く階層化する
pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope()).service(image_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts")
    .route("/latest", web::get().to(handle_funcs::get_latest_blog_posts))
    .route("/top-tech-pick", web::get().to(handle_funcs::get_top_tech_pick_blog_post))
    .route("/pickup", web::get().to(handle_funcs::get_pickup_blog_posts))
    .route("/popular", web::get().to(handle_funcs::get_popular_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

pub fn admin_scope() -> Scope {
  web::scope("/admin/blog").service(admin_blog_posts_scope()).service(admin_image_scope())
}

// 管理者用のスコープ
pub fn admin_blog_posts_scope() -> Scope {
  web::scope("/posts")
    .route("/top-tech-pick", web::put().to(handle_funcs::put_top_tech_pick_blog_post))
    .route("/pickup", web::put().to(handle_funcs::put_pickup_blog_posts))
    .route("/popular", web::put().to(handle_funcs::put_popular_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
    .route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use crate::{
    db::{pool::POOL, tables::top_tech_pick_table::{fetch_top_tech_pick_blog_post, update_top_tech_pick_post}},
    server::handlers::{
      crud_helpers::{
        create_blog_post::create_single_blog_post,
        fetch_blog_post::{fetch_all_latest_blog_posts, fetch_pickup_posts, fetch_popular_posts, fetch_single_blog_post},
        update_blog_post::{update_pickup_posts, update_popular_posts},
      },
      response::err::ApiCustomError,
    },
  };
  use actix_web::{web, HttpResponse, Responder};
  use anyhow::Result;
  use common::types::api::response::BlogPost;
  use utoipa::path;
  use uuid::Uuid;

  #[utoipa::path(
    get,
    path = "/api/blog/posts/{uuid}",
    responses(
      (status = 200, description = "Blog post found", body = BlogPost),
      (status = 404, description = "Blog post not found")
    ),
    params(
      ("uuid" = String, Path, description = "Blog post UUID")
    )
  )]
  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    println!("get_blog_post");
    let post_id = path.into_inner();
    let parsed_post_id = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(parsed_post_id).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/latest",
    responses(
      (status = 200, description = "Latest blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_latest_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_latest_blog_posts");
    let latest_blog_posts = fetch_all_latest_blog_posts().await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("最新記事の取得に失敗しました。")))?;
    Ok(HttpResponse::Ok().json(latest_blog_posts))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/top-tech-pick",
    responses(
      (status = 200, description = "Top tech pick blog post", body = BlogPost)
    )
  )]
  pub async fn get_top_tech_pick_blog_post() -> Result<impl Responder, ApiCustomError> {
    println!("get_top_tech_pick_blog_post");
    let top_tech_pick_blog_post =
      fetch_top_tech_pick_blog_post(&*POOL).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の取得に失敗しました。")))?;

    // top_tech_pick_blog_post.post_id を元に実際のブログ記事を fetch する
    let blog_post = fetch_single_blog_post(top_tech_pick_blog_post.post_id).await?;
    Ok(HttpResponse::Ok().json(blog_post))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/top-tech-pick",
    request_body = BlogPost,
    responses(
      (status = 200, description = "Top tech pick blog post updated", body = BlogPost)
    )
  )]
  pub async fn put_top_tech_pick_blog_post(top_tech_pick_posts_req: web::Json<BlogPost>) -> Result<impl Responder, ApiCustomError> {
    println!("put_top_tech_pick_blog_post");

    let requested_post: BlogPost = top_tech_pick_posts_req.into_inner();
    update_top_tech_pick_post(&*POOL, requested_post.id).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の更新に失敗しました。")))?;

    let updated_post = fetch_top_tech_pick_blog_post(&*POOL).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の取得に失敗しました。")))?;
    let updated_post_id = updated_post.post_id;
    let result = fetch_single_blog_post(updated_post_id).await?;

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/pickup",
    responses(
      (status = 200, description = "Pickup blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_pickup_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_pickup_blog_posts");

    let result = fetch_pickup_posts().await?;

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/pickup",
    request_body = Vec<BlogPost>,
    responses(
      (status = 200, description = "Pickup blog posts updated", body = Vec<BlogPost>)
    )
  )]
  pub async fn put_pickup_blog_posts(pickup_posts_req: web::Json<Vec<BlogPost>>) -> Result<impl Responder, ApiCustomError> {
    println!("put_pickup_blog_posts");

    let pickup_blog_posts: Vec<BlogPost> = pickup_posts_req.into_inner();
    update_pickup_posts(pickup_blog_posts).await?;

    let result = fetch_pickup_posts().await?;

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/popular",
    responses(
      (status = 200, description = "Popular blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_popular_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_popular_blog_posts");
    let result = fetch_popular_posts().await?;
    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/popular",
    request_body = Vec<BlogPost>,
    responses(
      (status = 200, description = "Popular blog posts updated", body = Vec<BlogPost>)
    )
  )]
  pub async fn put_popular_blog_posts(popular_posts_req: web::Json<Vec<BlogPost>>) -> Result<impl Responder, ApiCustomError> {
    println!("put_popular_blog_posts");

    let popular_blog_posts: Vec<BlogPost> = popular_posts_req.into_inner();
    update_popular_posts(popular_blog_posts).await?;

    let result = fetch_popular_posts().await?;

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    post,
    path = "/api/admin/blog/posts",
    request_body = BlogPost,
    responses(
      (status = 200, description = "Blog post created", body = BlogPost)
    )
  )]
  pub async fn create_blog_post(blog_post_req: web::Json<BlogPost>) -> Result<impl Responder, ApiCustomError> {
    println!("create_blog_post");
    let blog_post_req = blog_post_req.into_inner();

    let inserted_blog_post = create_single_blog_post(blog_post_req).await?;
    Ok(HttpResponse::Ok().json(inserted_blog_post))
  }
}
