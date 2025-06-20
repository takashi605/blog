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
  use crate::infrastructure::{
    di_container::DiContainer,
    server::handlers::{
      api_mapper::image_response_mapper::{image_dto_list_to_response, image_dto_to_response},
      dto_mapper::api_image_to_register_dto,
      response::err::ApiCustomError,
    },
  };
  use actix_web::{web, HttpResponse, Responder};
  use common::types::api::Image;

  #[utoipa::path(
    get,
    path = "/api/blog/images",
    responses(
      (status = 200, description = "List of images", body = Vec<Image>)
    )
  )]
  pub async fn get_images(di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    // 1. DIコンテナからViewImagesUseCaseを取得
    let usecase = di_container.view_images_usecase();

    // 2. ユースケースを実行
    let image_dtos = usecase.execute().await.map_err(|e| ApiCustomError::Other(anyhow::anyhow!("画像一覧取得に失敗しました: {:?}", e)))?;

    // 3. ImageDTOをAPIレスポンスに変換
    let response = image_dto_list_to_response(image_dtos);

    Ok(HttpResponse::Ok().json(response))
  }

  #[utoipa::path(
    post,
    path = "/api/admin/blog/images",
    request_body = Image,
    responses(
      (status = 200, description = "Image created", body = Image)
    )
  )]
  pub async fn create_image(image_by_req: web::Json<Image>, di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    // 1. APIリクエストをRegisterImageDTOに変換
    let image_by_req: Image = image_by_req.into_inner();
    let register_dto = api_image_to_register_dto(image_by_req);

    // 2. DIコンテナからRegisterImageUseCaseを取得
    let usecase = di_container.register_image_usecase();

    // 3. ユースケースを実行
    let image_dto = usecase.execute(register_dto).await.map_err(|e| ApiCustomError::Other(anyhow::anyhow!("画像登録に失敗しました: {:?}", e)))?;

    // 4. ImageDTOをAPIレスポンスに変換
    let response = image_dto_to_response(image_dto);

    Ok(HttpResponse::Ok().json(response))
  }
}
