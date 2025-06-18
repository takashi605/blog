use crate::{
  application::usecase::register_image::dto::RegisterImageDTO,
  domain::image_domain::image_factory::CreateImageInput,
};

/// RegisterImageDTOからドメイン層のCreateImageInputに変換
/// 
/// この変換により、APIリクエストからドメインファクトリへの入力が可能になります。
pub fn register_image_dto_to_create_input(dto: RegisterImageDTO) -> CreateImageInput {
  CreateImageInput {
    path: dto.path,
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_register_image_dto_to_create_input() {
    // テスト用RegisterImageDTOを作成
    let test_path = "/images/test_image.jpg".to_string();
    
    let dto = RegisterImageDTO {
      path: test_path.clone(),
    };

    // 変換実行
    let result = register_image_dto_to_create_input(dto);

    // 検証
    assert_eq!(result.path, test_path);
  }

  #[test]
  fn test_register_image_dto_to_create_input_with_special_characters() {
    // 特殊文字を含むパスでテスト
    let test_path = "/images/テスト_画像_ファイル名.jpg".to_string();
    
    let dto = RegisterImageDTO {
      path: test_path.clone(),
    };

    // 変換実行
    let result = register_image_dto_to_create_input(dto);

    // 検証
    assert_eq!(result.path, test_path);
  }

  #[test]
  fn test_register_image_dto_to_create_input_with_long_path() {
    // 長いパスでテスト
    let test_path = "/images/very/long/path/to/test/image/with/multiple/directories/and/subdirectories/final_image.jpg".to_string();
    
    let dto = RegisterImageDTO {
      path: test_path.clone(),
    };

    // 変換実行
    let result = register_image_dto_to_create_input(dto);

    // 検証
    assert_eq!(result.path, test_path);
  }
}