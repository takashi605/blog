pub mod fetch_images;

use actix_web::{web, Scope};

pub fn image_scope() -> Scope {
  web::scope("/images").route("", web::get().to(handle_funcs::get_images)).route("", web::post().to(handle_funcs::create_image))
}

mod handle_funcs {
  use super::fetch_images::fetch_images;
  use crate::{db::tables::images_table::insert_image, server::handlers::response::err::ApiCustomError};
  use actix_web::{web, HttpResponse, Responder};
  use common::types::api::response::Image;

  pub async fn get_images() -> Result<impl Responder, ApiCustomError> {
    let images: Vec<Image> = fetch_images().await?;
    Ok(HttpResponse::Ok().json(images))
  }

  pub async fn create_image(image_by_req: web::Json<Image>) -> Result<impl Responder, ApiCustomError> {
    let image_by_req = image_by_req.into_inner();
    let image_record = insert_image(image_by_req).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("画像の挿入に失敗しました。")))?;
    let image = Image {
      id: image_record.id,
      path: image_record.file_path,
    };
    Ok(HttpResponse::Ok().json(image))
  }
}
