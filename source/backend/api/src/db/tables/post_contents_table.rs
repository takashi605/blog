use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

#[derive(Debug, FromRow)]
pub struct PostContentRecord {
  pub id: Uuid,
  pub content_type: String,
  pub sort_order: i32,
}

// content_type が何を表しているかを enum で表現
// content_type に match 式を使う時はこの enum を使う
pub enum PostContentType {
  Paragraph,
  Heading,
  Image,
}

impl TryFrom<String> for PostContentType {
  type Error = anyhow::Error;
  fn try_from(value: String) -> Result<PostContentType> {
    match value.as_str() {
      "heading" => Ok(PostContentType::Heading),
      "image" => Ok(PostContentType::Image),
      "paragraph" => Ok(PostContentType::Paragraph),
      // 何らかの理由で想定外の文字列が来る場合
      other => anyhow::bail!("unexpected content type: {}", other),
    }
  }
}

pub async fn fetch_post_contents_by_post_id(post_id: Uuid) -> Result<Vec<PostContentRecord>> {
  let contents =
    sqlx::query_as::<_, PostContentRecord>("select id, content_type, sort_order from post_contents where post_id = $1").bind(post_id).fetch_all(&*POOL).await?;
  Ok(contents)
}
