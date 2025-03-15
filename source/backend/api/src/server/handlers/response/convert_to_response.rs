use core::panic;
use std::vec;

use crate::db::tables::{
  blog_posts_table::BlogPostRecordWithRelations,
  heading_blocks_table::HeadingBlockRecord,
  image_blocks_table::ImageBlockRecordWithRelations,
  paragraph_blocks_table::{ParagraphBlockRecordWithRelations, RichTextRecordWithStyles},
  post_contents_table::AnyContentBlockRecord,
};
use anyhow::Result;
use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock, ParagraphBlock, RichText, Style};

pub async fn generate_blog_post_response(blog_post_record_with_relations: BlogPostRecordWithRelations) -> Result<BlogPost> {
  let blog_post_record = blog_post_record_with_relations.blog_post_record;
  let thumbnail_record = blog_post_record_with_relations.thumbnail_record;
  let content_block_records = blog_post_record_with_relations.content_block_records;

  let contents = contents_to_response(content_block_records).await?;

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
