use actix_web::{get, post, web, HttpResponse, Responder, Scope};

#[get("/")]
async fn hello() -> impl Responder {
  HttpResponse::Ok().body("Hello world!")
}

#[post("/")]
async fn echo(req_body: String) -> impl Responder {
  HttpResponse::Ok().body(req_body)
}

#[get("/fivesix")]
async fn fivesix() -> impl Responder {
  #[derive(serde::Serialize)]
  struct Numbers {
    num1: i32,
    num2: i32,
  }
  let numbers = Numbers { num1: 5, num2: 6 };
  HttpResponse::Ok().json(numbers)
}

async fn manual_hello() -> impl Responder {
  HttpResponse::Ok().body("Hey there!")
}

pub fn sample_scope() -> Scope {
  web::scope("").service(hello).service(echo).service(fivesix).route("/hey", web::get().to(manual_hello))
}
