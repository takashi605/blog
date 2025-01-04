use core::panic;
use std::vec;

use crate::db::tables::{
  blog_posts_table::fetch_blog_post_by_id,
  heading_blocks_table::fetch_heading_blocks_by_content_id,
  image_blocks_table::fetch_image_blocks_by_content_id,
  images_table::fetch_image_by_id,
  post_contents_table::fetch_post_contents_by_post_id,
};
use anyhow::{Context, Result};
use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock};
use uuid::Uuid;

struct ContentWithOrder {
  sort_order: i32,
  content: BlogPostContent,
}

pub async fn fetch_single_blog_post(post_id: Uuid) -> Result<BlogPost> {
  let blog_post = fetch_blog_post_by_id(post_id).await.context("ブログ記事の基本データの取得に失敗しました。")?;
  let contents = fetch_post_contents_by_post_id(blog_post.id).await.context("ブログ記事コンテンツの取得に失敗しました。")?;
  let thumbnail = fetch_image_by_id(blog_post.thumbnail_image_id).await.context("ブログ記事のサムネイル画像の取得に失敗しました。")?;
  let mut content_with_order: Vec<ContentWithOrder> = vec![];
  // TODO コンテントタイプが enum にできないか検討
  for content in contents {
    match content.content_type.as_str() {
      "heading" => {
        let heading_block = fetch_heading_blocks_by_content_id(content.id).await.context("見出しブロックの取得に失敗しました。")?;
        for heading in heading_block {
          let heading_block = match heading.heading_level {
            2 => BlogPostContent::H2(H2Block {
              id: heading.id,
              text: heading.text_content,
              type_field: "h2".to_string(),
            }),
            3 => BlogPostContent::H3(H3Block {
              id: heading.id,
              text: heading.text_content,
              type_field: "h3".to_string(),
            }),
            _ => {
              panic!("見出しレベルが不正です。")
            }
          };
          content_with_order.push(ContentWithOrder {
            sort_order: content.sort_order,
            content: heading_block,
          });
        }
      }
      "image" => {
        let image_blocks = fetch_image_blocks_by_content_id(content.id).await.context("画像ブロックの取得に失敗しました。")?;
        for image_block in image_blocks {
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
      }
      // "paragraph" => {
      //   let paragraph_block = fetch_paragraph_block_by_content_id(content.id).await.context("段落ブロックの取得に失敗しました。")?;
      //   paragraph_block_records.push(paragraph_block);
      //   let rich_texts = fetch_rich_texts_by_paragraph(paragraph_block.id).await.context("リッチテキストの取得に失敗しました。")?;
      //   for text in rich_text_styles {
      //     let styles = fetch_styles_by_rich_text_id(text.id).await.context("リッチテキストのスタイルの取得に失敗しました。")?;
      //     rich_text_styles.extend(styles);
      //   }
      // }
      // TODO 全てのコンテントタイプは明示的に処理する
      _ => {}
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
