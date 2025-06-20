use uuid::Uuid;

use super::image_entity::ImageEntity;

// ファクトリの入力用構造体

#[derive(Debug)]
pub struct CreateImageInput {
    pub path: String,
}

// ImageFactory 構造体

pub struct ImageFactory;

impl ImageFactory {
    pub fn create(input: CreateImageInput) -> ImageEntity {
        // 新しいIDを生成
        let image_id = Uuid::new_v4();

        // ImageEntityを作成
        ImageEntity::new(image_id, input.path)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn ファクトリで基本的な画像作成() {
        let input = CreateImageInput {
            path: "images/test.jpg".to_string(),
        };

        let image = ImageFactory::create(input);

        assert_eq!(image.get_path(), "images/test.jpg");
        assert_ne!(image.get_id(), Uuid::nil());
        assert_eq!(image.get_id().get_version_num(), 4);
    }

    #[test]
    fn ファクトリがユニークなIDを自動生成する() {
        let input1 = CreateImageInput {
            path: "images/test1.jpg".to_string(),
        };
        let input2 = CreateImageInput {
            path: "images/test2.jpg".to_string(),
        };

        let image1 = ImageFactory::create(input1);
        let image2 = ImageFactory::create(input2);

        // 各画像が異なるIDを持つことを確認
        assert_ne!(image1.get_id(), image2.get_id());

        // IDがnilでないことを確認
        assert_ne!(image1.get_id(), Uuid::nil());
        assert_ne!(image2.get_id(), Uuid::nil());

        // IDがバージョン4 UUID（ランダム生成）であることを確認
        assert_eq!(image1.get_id().get_version_num(), 4);
        assert_eq!(image2.get_id().get_version_num(), 4);
    }

    #[test]
    fn 複数回実行しても毎回異なるIDが生成される() {
        let _input = CreateImageInput {
            path: "images/test.jpg".to_string(),
        };

        // 同じ入力で10回画像を生成
        let mut generated_ids = std::collections::HashSet::new();
        for _ in 0..10 {
            let image = ImageFactory::create(CreateImageInput {
                path: "images/test.jpg".to_string(),
            });

            // 重複するIDが生成されないことを確認
            assert!(generated_ids.insert(image.get_id()), "重複したIDが生成されました: {}", image.get_id());
        }

        // 10個の異なるIDが生成されたことを確認
        assert_eq!(generated_ids.len(), 10);
    }
}