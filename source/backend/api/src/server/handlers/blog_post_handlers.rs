use actix_web::{web, Scope};

use super::image_handlers::image_scope;

// TODO image_scope が同階層の別モジュールとなっており構造的に気持ち悪いので、上手く階層化する
pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope()).service(image_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts")
    .route("/top-tech-pick", web::get().to(handle_funcs::get_top_tech_pick_blog_post))
    .route("/pickup", web::get().to(handle_funcs::get_pickup_blog_posts))
    .route("/popular", web::get().to(handle_funcs::get_popular_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
    .route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use crate::{
    db::tables::{
      pickup_posts_table::fetch_all_pickup_blog_posts, popular_posts_table::fetch_all_popular_blog_posts, top_tech_pick_table::fetch_top_tech_pick_blog_post,
    },
    server::handlers::{
      crud_helpers::{create_blog_post::create_single_blog_post, fetch_blog_post::fetch_single_blog_post},
      response::err::ApiCustomError,
    },
  };
  use actix_web::{web, HttpResponse, Responder};
  use anyhow::Result;
  use common::types::api::response::BlogPost;
  use uuid::Uuid;

  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    println!("get_blog_post");
    let post_id = path.into_inner();
    let parsed_post_id = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(parsed_post_id).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  pub async fn get_top_tech_pick_blog_post() -> Result<impl Responder, ApiCustomError> {
    println!("get_top_tech_pick_blog_post");
    let top_tech_pick_blog_post =
      fetch_top_tech_pick_blog_post().await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の取得に失敗しました。")))?;

    // top_tech_pick_blog_post.post_id を元に実際のブログ記事を fetch する
    let blog_post = fetch_single_blog_post(top_tech_pick_blog_post.post_id).await?;
    Ok(HttpResponse::Ok().json(blog_post))
  }

  pub async fn get_pickup_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_pickup_blog_posts");
    let pickup_blog_posts =
      fetch_all_pickup_blog_posts().await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の取得に失敗しました。")))?;

    // pickup_blog_posts.post_id を元に実際のブログ記事を fetch する
    let mut blog_posts: Vec<BlogPost> = vec![];
    for pickup_blog_post in pickup_blog_posts {
      let blog_post = fetch_single_blog_post(pickup_blog_post.post_id).await?;
      blog_posts.push(blog_post);
    }
    Ok(HttpResponse::Ok().json(blog_posts))
  }

  pub async fn get_popular_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_popular_blog_posts");
    let popular_blog_posts = fetch_all_popular_blog_posts().await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("人気記事の取得に失敗しました。")))?;

    // popular_blog_posts.post_id を元に実際のブログ記事を fetch する
    let mut blog_posts: Vec<BlogPost> = vec![];
    for popular_blog_post in popular_blog_posts {
      let blog_post = fetch_single_blog_post(popular_blog_post.post_id).await?;
      blog_posts.push(blog_post);
    }
    Ok(HttpResponse::Ok().json(blog_posts))
  }

  pub async fn create_blog_post(blog_post_req: web::Json<BlogPost>) -> Result<impl Responder, ApiCustomError> {
    println!("create_blog_post");
    let blog_post_req = blog_post_req.into_inner();

    let inserted_blog_post = create_single_blog_post(blog_post_req).await?;
    Ok(HttpResponse::Ok().json(inserted_blog_post))
  }
}
