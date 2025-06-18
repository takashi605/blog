use crate::{
  db::{
    pool::POOL,
    tables::images_table::{fetch_all_images, ImageRecord},
  },
  infrastructure::server::handlers::response::err::ApiCustomError,
};
use anyhow::Result;
use common::types::api::Image;

pub async fn fetch_images() -> Result<Vec<Image>, ApiCustomError> {
  let image_records: Vec<ImageRecord> =
    fetch_all_images(&*POOL).await.map_err(|err| ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err)))?;
  let images: Vec<Image> = image_records
    .into_iter()
    .map(|image_record| {
      let result: Image = image_record.into();
      result
    })
    .collect();
  Ok(images)
}
