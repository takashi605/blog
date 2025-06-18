// 画像リポジトリモジュール
pub mod domain_data_mapper;
pub mod record_mapper;
pub mod table;

// 公開する必要のある型をre-export
pub use domain_data_mapper::*;
pub use record_mapper::*;
pub use table::*;

use sqlx::PgPool;
use uuid::Uuid;

use crate::{
  domain::image_domain::{
    image_entity::ImageEntity,
    image_repository::{ImageRepository, ImageRepositoryError},
  },
  infrastructure::repositories::image_sqlx_repository::table::images_table::{fetch_image_by_id, insert_image},
};

/// SQLxを使用したImageRepositoryの実装
pub struct ImageSqlxRepository {
  pool: PgPool,
}

impl ImageSqlxRepository {
  /// 新しいImageSqlxRepositoryインスタンスを作成する
  pub fn new(pool: PgPool) -> Self {
    Self { pool }
  }
}

#[async_trait::async_trait]
impl ImageRepository for ImageSqlxRepository {
  async fn find(&self, id: &str) -> Result<ImageEntity, ImageRepositoryError> {
    let image_id = Uuid::parse_str(id).map_err(|_| ImageRepositoryError::FindFailed(format!("無効なUUID形式のIDです: {}", id)))?;

    // 画像情報を取得
    let image_record = fetch_image_by_id(&self.pool, image_id).await.map_err(|err| {
      // SQLx の RowNotFound エラーを特定してカスタムエラーに変換
      if let Some(sqlx_err) = err.downcast_ref::<sqlx::Error>() {
        if matches!(sqlx_err, sqlx::Error::RowNotFound) {
          return ImageRepositoryError::FindFailed(format!("ImageNotFound:{}", id));
        }
      }
      ImageRepositoryError::FindFailed(format!("画像の取得に失敗しました: {}", err))
    })?;

    // エンティティに変換
    let image_entity = convert_to_image_entity(image_record);
    Ok(image_entity)
  }

  async fn save(&self, image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
    // ImageEntityをImageRecordに変換
    let image_record = convert_from_image_entity(&image);
    
    // common::types::api::Imageに変換（insert_image関数が期待する型）
    let api_image = common::types::api::Image {
      id: image_record.id,
      path: image_record.file_path,
    };
    
    // データベースに挿入
    let saved_record = insert_image(&self.pool, api_image).await.map_err(|err| {
      ImageRepositoryError::SaveFailed(format!("画像の保存に失敗しました: {}", err))
    })?;
    
    // 保存されたレコードをImageEntityに変換して返す
    let saved_entity = convert_to_image_entity(saved_record);
    Ok(saved_entity)
  }

  async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
    // 全画像を取得
    let image_records = crate::infrastructure::repositories::image_sqlx_repository::table::images_table::fetch_all_images(&self.pool).await.map_err(|err| {
      ImageRepositoryError::FindAllFailed(format!("全画像の取得に失敗しました: {}", err))
    })?;

    // ImageRecordのVecをImageEntityのVecに変換
    let image_entities = image_records
      .into_iter()
      .map(convert_to_image_entity)
      .collect();

    Ok(image_entities)
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::infrastructure::repositories::db_pool::create_db_pool;

  /// テスト用に画像レコードを事前挿入するヘルパー関数
  async fn insert_test_image(pool: &PgPool, image_id: Uuid, file_path: &str) -> anyhow::Result<()> {
    sqlx::query("INSERT INTO images (id, file_path) VALUES ($1, $2) ON CONFLICT (file_path) DO NOTHING").bind(image_id).bind(file_path).execute(pool).await?;
    Ok(())
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_find_image_success() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool.clone());

    // テスト用画像を事前挿入
    let test_image_id = Uuid::new_v4();
    let test_file_path = format!("/images/test_{}.jpg", Uuid::new_v4());
    insert_test_image(&pool, test_image_id, &test_file_path).await.expect("テスト用画像の挿入に失敗しました");

    // findメソッドを実行
    let result = repository.find(&test_image_id.to_string()).await;

    // 結果を検証
    assert!(result.is_ok(), "find操作が失敗しました: {:?}", result.err());
    let found_image = result.unwrap();

    // 基本情報の検証
    assert_eq!(found_image.get_id(), test_image_id);
    assert_eq!(found_image.get_path(), test_file_path);
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_find_image_not_found() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool);

    // 存在しないUUIDでfindメソッドを実行
    let non_existent_id = Uuid::new_v4();
    let result = repository.find(&non_existent_id.to_string()).await;

    // エラーが返されることを検証
    assert!(result.is_err(), "存在しない画像IDでfindを実行した場合、エラーが返されるべきです");

    if let Err(ImageRepositoryError::FindFailed(message)) = result {
      assert!(
        message.contains("ImageNotFound"),
        "エラーメッセージにImageNotFoundが含まれているべきです: {}",
        message
      );
    } else {
      panic!("期待されるエラータイプではありません: {:?}", result.err());
    }
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_find_image_invalid_uuid() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool);

    // 無効なUUID形式でfindメソッドを実行
    let result = repository.find("invalid-uuid").await;

    // エラーが返されることを検証
    assert!(result.is_err(), "無効なUUID形式でfindを実行した場合、エラーが返されるべきです");

    if let Err(ImageRepositoryError::FindFailed(message)) = result {
      assert!(
        message.contains("無効なUUID形式"),
        "エラーメッセージに無効なUUID形式の説明が含まれているべきです: {}",
        message
      );
    } else {
      panic!("期待されるエラータイプではありません: {:?}", result.err());
    }
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_save_image_success() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool);

    // テスト用ImageEntityを作成
    let test_image_id = Uuid::new_v4();
    let test_file_path = format!("/images/save_test_{}.jpg", Uuid::new_v4());
    let test_image = crate::domain::image_domain::image_entity::ImageEntity::new(test_image_id, test_file_path.clone());

    // saveメソッドを実行
    let result = repository.save(test_image).await;

    // 結果を検証
    assert!(result.is_ok(), "save操作が失敗しました: {:?}", result.err());
    let saved_image = result.unwrap();

    // 基本情報の検証
    assert_eq!(saved_image.get_id(), test_image_id);
    assert_eq!(saved_image.get_path(), test_file_path);
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_save_and_find_image_roundtrip() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool);

    // テスト用ImageEntityを作成
    let test_image_id = Uuid::new_v4();
    let test_file_path = format!("/images/roundtrip_test_{}.jpg", Uuid::new_v4());
    let original_image = crate::domain::image_domain::image_entity::ImageEntity::new(test_image_id, test_file_path.clone());

    // saveメソッドを実行
    let save_result = repository.save(original_image).await;
    assert!(save_result.is_ok(), "save操作が失敗しました: {:?}", save_result.err());

    // findメソッドで保存したデータを取得
    let find_result = repository.find(&test_image_id.to_string()).await;
    assert!(find_result.is_ok(), "find操作が失敗しました: {:?}", find_result.err());
    let found_image = find_result.unwrap();

    // 元のデータと取得したデータを比較
    assert_eq!(found_image.get_id(), test_image_id);
    assert_eq!(found_image.get_path(), test_file_path);
  }

  #[tokio::test]
  #[ignore] // 実際のデータベースが必要なため、通常は無視
  async fn test_find_all_images() {
    // テスト用データベースプールを作成
    let pool = create_db_pool().await.expect("データベースプールの作成に失敗しました");
    let repository = ImageSqlxRepository::new(pool.clone());

    // テスト用画像を複数保存
    let test_image1_id = Uuid::new_v4();
    let test_file_path1 = format!("/images/find_all_test1_{}.jpg", Uuid::new_v4());
    let test_image1 = crate::domain::image_domain::image_entity::ImageEntity::new(test_image1_id, test_file_path1.clone());
    
    let test_image2_id = Uuid::new_v4();
    let test_file_path2 = format!("/images/find_all_test2_{}.jpg", Uuid::new_v4());
    let test_image2 = crate::domain::image_domain::image_entity::ImageEntity::new(test_image2_id, test_file_path2.clone());

    // 画像を保存
    let save_result1 = repository.save(test_image1).await;
    assert!(save_result1.is_ok(), "画像1の保存操作が失敗しました: {:?}", save_result1.err());
    
    let save_result2 = repository.save(test_image2).await;
    assert!(save_result2.is_ok(), "画像2の保存操作が失敗しました: {:?}", save_result2.err());

    // find_allメソッドを実行
    let find_all_result = repository.find_all().await;
    assert!(find_all_result.is_ok(), "find_all操作が失敗しました: {:?}", find_all_result.err());
    
    let all_images = find_all_result.unwrap();
    
    // 保存した画像が含まれていることを確認（データベースには他の画像もある可能性があるため、最低限の検証）
    assert!(all_images.len() >= 2, "find_allで取得した画像数が期待値を下回っています");
    
    // 保存した画像が結果に含まれていることを確認
    let found_image1 = all_images.iter().find(|img| img.get_id() == test_image1_id);
    let found_image2 = all_images.iter().find(|img| img.get_id() == test_image2_id);
    
    assert!(found_image1.is_some(), "保存した画像1がfind_allの結果に含まれていません");
    assert!(found_image2.is_some(), "保存した画像2がfind_allの結果に含まれていません");
    
    assert_eq!(found_image1.unwrap().get_path(), test_file_path1);
    assert_eq!(found_image2.unwrap().get_path(), test_file_path2);
  }
}
