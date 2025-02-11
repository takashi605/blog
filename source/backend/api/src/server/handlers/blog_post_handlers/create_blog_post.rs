use anyhow::Result;
use common::types::api::response::BlogPost;
use uuid::Uuid;

use crate::db::tables::{blog_posts_table::insert_blog_post, generate_blog_post_records_by, paragraph_blocks_table::TextStyleRecord};

pub async fn create_single_blog_post(blog_post: BlogPost) -> Result<BlogPost> {
  // TODO DB からのデータ取得に置き換える
  let mock_style_records: Vec<TextStyleRecord> = vec![TextStyleRecord {
    id: Uuid::new_v4(),
    style_type: "bold".to_string(),
  }];

  let (blog_post_record, _blog_post_content, _heading_block_records, _paragraph_block_records, _rich_text_records, _rich_text_styles) =
    generate_blog_post_records_by(blog_post.clone(), mock_style_records)?;
  insert_blog_post(blog_post_record).await?;

  // TODO 実際にデータベースに格納したデータを返すように変更
  Ok(blog_post)
}
