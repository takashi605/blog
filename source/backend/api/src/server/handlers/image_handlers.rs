pub mod fetch_images;

use actix_web::{web, Scope};

pub fn image_scope() -> Scope {
  web::scope("/images").route("", web::get().to(handle_funcs::get_images))
}

mod handle_funcs {
  use super::fetch_images::fetch_images;
  use crate::server::handlers::response::err::ApiCustomError;
  use actix_web::{HttpResponse, Responder};
  use common::types::api::response::Image;

  pub async fn get_images() -> Result<impl Responder, ApiCustomError> {
    let images: Vec<Image> = fetch_images().await?;
    Ok(HttpResponse::Ok().json(images))
  }
}
