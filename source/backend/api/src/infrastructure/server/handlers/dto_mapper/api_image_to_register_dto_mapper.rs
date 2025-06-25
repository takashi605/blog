use crate::application::usecase::register_image::dto::RegisterImageDTO;
use common::types::api::CreateImageRequest;

/// APIのCreateImageRequest型からRegisterImageDTOに変換
///
/// この変換により、APIリクエストからアプリケーション層のDTOへの変換が可能になります。
/// IDフィールドを含まないリクエスト専用の型を使用します。
pub fn api_create_image_request_to_register_dto(image: CreateImageRequest) -> RegisterImageDTO {
  RegisterImageDTO { path: image.path }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_api_create_image_request_to_register_dto() {
    // テスト用CreateImageRequest作成
    let test_path = "/images/test_image.jpg".to_string();
    let api_request = CreateImageRequest { path: test_path.clone() };

    // 変換実行
    let result = api_create_image_request_to_register_dto(api_request);

    // 検証
    assert_eq!(result.path, test_path);
  }

  #[test]
  fn test_api_create_image_request_to_register_dto_with_special_characters() {
    // 特殊文字を含むパスでテスト
    let test_path = "/images/テスト_画像_ファイル名.jpg".to_string();
    let api_request = CreateImageRequest { path: test_path.clone() };

    // 変換実行
    let result = api_create_image_request_to_register_dto(api_request);

    // 検証
    assert_eq!(result.path, test_path);
  }

  #[test]
  fn test_api_create_image_request_to_register_dto_with_long_path() {
    // 長いパスでテスト
    let test_path = "/images/very/long/path/to/test/image/with/multiple/directories/and/subdirectories/final_image.jpg".to_string();
    let api_request = CreateImageRequest { path: test_path.clone() };

    // 変換実行
    let result = api_create_image_request_to_register_dto(api_request);

    // 検証
    assert_eq!(result.path, test_path);
  }
}
