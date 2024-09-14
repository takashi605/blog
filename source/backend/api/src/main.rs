use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  println!("api started");
  HttpServer::new(|| App::new().service(hello).service(echo).service(fivesix).route("/hey", web::get().to(manual_hello))).bind(("127.0.0.1", 8000))?.run().await
}

