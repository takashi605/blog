pub mod create_blog_post;
pub mod fetch_blog_post;

use actix_web::{web, Scope};

use super::image_handlers::image_scope;

// TODO image_scope が同階層の別モジュールとなっており構造的に気持ち悪いので、上手く階層化する
pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope()).service(image_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post)).route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use super::{create_blog_post::create_single_blog_post, fetch_blog_post::fetch_single_blog_post};

  use crate::server::handlers::response::err::ApiCustomError;
  use actix_web::{web, HttpResponse, Responder};
  use common::types::api::response::BlogPost;
  use uuid::Uuid;

  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    let post_id = path.into_inner();
    let uuid = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(uuid).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  pub async fn create_blog_post(blog_post_req: web::Json<BlogPost>) -> Result<impl Responder, ApiCustomError> {
    let blog_post_req = blog_post_req.into_inner();

    // TODO create_single_blog_post 関数内部で適切なエラーハンドリングを行い、? でエラーを返す
    let inserted_blog_post = create_single_blog_post(blog_post_req).await.map_err(|err| ApiCustomError::Other(err))?;
    Ok(HttpResponse::Ok().json(inserted_blog_post))
  }
}
