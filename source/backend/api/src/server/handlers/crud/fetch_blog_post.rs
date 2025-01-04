use core::panic;
use std::vec;

use crate::db::tables::{
  blog_posts_table::fetch_blog_post_by_id,
  heading_blocks_table::{fetch_heading_blocks_by_content_id, HeadingBlockRecord},
  image_blocks_table::fetch_image_blocks_by_content_id,
  images_table::fetch_image_by_id,
  paragraph_blocks_table::{fetch_paragraph_block_by_content_id, fetch_rich_texts_by_paragraph, fetch_styles_by_rich_text_id},
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
    match content_type_enum {
      PostContentType::Heading => {
        let heading_block_record: HeadingBlockRecord = fetch_heading_blocks_by_content_id(content.id).await.context("見出しブロックの取得に失敗しました。")?;
        let heading_block_content: BlogPostContent = heading_to_response(heading_block_record);
        content_with_order.push(ContentWithOrder::new(content.sort_order, heading_block_content));
      }
      PostContentType::Image => {
        let image_block = fetch_image_blocks_by_content_id(content.id).await.context("画像ブロックの取得に失敗しました。")?;

        let image = fetch_image_by_id(image_block.image_id).await.context("画像の取得に失敗しました。")?;
        let image_block = ImageBlock {
          id: image_block.id,
          path: image.file_path,
          type_field: "image".to_string(),
        };
        content_with_order.push(ContentWithOrder {
          sort_order: content.sort_order,
          content: BlogPostContent::Image(image_block),
        });
      }
      PostContentType::Paragraph => {
        let paragraph_block = fetch_paragraph_block_by_content_id(content.id).await.context("段落ブロックの取得に失敗しました。")?;
        let rich_texts = fetch_rich_texts_by_paragraph(paragraph_block.id).await.context("リッチテキストの取得に失敗しました。")?;
        for rich_text in rich_texts {
          let styles = fetch_styles_by_rich_text_id(rich_text.id).await.context("スタイルの取得に失敗しました。")?;
          let paragraph_block = ParagraphBlock {
            id: paragraph_block.id,
            text: RichText {
              text: rich_text.text_content,
              styles: styles
                .into_iter()
                .map(|style| Style {
                  bold: style.style_type == "bold",
                })
                .collect(),
            },
            type_field: "paragraph".to_string(),
          };
          content_with_order.push(ContentWithOrder {
            sort_order: content.sort_order,
            content: BlogPostContent::Paragraph(paragraph_block),
          });
        }
      }
    }
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
