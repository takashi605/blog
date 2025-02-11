pub mod blog_posts_table;
pub mod heading_blocks_table;
pub mod image_blocks_table;
pub mod images_table;
pub mod paragraph_blocks_table;
pub mod post_contents_table;

use blog_posts_table::BlogPostRecord;
use common::types::api::response::BlogPost;


pub fn records_from_blog_post(post: BlogPost) -> BlogPostRecord {
  BlogPostRecord {
    id: post.id,
    title: post.title,
    thumbnail_image_id: post.thumbnail.id,
    post_date: post.post_date,
    last_update_date: post.last_update_date,
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::db::tables::blog_posts_table::BlogPostRecord;
  use anyhow::Result;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn blog_post_to_records() {
    let post_id: Uuid = Uuid::new_v4();
    let mock_post: BlogPost = helper::create_blog_post_mock(post_id).unwrap();

    let record: BlogPostRecord = records_from_blog_post(mock_post);
    assert_eq!(record.id, post_id);
    assert_eq!(record.title, "テスト記事");
    assert_eq!(record.post_date, "2021-01-01".parse().unwrap());
    assert_eq!(record.last_update_date, "2021-01-02".parse().unwrap());
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
