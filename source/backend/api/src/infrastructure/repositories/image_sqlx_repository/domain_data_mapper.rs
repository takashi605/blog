use crate::domain::image_domain::ImageEntity;
use super::table::ImageRecord;

/// ImageRecordからImageEntityに変換する
pub fn convert_to_image_entity(record: ImageRecord) -> ImageEntity {
    ImageEntity::new(record.id, record.file_path)
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;

    #[test]
    fn test_convert_to_image_entity() {
        // テスト用のImageRecordを作成
        let image_id = Uuid::new_v4();
        let image_path = "images/test.jpg".to_string();
        let image_record = ImageRecord {
            id: image_id,
            file_path: image_path.clone(),
        };

        // 変換を実行
        let image_entity = convert_to_image_entity(image_record);

        // 変換結果を検証
        assert_eq!(image_entity.get_id(), image_id);
        assert_eq!(image_entity.get_path(), image_path);
    }

    #[test]
    fn test_convert_to_image_entity_with_different_paths() {
        // 異なるパスでのテスト
        let test_cases = vec![
            "images/photo.png",
            "uploads/document.pdf", 
            "media/video.mp4",
            "files/archive.zip"
        ];

        for path in test_cases {
            let image_id = Uuid::new_v4();
            let image_record = ImageRecord {
                id: image_id,
                file_path: path.to_string(),
            };
            let image_entity = convert_to_image_entity(image_record);

            assert_eq!(image_entity.get_id(), image_id);
            assert_eq!(image_entity.get_path(), path);
        }
    }

    #[test]
    fn test_convert_to_image_entity_preserves_data_integrity() {
        // データ整合性テスト - 変換が双方向で整合性を保つかテスト
        let original_id = Uuid::new_v4();
        let original_path = "test/path/image.jpg".to_string();
        
        // Record -> Entity -> Record の変換チェーン
        let original_record = ImageRecord {
            id: original_id,
            file_path: original_path.clone(),
        };
        
        let entity = convert_to_image_entity(original_record);
        let converted_record = super::super::record_mapper::convert_from_image_entity(&entity);
        
        // 元のデータと変換後のデータが一致することを確認
        assert_eq!(converted_record.id, original_id);
        assert_eq!(converted_record.file_path, original_path);
    }
}