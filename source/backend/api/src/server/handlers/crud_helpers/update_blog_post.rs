use crate::{
  db::{pool::POOL, tables::{
    pickup_posts_table::{update_pickup_blog_posts, PickUpPostRecord},
    popular_posts_table::{update_popular_blog_posts, PopularPostRecord},
  }},
  server::handlers::response::err::ApiCustomError,
};
use anyhow::Result;
use common::types::api::response::BlogPost;

pub async fn update_pickup_posts(new_pickup_posts: Vec<BlogPost>) -> Result<(), ApiCustomError> {
  let pickup_post_records: Vec<PickUpPostRecord> =
    new_pickup_posts.iter().map(|blog_post| PickUpPostRecord::from(blog_post.clone())).collect::<Vec<PickUpPostRecord>>();
  update_pickup_blog_posts(&*POOL, pickup_post_records).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ピックアップ記事の更新に失敗しました。")))?;
  Ok(())
}

pub async fn update_popular_posts(new_popular_posts: Vec<BlogPost>) -> Result<(), ApiCustomError> {
  let popular_post_records: Vec<PopularPostRecord> =
    new_popular_posts.iter().map(|blog_post| PopularPostRecord::from(blog_post.clone())).collect::<Vec<PopularPostRecord>>();
  update_popular_blog_posts(popular_post_records).await.map_err(|_| ApiCustomError::Other(anyhow::anyhow!("人気記事の更新に失敗しました。")))?;
  Ok(())
}
