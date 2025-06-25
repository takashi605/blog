use crate::application::dto::ImageDTO;
use common::types::api::Image;

/// ImageDTOをAPIレスポンス用のImageに変換
pub fn image_dto_to_response(dto: ImageDTO) -> Image {
  Image { id: dto.id, path: dto.path }
}

/// ImageDTOのVecをAPIレスポンス用のImageのVecに変換
pub fn image_dto_list_to_response(dto_list: Vec<ImageDTO>) -> Vec<Image> {
  dto_list.into_iter().map(image_dto_to_response).collect()
}

#[cfg(test)]
mod tests {
  use super::*;
  use uuid::Uuid;

  #[test]
  fn test_image_dto_to_response() {
    // テスト用ImageDTOを作成
    let test_id = Uuid::new_v4();
    let test_path = "/images/test_image.jpg".to_string();

    let dto = ImageDTO {
      id: test_id,
      path: test_path.clone(),
    };

    // 変換実行
    let result = image_dto_to_response(dto);

    // 検証
    assert_eq!(result.id, test_id);
    assert_eq!(result.path, test_path);
  }

  #[test]
  fn test_image_dto_list_to_response() {
    // テスト用ImageDTOリストを作成
    let test_id1 = Uuid::new_v4();
    let test_id2 = Uuid::new_v4();
    let test_path1 = "/images/test1.jpg".to_string();
    let test_path2 = "/images/test2.png".to_string();

    let dto_list = vec![
      ImageDTO {
        id: test_id1,
        path: test_path1.clone(),
      },
      ImageDTO {
        id: test_id2,
        path: test_path2.clone(),
      },
    ];

    // 変換実行
    let result = image_dto_list_to_response(dto_list);

    // 検証
    assert_eq!(result.len(), 2);
    assert_eq!(result[0].id, test_id1);
    assert_eq!(result[0].path, test_path1);
    assert_eq!(result[1].id, test_id2);
    assert_eq!(result[1].path, test_path2);
  }

  #[test]
  fn test_image_dto_list_to_response_empty() {
    // 空のリストでテスト
    let dto_list: Vec<ImageDTO> = vec![];

    // 変換実行
    let result = image_dto_list_to_response(dto_list);

    // 検証
    assert_eq!(result.len(), 0);
  }

  #[test]
  fn test_image_dto_to_response_with_special_characters() {
    // 特殊文字を含むパスでテスト
    let test_id = Uuid::new_v4();
    let test_path = "/images/test_画像_ファイル名.jpg".to_string();

    let dto = ImageDTO {
      id: test_id,
      path: test_path.clone(),
    };

    // 変換実行
    let result = image_dto_to_response(dto);

    // 検証
    assert_eq!(result.id, test_id);
    assert_eq!(result.path, test_path);
  }
}
