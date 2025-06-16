pub mod fetch_images;

use actix_web::{web, Scope};

pub fn image_scope() -> Scope {
  web::scope("/images").route("", web::get().to(handle_funcs::get_images))
}

pub fn admin_image_scope() -> Scope {
  web::scope("/images").route("", web::post().to(handle_funcs::create_image))
}

pub mod handle_funcs {
  use super::fetch_images::fetch_images;
  use crate::{
    db::{pool::POOL, tables::images_table::{insert_image, ImageRecord}},
    infrastructure::server::handlers::response::err::ApiCustomError,
  };
  use actix_web::{web, HttpResponse, Responder};
  use common::types::api::response::Image;

  #[utoipa::path(
    get,
    path = "/api/blog/images",
    responses(
      (status = 200, description = "List of images", body = Vec<Image>)
    )
  )]
  pub async fn get_images() -> Result<impl Responder, ApiCustomError> {
    let images: Vec<Image> = fetch_images().await?;
    Ok(HttpResponse::Ok().json(images))
  }

  #[utoipa::path(
    post,
    path = "/api/admin/blog/images",
    request_body = Image,
    responses(
      (status = 200, description = "Image created", body = Image)
    )
  )]
  pub async fn create_image(image_by_req: web::Json<Image>) -> Result<impl Responder, ApiCustomError> {
    let image_by_req: Image = image_by_req.into_inner();
    let insert_result: ImageRecord =
      insert_image(&*POOL, image_by_req).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("画像の挿入に失敗しました。")))?;

    let response: Image = insert_result.into();
    Ok(HttpResponse::Ok().json(response))
  }
}
