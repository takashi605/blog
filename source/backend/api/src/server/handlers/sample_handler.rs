use actix_web::{web, Scope};

pub fn sample_scope() -> Scope {
  web::scope("")
    .service(handle_funcs::hello)
    .service(handle_funcs::echo)
    .service(handle_funcs::fivesix)
    .route("/hey", web::get().to(handle_funcs::manual_hello))
}

mod handle_funcs {
  use actix_web::{get, post, HttpResponse, Responder};

  #[get("/")]
  pub async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
  }

  #[post("/")]
  pub async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
  }

  #[get("/fivesix")]
  pub async fn fivesix() -> impl Responder {
    #[derive(serde::Serialize)]
    struct Numbers {
      num1: i32,
      num2: i32,
    }
    let numbers = Numbers { num1: 5, num2: 6 };
    HttpResponse::Ok().json(numbers)
  }

  pub async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
  }
}
