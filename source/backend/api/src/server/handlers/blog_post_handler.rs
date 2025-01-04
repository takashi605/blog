use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

mod handle_funcs {
  use actix_web::{web, HttpResponse, Responder};
  use uuid::Uuid;
  use crate::server::handlers::response::blog_post_response::fetch_single_blog_post;

  pub async fn get_blog_post(path: web::Path<String>) -> impl Responder {
    let post_id = path.into_inner();
    let uuid = Uuid::parse_str(&post_id).expect("UUIDのパースに失敗しました。");
    let blog_post = fetch_single_blog_post(uuid).await.expect("ブログ記事の取得に失敗しました。");

    HttpResponse::Ok().json(blog_post)
  }
}
