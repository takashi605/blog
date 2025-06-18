use anyhow::Result;
use common::types::api::Image;
use sqlx::{Executor, FromRow, Postgres};
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct ImageRecord {
  pub id: Uuid,
  pub file_path: String,
}

pub async fn fetch_image_by_id(executor: impl Executor<'_, Database = Postgres>, id: Uuid) -> Result<ImageRecord> {
  let image = sqlx::query_as::<_, ImageRecord>("select id,file_path from images where id = $1").bind(id).fetch_one(executor).await?;
  Ok(image)
}

pub async fn fetch_all_images(executor: impl Executor<'_, Database = Postgres>) -> Result<Vec<ImageRecord>> {
  let images = sqlx::query_as::<_, ImageRecord>("select id, file_path from images").fetch_all(executor).await?;
  Ok(images)
}

pub async fn insert_image(executor: impl Executor<'_, Database = Postgres>, image: Image) -> Result<ImageRecord> {
  let image = sqlx::query_as::<_, ImageRecord>("insert into images (id, file_path) values ($1, $2) returning id, file_path")
    .bind(image.id)
    .bind(image.path)
    .fetch_one(executor)
    .await?;
  Ok(image)
}

impl From<Image> for ImageRecord {
  fn from(image: Image) -> Self {
    Self {
      id: image.id,
      file_path: image.path,
    }
  }
}

impl From<ImageRecord> for Image {
  fn from(record: ImageRecord) -> Self {
    Self {
      id: record.id,
      path: record.file_path,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use anyhow::Result;
  use common::types::api::Image;

  #[tokio::test(flavor = "current_thread")]
  async fn image_to_record_by_from_func() {
    let image_id: Uuid = Uuid::new_v4();
    let mock_image: Image = helper::create_image_mock(image_id).unwrap();
    let record = ImageRecord::from(mock_image);
    assert_eq!(record.id, image_id);
  }

  #[tokio::test(flavor = "current_thread")]
  async fn record_to_image_by_into_func() {
    let image_id: Uuid = Uuid::new_v4();
    let record = ImageRecord {
      id: image_id,
      file_path: "test-image".to_string(),
    };
    let image: Image = record.into();
    assert_eq!(image.id, image_id);
  }

  mod helper {
    use super::*;

    pub fn create_image_mock(id: Uuid) -> Result<Image> {
      Ok(Image {
        id,
        path: "test-image".to_string(),
      })
    }
  }
}