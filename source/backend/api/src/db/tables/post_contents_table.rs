use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

use super::{heading_blocks_table::HeadingBlockRecord, image_blocks_table::ImageBlockRecord, paragraph_blocks_table::ParagraphBlockRecordWithRelations};

/*
 * 各レコードの関連をまとめた構造体
 */
// PostContentRecord の id を元に取得される、より具体的なコンテンツのレコード
pub enum AnyContentBlockRecord {
  HeadingBlockRecord(HeadingBlockRecord),
  ParagraphBlockRecord(ParagraphBlockRecordWithRelations),
  ImageBlockRecord(ImageBlockRecord),
}

/*
 * DB内の各テーブル構造に紐づく構造体正義
 */
#[derive(Debug, FromRow)]
pub struct PostContentRecord {
  pub id: Uuid,
  pub post_id: Uuid,
  pub content_type: String,
  pub sort_order: i32,
}

/*
 * テーブル構造体の操作を便利にするための構造体・関数
 */
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

/*
 * データベース操作関数
 */
pub async fn fetch_post_contents_by_post_id(post_id: Uuid) -> Result<Vec<PostContentRecord>> {
  let contents =
    sqlx::query_as::<_, PostContentRecord>("select id, post_id, content_type, sort_order from post_contents where post_id = $1").bind(post_id).fetch_all(&*POOL).await?;
  Ok(contents)
}

pub async fn insert_blog_post_content(content: PostContentRecord) -> Result<()> {
  sqlx::query("insert into post_contents (id, post_id, content_type, sort_order) values ($1, $2, $3, $4)")
    .bind(content.id)
    .bind(content.post_id)
    .bind(content.content_type)
    .bind(content.sort_order)
    .execute(&*POOL)
    .await?;
  Ok(())
}
