pub mod blog_posts_table;
pub mod heading_blocks_table;
pub mod image_blocks_table;
pub mod images_table;
pub mod paragraph_blocks_table;
pub mod post_contents_table;

use anyhow::Result;
use blog_posts_table::BlogPostRecord;
use common::types::api::response::{BlogPost, BlogPostContent};
use heading_blocks_table::HeadingBlockRecord;
use paragraph_blocks_table::ParagraphBlockRecord;
use post_contents_table::PostContentRecord;

pub fn records_from_blog_post(post: BlogPost) -> Result<(BlogPostRecord, Vec<PostContentRecord>, Vec<HeadingBlockRecord>, Vec<ParagraphBlockRecord>)> {
  let blog_post_record = BlogPostRecord {
    id: post.id,
    title: post.title,
    thumbnail_image_id: post.thumbnail.id,
    post_date: post.post_date,
    last_update_date: post.last_update_date,
  };
  let mut post_content_records: Vec<PostContentRecord> = vec![];
  let mut heading_block_records: Vec<HeadingBlockRecord> = vec![];
  let mut paragraph_block_records: Vec<ParagraphBlockRecord> = vec![];

  post.contents.into_iter().enumerate().try_for_each(|(index, content)| -> Result<(), anyhow::Error> {
    let content_record = match content {
      BlogPostContent::Paragraph(paragraph) => {
        paragraph_block_records.push(ParagraphBlockRecord { id: paragraph.id });
        PostContentRecord {
          id: paragraph.id,
          content_type: "paragraph".to_string(),
          sort_order: index as i32,
        }
      }
      BlogPostContent::H2(h2) => {
        heading_block_records.push(HeadingBlockRecord {
          id: h2.id,
          heading_level: 2,
          text_content: h2.text,
        });
        PostContentRecord {
          id: h2.id,
          content_type: "h2".to_string(),
          sort_order: index as i32,
        }
      }
      BlogPostContent::H3(h3) => {
        heading_block_records.push(HeadingBlockRecord {
          id: h3.id,
          heading_level: 3,
          text_content: h3.text,
        });
        PostContentRecord {
          id: h3.id,
          content_type: "h3".to_string(),
          sort_order: index as i32,
        }
      }
      BlogPostContent::Image(_image) => {
        anyhow::bail!("イメージブロックへの変換は未実装です。");
      }
    };
    post_content_records.push(content_record);
    Ok(())
  })?;

  Ok((blog_post_record, post_content_records, heading_block_records, paragraph_block_records))
}

#[cfg(test)]
mod tests {
  use crate::db::tables::paragraph_blocks_table::ParagraphBlockRecord;

  use super::*;
  use anyhow::Result;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn blog_post_to_records() -> Result<()> {
    let post_id: Uuid = Uuid::new_v4();
    let mock_post: BlogPost = helper::create_blog_post_mock(post_id).unwrap();

    let (blog_post_record, post_content_records, heading_block_records, paragraph_block_records): (
      BlogPostRecord,
      Vec<PostContentRecord>,
      Vec<HeadingBlockRecord>,
      Vec<ParagraphBlockRecord>,
    ) = records_from_blog_post(mock_post)?;
    assert_eq!(blog_post_record.id, post_id);
    assert_eq!(blog_post_record.title, "テスト記事");
    assert_eq!(blog_post_record.post_date, "2021-01-01".parse().unwrap());
    assert_eq!(blog_post_record.last_update_date, "2021-01-02".parse().unwrap());

    assert_eq!(post_content_records.len(), 3);
    assert_eq!(post_content_records[0].content_type, "paragraph");
    assert_eq!(post_content_records[1].content_type, "h2");
    assert_eq!(post_content_records[2].content_type, "h3");

    assert_eq!(post_content_records[0].sort_order, 0);
    assert_eq!(post_content_records[1].sort_order, 1);
    assert_eq!(post_content_records[2].sort_order, 2);

    assert_eq!(heading_block_records.len(), 2);
    assert_eq!(heading_block_records[0].id, post_content_records[1].id);
    assert_eq!(heading_block_records[0].text_content, "見出しレベル2");

    assert_eq!(heading_block_records[1].id, post_content_records[2].id);
    assert_eq!(heading_block_records[1].text_content, "見出しレベル3");

    assert_eq!(paragraph_block_records.len(), 1);
    assert_eq!(paragraph_block_records[0].id, post_content_records[0].id);

    Ok(())
  }

  mod helper {
    use super::*;
    use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ParagraphBlock, RichText, Style};
    use uuid::Uuid;

    pub fn create_blog_post_mock(post_id: Uuid) -> Result<BlogPost> {
      let blog_post = BlogPost {
        id: post_id,
        title: "テスト記事".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-coffee".to_string(),
        },
        post_date: "2021-01-01".parse()?,
        last_update_date: "2021-01-02".parse()?,
        contents: vec![
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "これはテスト用の文字列です。".to_string(),
              styles: Style { bold: true },
            }],
            type_field: "paragraph".to_string(),
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "見出しレベル2".to_string(),
            type_field: "h2".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "見出しレベル3".to_string(),
            type_field: "h3".to_string(),
          }),
        ],
      };

      Ok(blog_post)
    }
  }
}
