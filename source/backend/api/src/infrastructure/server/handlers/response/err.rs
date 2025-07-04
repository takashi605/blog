use actix_web::{body::BoxBody, http::StatusCode, HttpResponse, ResponseError};
use common::types::api::ErrResponse;

#[derive(thiserror::Error, Debug)]
pub enum ApiCustomError {
  #[error("未定義の URL です。")]
  NotFoundURL,

  #[error("ブログ記事が見つかりませんでした。")]
  BlogPostNotFound(String),

  #[error("バリデーションエラー: {0}")]
  ValidationError(String),

  #[error(transparent)]
  ActixWebError(#[from] actix_web::Error),

  #[error(transparent)]
  Other(anyhow::Error),
}

impl ResponseError for ApiCustomError {
  /// ステータスコード
  fn status_code(&self) -> actix_web::http::StatusCode {
    match self {
      ApiCustomError::NotFoundURL => StatusCode::NOT_FOUND,
      ApiCustomError::BlogPostNotFound(_) => StatusCode::NOT_FOUND,
      ApiCustomError::ValidationError(_) => StatusCode::BAD_REQUEST,
      ApiCustomError::ActixWebError(err) => err.as_response_error().status_code(),
      ApiCustomError::Other(_) => StatusCode::INTERNAL_SERVER_ERROR,
    }
  }

  /// エラーレスポンス
  fn error_response(&self) -> HttpResponse<BoxBody> {
    match self {
      ApiCustomError::NotFoundURL => HttpResponse::build(self.status_code()).json(ErrResponse { message: format!("{}", self) }),
      ApiCustomError::BlogPostNotFound(_) => HttpResponse::build(self.status_code()).json(ErrResponse { message: format!("{}", self) }),
      ApiCustomError::ValidationError(message) => HttpResponse::build(self.status_code()).json(ErrResponse { message: message.clone() }),
      ApiCustomError::ActixWebError(err) => {
        let message = match self.status_code() {
          StatusCode::NOT_FOUND => "Not Found.",
          _ => "Bad Request.",
        };
        HttpResponse::build(self.status_code()).json(ErrResponse {
          message: format!("{} [{}]", message, err),
        })
      }
      ApiCustomError::Other(err) => HttpResponse::build(self.status_code()).json(ErrResponse {
        message: format!("Internal Server Error. [{}]", err),
      }),
    }
  }
}
