use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

mod handle_funcs {
  use actix_web::{web::Path, HttpResponse, Responder};

  pub async fn get_blog_post(path: Path<String>) -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
  }
}
