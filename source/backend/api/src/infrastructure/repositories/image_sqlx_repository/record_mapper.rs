use super::table::ImageRecord;
use crate::domain::image_domain::ImageEntity;

/// ImageEntityからImageRecordに変換する
pub fn convert_from_image_entity(entity: &ImageEntity) -> ImageRecord {
  ImageRecord {
    id: entity.get_id(),
    file_path: entity.get_path().to_string(),
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use uuid::Uuid;

  #[test]
  fn test_convert_from_image_entity() {
    // テスト用のImageEntityを作成
    let image_id = Uuid::new_v4();
    let image_path = "images/test.jpg".to_string();
    let image_entity = ImageEntity::new(image_id, image_path.clone());

    // 変換を実行
    let image_record = convert_from_image_entity(&image_entity);

    // 変換結果を検証
    assert_eq!(image_record.id, image_id);
    assert_eq!(image_record.file_path, image_path);
  }

  #[test]
  fn test_convert_from_image_entity_with_different_paths() {
    // 異なるパスでのテスト
    let test_cases = vec!["images/photo.png", "uploads/document.pdf", "media/video.mp4", "files/archive.zip"];

    for path in test_cases {
      let image_id = Uuid::new_v4();
      let image_entity = ImageEntity::new(image_id, path.to_string());
      let image_record = convert_from_image_entity(&image_entity);

      assert_eq!(image_record.id, image_id);
      assert_eq!(image_record.file_path, path);
    }
  }
}
