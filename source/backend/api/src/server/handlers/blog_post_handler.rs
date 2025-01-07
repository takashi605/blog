use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

mod handle_funcs {
  use crate::server::handlers::{crud::fetch_blog_post::fetch_single_blog_post, response::err::ApiCustomError};
  use actix_web::{web, HttpResponse, Responder};
  use uuid::Uuid;

  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    let post_id = path.into_inner();
    let uuid = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(uuid).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }
}
