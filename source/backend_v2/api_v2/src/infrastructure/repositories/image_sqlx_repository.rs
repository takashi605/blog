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
  infrastructure::repositories::image_sqlx_repository::table::images_table::fetch_image_by_id,
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

  async fn save(&self, _image: ImageEntity) -> Result<ImageEntity, ImageRepositoryError> {
    todo!("saveメソッドは後で実装します")
  }

  async fn find_all(&self) -> Result<Vec<ImageEntity>, ImageRepositoryError> {
    todo!("find_allメソッドは後で実装します")
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
}
