use core::panic;
use std::vec;

use crate::{
  db::tables::{
    blog_posts_table::{fetch_blog_post_by_id, BlogPostRecord},
    heading_blocks_table::HeadingBlockRecord,
    image_blocks_table::ImageBlockRecordWithRelations,
    images_table::{fetch_image_by_id, ImageRecord},
    paragraph_blocks_table::{ParagraphBlockRecordWithRelations, RichTextRecordWithStyles},
    post_contents_table::{fetch_any_content_block, fetch_post_contents_by_post_id, AnyContentBlockRecord, PostContentRecord},
  },
  server::handlers::response::err::ApiCustomError,
};
use anyhow::{Context, Result};
use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
use uuid::Uuid;

struct ContentWithOrder {
  sort_order: i32,
  content: PostContentRecord,
}
impl ContentWithOrder {
  fn new(sort_order: i32, content: PostContentRecord) -> Self {
    Self { sort_order, content }
  }
}

pub async fn fetch_single_blog_post(post_id: Uuid) -> Result<BlogPost, ApiCustomError> {
  let blog_post_record = fetch_blog_post_by_id(post_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorNotFound("ブログ記事が見つかりませんでした。"))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let thumbnail_record = fetch_image_by_id(blog_post_record.thumbnail_image_id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事のサムネイル画像の取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let content_records = fetch_post_contents_by_post_id(blog_post_record.id).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "ブログ記事コンテンツの取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;

  let sorted_content_records = sort_contents(content_records);
  let mut content_block_records: Vec<AnyContentBlockRecord> = vec![];
  for content_record in sorted_content_records {
    let content_block = fetch_any_content_block(content_record).await.context("コンテンツブロックの取得に失敗しました。").map_err(|err| {
      // RowNotFound なら 404、それ以外は 500
      if is_row_not_found(&err) {
        ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
          "コンテンツブロックの取得に失敗しました。(記事データの不整合)",
        ))
      } else {
        ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
      }
    })?;
    content_block_records.push(content_block);
  }

  let blog_post = generate_blog_post_response(blog_post_record, thumbnail_record, content_block_records).await.map_err(|err| {
    // RowNotFound なら 404、それ以外は 500
    if is_row_not_found(&err) {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(
        "コンテンツブロックの取得に失敗しました。(記事データの不整合)",
      ))
    } else {
      ApiCustomError::ActixWebError(actix_web::error::ErrorInternalServerError(err))
    }
  })?;
  Ok(blog_post)
}

// エラーが「データなし」のエラーかを判定する関数
fn is_row_not_found(err: &anyhow::Error) -> bool {
  // root_cause で一番根本のエラーを取得
  if let Some(sqlx::Error::RowNotFound) = err.root_cause().downcast_ref::<sqlx::Error>() {
    true
  } else {
    false
  }
}

async fn generate_blog_post_response(
  blog_post_record: BlogPostRecord,
  thumbnail_record: ImageRecord,
  content_block_records: Vec<AnyContentBlockRecord>,
) -> Result<BlogPost> {
  let contents = contents_to_response(content_block_records).await.context("ブログ記事コンテンツをレスポンス形式に変換できませんでした")?;

  Ok(BlogPost {
    id: blog_post_record.id,
    title: blog_post_record.title,
    thumbnail: Image {
      id: thumbnail_record.id,
      path: thumbnail_record.file_path,
    },
    post_date: blog_post_record.post_date,
    last_update_date: blog_post_record.last_update_date,
    contents,
  })
}

fn sort_contents(content_records: Vec<PostContentRecord>) -> Vec<PostContentRecord> {
  let mut content_with_order: Vec<ContentWithOrder> = vec![];

  for content_record in content_records {
    let sort_order = content_record.sort_order; // content が move される前に変数化

    content_with_order.push(ContentWithOrder::new(sort_order, content_record));
  }
  content_with_order.sort_by(|a, b| a.sort_order.cmp(&b.sort_order));
  content_with_order.into_iter().map(|content| content.content).collect::<Vec<PostContentRecord>>()
}

async fn contents_to_response(content_block_records: Vec<AnyContentBlockRecord>) -> Result<Vec<BlogPostContent>> {
  let mut contents: Vec<BlogPostContent> = vec![];
  for content_record in content_block_records {
    let content = content_to_response(content_record).await?;
    contents.push(content);
  }
  Ok(contents)
}

async fn content_to_response(content_block_record: AnyContentBlockRecord) -> Result<BlogPostContent> {
  let result = match content_block_record {
    AnyContentBlockRecord::HeadingBlockRecord(heading_block_record) => heading_to_response(heading_block_record),
    AnyContentBlockRecord::ImageBlockRecord(image_block_record_with_relations) => image_to_response(image_block_record_with_relations),
    AnyContentBlockRecord::ParagraphBlockRecord(paragraph_block_record_with_relations) => paragraph_to_response(paragraph_block_record_with_relations),
  };
  Ok(result)
}

fn heading_to_response(heading_block_record: HeadingBlockRecord) -> BlogPostContent {
  let heading_block_content: BlogPostContent = match heading_block_record.heading_level {
    2 => BlogPostContent::H2(H2Block {
      id: heading_block_record.id,
      text: heading_block_record.text_content,
      type_field: "h2".to_string(),
    }),
    3 => BlogPostContent::H3(H3Block {
      id: heading_block_record.id,
      text: heading_block_record.text_content,
      type_field: "h3".to_string(),
    }),
    _ => {
      panic!("見出しレベルが不正です。")
    }
  };
  heading_block_content
}

fn image_to_response(image_block_record: ImageBlockRecordWithRelations) -> BlogPostContent {
  BlogPostContent::Image(ImageBlock {
    id: image_block_record.image_block_record.id,
    path: image_block_record.image_record.file_path,
    type_field: "image".to_string(),
  })
}

fn paragraph_to_response(paragraph_block_record: ParagraphBlockRecordWithRelations) -> BlogPostContent {
  let rich_text_response: Vec<RichText> =
    paragraph_block_record.rich_text_records_with_styles.into_iter().map(|record| rich_text_to_response(record)).collect();

  BlogPostContent::Paragraph(ParagraphBlock {
    id: paragraph_block_record.paragraph_block.id,
    text: rich_text_response,
    type_field: "paragraph".to_string(),
  })
}

fn rich_text_to_response(rich_text_record_with_styles: RichTextRecordWithStyles) -> RichText {
  let styles = Style {
    bold: rich_text_record_with_styles.style_records.iter().any(|record| record.style_type == "bold"),
  };
  RichText {
    text: rich_text_record_with_styles.text_record.text_content,
    styles,
  }
}
