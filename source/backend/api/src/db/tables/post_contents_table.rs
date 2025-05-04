use anyhow::{Context, Result};
use sqlx::FromRow;
use uuid::Uuid;

use crate::db::pool::POOL;

use super::{
  code_blocks_table::{fetch_code_block_by_content_id, CodeBlockRecord},
  heading_blocks_table::{fetch_heading_blocks_by_content_id, HeadingBlockRecord},
  image_blocks_table::{fetch_image_block_record_with_relations, ImageBlockRecordWithRelations},
  paragraph_blocks_table::{fetch_paragraph_block_record_with_relations, ParagraphBlockRecordWithRelations},
};

/*
 * 各レコードの関連をまとめた構造体
 */
// PostContentRecord の id を元に取得される、より具体的なコンテンツのレコード
#[derive(Debug)]
pub enum AnyContentBlockRecord {
  HeadingBlockRecord(HeadingBlockRecord),
  ParagraphBlockRecord(ParagraphBlockRecordWithRelations),
  ImageBlockRecord(ImageBlockRecordWithRelations),
  CodeBlockRecord(CodeBlockRecord),
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
  CodeBlock,
}

impl TryFrom<String> for PostContentType {
  type Error = anyhow::Error;
  fn try_from(value: String) -> Result<PostContentType> {
    match value.as_str() {
      "heading" => Ok(PostContentType::Heading),
      "image" => Ok(PostContentType::Image),
      "paragraph" => Ok(PostContentType::Paragraph),
      "code_block" => Ok(PostContentType::CodeBlock),
      // 何らかの理由で想定外の文字列が来る場合
      other => anyhow::bail!("想定しない content type: {}", other),
    }
  }
}

/*
 * データベース操作関数
 */
pub async fn fetch_any_content_block(content_record: PostContentRecord) -> Result<AnyContentBlockRecord> {
  let content_type_enum = PostContentType::try_from(content_record.content_type.clone()).context("コンテントタイプの変換に失敗しました。")?;
  let result = match content_type_enum {
    PostContentType::Heading => {
      let heading_block_record: HeadingBlockRecord =
        fetch_heading_blocks_by_content_id(&*POOL,content_record.id).await.context("見出しブロックの取得に失敗しました。")?;
      AnyContentBlockRecord::HeadingBlockRecord(heading_block_record)
    }
    PostContentType::Image => {
      let image_block_record_with_relations: ImageBlockRecordWithRelations =
        fetch_image_block_record_with_relations(content_record.id).await.context("関連を含む画像レコードの取得に失敗しました。")?;
      AnyContentBlockRecord::ImageBlockRecord(image_block_record_with_relations)
    }
    PostContentType::Paragraph => {
      let paragraph_block_record: ParagraphBlockRecordWithRelations =
        fetch_paragraph_block_record_with_relations(content_record.id).await.context("関連レコードを含む段落ブロックレコードの取得に失敗しました。")?;
      AnyContentBlockRecord::ParagraphBlockRecord(paragraph_block_record)
    }
    PostContentType::CodeBlock => {
      let code_block_record: CodeBlockRecord = fetch_code_block_by_content_id(&*POOL, content_record.id).await.context("コードブロックの取得に失敗しました。")?;
      AnyContentBlockRecord::CodeBlockRecord(CodeBlockRecord {
        id: code_block_record.id,
        title: code_block_record.title,
        code: code_block_record.code,
        language: code_block_record.language,
      })
    }
  };
  Ok(result)
}
pub async fn fetch_post_contents_by_post_id(post_id: Uuid) -> Result<Vec<PostContentRecord>> {
  let contents = sqlx::query_as::<_, PostContentRecord>("select id, post_id, content_type, sort_order from post_contents where post_id = $1")
    .bind(post_id)
    .fetch_all(&*POOL)
    .await?;
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
