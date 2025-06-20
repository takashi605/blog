use crate::application::dto::ImageDTO;
use crate::domain::image_domain::image_entity::ImageEntity;

pub fn convert_to_image_dto(image: ImageEntity) -> ImageDTO {
  ImageDTO {
    id: image.get_id(),
    path: image.get_path().to_string(),
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use uuid::Uuid;

  #[test]
  fn test_convert_basic_image_to_dto() {
    let image_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440001").unwrap();
    let image = ImageEntity::new(image_id, "images/test.jpg".to_string());

    let dto = convert_to_image_dto(image);

    assert_eq!(dto.id, image_id);
    assert_eq!(dto.path, "images/test.jpg");
  }

  #[test]
  fn test_convert_different_image_paths() {
    let test_cases = vec![
      ("images/photo.png", "PNG画像"),
      ("uploads/avatar.gif", "GIF画像"),
      ("media/screenshot.jpeg", "JPEG画像"),
      ("assets/logo.svg", "SVG画像"),
      ("", "空のパス"),
    ];

    for (path, description) in test_cases {
      let image_id = Uuid::new_v4();
      let image = ImageEntity::new(image_id, path.to_string());

      let dto = convert_to_image_dto(image);

      assert_eq!(dto.id, image_id, "{}のIDが正しく変換されていません", description);
      assert_eq!(dto.path, path, "{}のパスが正しく変換されていません", description);
    }
  }

  #[test]
  fn test_convert_with_special_characters() {
    let image_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440002").unwrap();
    let path_with_special_chars = "images/テスト画像_123-file.jpg";
    let image = ImageEntity::new(image_id, path_with_special_chars.to_string());

    let dto = convert_to_image_dto(image);

    assert_eq!(dto.id, image_id);
    assert_eq!(dto.path, path_with_special_chars);
  }

  #[test]
  fn test_convert_with_long_path() {
    let image_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440003").unwrap();
    let long_path = "very/deep/directory/structure/with/many/levels/image.jpg";
    let image = ImageEntity::new(image_id, long_path.to_string());

    let dto = convert_to_image_dto(image);

    assert_eq!(dto.id, image_id);
    assert_eq!(dto.path, long_path);
  }

  #[test]
  fn test_convert_preserves_uuid_format() {
    let image_id = Uuid::parse_str("12345678-1234-5678-9abc-123456789012").unwrap();
    let image = ImageEntity::new(image_id, "test.jpg".to_string());

    let dto = convert_to_image_dto(image);

    assert_eq!(dto.id, image_id);
    assert_eq!(dto.id.to_string(), "12345678-1234-5678-9abc-123456789012");
  }

  #[test]
  fn test_convert_multiple_images() {
    let images = vec![
      (Uuid::new_v4(), "image1.jpg"),
      (Uuid::new_v4(), "image2.png"),
      (Uuid::new_v4(), "image3.gif"),
    ];

    let dtos: Vec<ImageDTO> = images
      .into_iter()
      .map(|(id, path)| {
        let image = ImageEntity::new(id, path.to_string());
        convert_to_image_dto(image)
      })
      .collect();

    assert_eq!(dtos.len(), 3);
    assert_eq!(dtos[0].path, "image1.jpg");
    assert_eq!(dtos[1].path, "image2.png");
    assert_eq!(dtos[2].path, "image3.gif");
    
    // 各DTOが異なるIDを持つことを確認
    assert_ne!(dtos[0].id, dtos[1].id);
    assert_ne!(dtos[1].id, dtos[2].id);
    assert_ne!(dtos[0].id, dtos[2].id);
  }
}