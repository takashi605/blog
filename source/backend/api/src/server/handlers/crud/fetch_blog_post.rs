use core::panic;
use std::vec;

use crate::db::tables::{
  blog_posts_table::fetch_blog_post_by_id,
  heading_blocks_table::{fetch_heading_blocks_by_content_id, HeadingBlockRecord},
  image_blocks_table::{fetch_image_blocks_by_content_id, ImageBlockRecord},
  images_table::{fetch_image_by_id, ImageRecord},
  paragraph_blocks_table::{
    fetch_paragraph_block_by_content_id, fetch_rich_texts_by_paragraph, fetch_styles_by_rich_text_id, ParagraphBlockRecord, RichTextRecord, TextStyleRecord,
  },
  post_contents_table::{fetch_post_contents_by_post_id, PostContentRecord, PostContentType},
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

pub async fn fetch_single_blog_post(post_id: Uuid) -> Result<BlogPost> {
  let blog_post_record = fetch_blog_post_by_id(post_id).await.context("ブログ記事の基本データの取得に失敗しました。")?;
  let content_records = fetch_post_contents_by_post_id(blog_post_record.id).await.context("ブログ記事コンテンツの取得に失敗しました。")?;
  let thumbnail_record = fetch_image_by_id(blog_post_record.thumbnail_image_id).await.context("ブログ記事のサムネイル画像の取得に失敗しました。")?;
  let mut content_with_order: Vec<ContentWithOrder> = vec![];

  for content_record in content_records {
    let sort_order = content_record.sort_order; // content が move される前に変数化

    content_with_order.push(ContentWithOrder::new(sort_order, content_record));
  }
  content_with_order.sort_by(|a, b| a.sort_order.cmp(&b.sort_order));
  let sorted_content_records = content_with_order.into_iter().map(|content| content.content).collect::<Vec<PostContentRecord>>();

  let mut contents:Vec<BlogPostContent> = vec![];
  for content in sorted_content_records {
    let content = content_to_response(content).await?;
    contents.push(content);
  }

  Ok(BlogPost {
    id: blog_post_record.id,
    title: blog_post_record.title,
    thumbnail: Image { path: thumbnail_record.file_path },
    post_date: blog_post_record.post_date,
    last_update_date: blog_post_record.last_update_date,
    contents,
  })
}

async fn content_to_response(content_record: PostContentRecord) -> Result<BlogPostContent> {
  let content_type_enum = PostContentType::try_from(content_record.content_type.clone()).context("コンテントタイプの変換に失敗しました。")?;
  let result = match content_type_enum {
    PostContentType::Heading => {
      let heading_block_record: HeadingBlockRecord =
        fetch_heading_blocks_by_content_id(content_record.id).await.context("見出しブロックの取得に失敗しました。")?;
      heading_to_response(heading_block_record)
    }
    PostContentType::Image => {
      let image_block_record = fetch_image_blocks_by_content_id(content_record.id).await.context("画像ブロックの取得に失敗しました。")?;
      let image = fetch_image_by_id(image_block_record.image_id).await.context("画像の取得に失敗しました。")?;
      image_to_response(image_block_record, image)
    }
    PostContentType::Paragraph => {
      let paragraph_block_record = fetch_paragraph_block_by_content_id(content_record.id).await.context("段落ブロックの取得に失敗しました。")?;
      let rich_texts = fetch_rich_texts_by_paragraph(paragraph_block_record.id).await.context("リッチテキストの取得に失敗しました。")?;

      let mut rich_text_response: Vec<RichText> = vec![];
      for rich_text in rich_texts {
        let styles = fetch_styles_by_rich_text_id(rich_text.id).await.context("スタイルの取得に失敗しました。")?;
        let rich_text = rich_text_to_response(rich_text, styles);
        rich_text_response.push(rich_text);
      }

      paragraph_to_response(paragraph_block_record, rich_text_response)
    }
  };
  Ok(result)
}

fn heading_to_response(heading_block_record: HeadingBlockRecord) -> BlogPostContent {
  println!("heading_block_record: {:?}", heading_block_record);
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

fn image_to_response(image_block_record: ImageBlockRecord, image: ImageRecord) -> BlogPostContent {
  BlogPostContent::Image(ImageBlock {
    id: image_block_record.id,
    path: image.file_path,
    type_field: "image".to_string(),
  })
}

fn paragraph_to_response(paragraph_block_record: ParagraphBlockRecord, rich_texts: Vec<RichText>) -> BlogPostContent {
  BlogPostContent::Paragraph(ParagraphBlock {
    id: paragraph_block_record.id,
    text: rich_texts,
    type_field: "paragraph".to_string(),
  })
}

fn rich_text_to_response(rich_text_record: RichTextRecord, style_records: Vec<TextStyleRecord>) -> RichText {
  let styles = Style {
    bold: style_records.iter().any(|record| record.style_type == "bold"),
  };
  RichText {
    text: rich_text_record.text_content,
    styles,
  }
}
