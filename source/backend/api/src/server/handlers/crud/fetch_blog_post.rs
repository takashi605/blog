use core::panic;
use std::vec;

use crate::db::tables::{
  blog_posts_table::fetch_blog_post_by_id,
  heading_blocks_table::{fetch_heading_blocks_by_content_id, HeadingBlockRecord},
  image_blocks_table::{fetch_image_blocks_by_content_id, ImageBlockRecord},
  images_table::{fetch_image_by_id, ImageRecord},
  paragraph_blocks_table::{fetch_paragraph_block_by_content_id, fetch_rich_texts_by_paragraph, fetch_styles_by_rich_text_id, ParagraphBlockRecord, RichTextRecord, TextStyleRecord},
  post_contents_table::{fetch_post_contents_by_post_id, PostContentType},
};
use anyhow::{Context, Result};
use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
use uuid::Uuid;

struct ContentWithOrder {
  sort_order: i32,
  content: BlogPostContent,
}
impl ContentWithOrder {
  fn new(sort_order: i32, content: BlogPostContent) -> Self {
    Self { sort_order, content }
  }
}

pub async fn fetch_single_blog_post(post_id: Uuid) -> Result<BlogPost> {
  let blog_post = fetch_blog_post_by_id(post_id).await.context("ブログ記事の基本データの取得に失敗しました。")?;
  let contents = fetch_post_contents_by_post_id(blog_post.id).await.context("ブログ記事コンテンツの取得に失敗しました。")?;
  let thumbnail = fetch_image_by_id(blog_post.thumbnail_image_id).await.context("ブログ記事のサムネイル画像の取得に失敗しました。")?;
  let mut content_with_order: Vec<ContentWithOrder> = vec![];

  // TODO 関数に切り分ける
  for content in contents {
    let content_type_enum = PostContentType::try_from(content.content_type.clone()).context("コンテントタイプの変換に失敗しました。")?;
    let post_content = match content_type_enum {
      PostContentType::Heading => {
        let heading_block_record: HeadingBlockRecord = fetch_heading_blocks_by_content_id(content.id).await.context("見出しブロックの取得に失敗しました。")?;
        heading_to_response(heading_block_record)
      }
      PostContentType::Image => {
        let image_block_record = fetch_image_blocks_by_content_id(content.id).await.context("画像ブロックの取得に失敗しました。")?;
        let image = fetch_image_by_id(image_block_record.image_id).await.context("画像の取得に失敗しました。")?;
        image_to_response(image_block_record, image)
      }
      PostContentType::Paragraph => {
        let paragraph_block_record = fetch_paragraph_block_by_content_id(content.id).await.context("段落ブロックの取得に失敗しました。")?;
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
    content_with_order.push(ContentWithOrder::new(content.sort_order, post_content));
  }
  content_with_order.sort_by(|a, b| a.sort_order.cmp(&b.sort_order));
  let contents: Vec<BlogPostContent> = content_with_order.into_iter().map(|content| content.content).collect();

  Ok(BlogPost {
    id: blog_post.id,
    title: blog_post.title,
    thumbnail: Image { path: thumbnail.file_path },
    post_date: blog_post.post_date,
    last_update_date: blog_post.last_update_date,
    contents,
  })
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
  // TODO スタイルが増えた時のことが考えられていないので、修正が必要
  let styles = style_records
    .into_iter()
    .map(|style| Style {
      bold: style.style_type == "bold",
    })
    .collect();
  RichText {
    text: rich_text_record.text_content,
    styles,
  }
}
