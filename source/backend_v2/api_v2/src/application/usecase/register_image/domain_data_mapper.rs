use crate::domain::image_domain::image_factory::CreateImageInput;

use super::dto::RegisterImageDTO;

// DTO -> ドメイン変換関数

/// RegisterImageDTOをCreateImageInputに変換する
pub fn convert_dto_to_domain_input(dto: RegisterImageDTO) -> CreateImageInput {
    CreateImageInput { path: dto.path }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_convert_basic_register_image_dto() {
        let dto = RegisterImageDTO {
            path: "images/test.jpg".to_string(),
        };

        let domain_input = convert_dto_to_domain_input(dto);

        assert_eq!(domain_input.path, "images/test.jpg");
    }

    #[test]
    fn test_convert_different_image_paths() {
        let test_cases = vec![
            "images/photo.png",
            "uploads/avatar.gif", 
            "media/screenshot.jpeg",
            "assets/logo.svg",
        ];

        for path in test_cases {
            let dto = RegisterImageDTO {
                path: path.to_string(),
            };

            let domain_input = convert_dto_to_domain_input(dto);

            assert_eq!(domain_input.path, path);
        }
    }

    #[test]
    fn test_convert_empty_path() {
        let dto = RegisterImageDTO {
            path: "".to_string(),
        };

        let domain_input = convert_dto_to_domain_input(dto);

        assert_eq!(domain_input.path, "");
    }

    #[test]
    fn test_convert_with_special_characters() {
        let path_with_special_chars = "images/テスト画像_123-file.jpg";
        let dto = RegisterImageDTO {
            path: path_with_special_chars.to_string(),
        };

        let domain_input = convert_dto_to_domain_input(dto);

        assert_eq!(domain_input.path, path_with_special_chars);
    }

    #[test]
    fn test_dto_clone_capability() {
        let dto = RegisterImageDTO {
            path: "images/test.jpg".to_string(),
        };

        let dto_clone = dto.clone();

        assert_eq!(dto.path, dto_clone.path);
        
        // 元のDTOとクローンが独立していることを確認
        let domain_input1 = convert_dto_to_domain_input(dto);
        let domain_input2 = convert_dto_to_domain_input(dto_clone);

        assert_eq!(domain_input1.path, domain_input2.path);
    }
}