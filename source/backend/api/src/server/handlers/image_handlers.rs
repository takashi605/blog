pub mod fetch_images;

use actix_web::{web, Scope};

pub fn image_scope() -> Scope {
  web::scope("/images")
  .route("", web::get().to(handle_funcs::get_images))
  .route("", web::post().to(handle_funcs::create_image))
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

  pub async fn create_image() -> Result<impl Responder, ApiCustomError> {
    // とりあえず適当な Image を返す
    let image = Image {
      id: uuid::Uuid::new_v4(),
      path: "test-image".to_string(),
    };
    Ok(HttpResponse::Ok().json(image))
  }
}
