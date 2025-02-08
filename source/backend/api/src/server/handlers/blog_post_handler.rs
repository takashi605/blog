use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post)).route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use crate::server::handlers::{crud::fetch_blog_post::fetch_single_blog_post, response::err::ApiCustomError};
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
    // TODO 実際にデータベースに格納したデータを返すように変更
    Ok(HttpResponse::Ok().json(blog_post_req))
  }
}
