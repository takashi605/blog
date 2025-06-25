use anyhow::Result;
use common::types::api::BlogPost;
use sqlx::{Executor, FromRow, Postgres, Transaction};
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct PickUpPostRecord {
  pub post_id: Uuid,
}

pub async fn fetch_all_pickup_blog_posts(executor: impl Executor<'_, Database = Postgres>) -> Result<Vec<PickUpPostRecord>> {
  let post = sqlx::query_as::<_, PickUpPostRecord>("select post_id from pickup_posts order by updated_at asc limit 3").fetch_all(executor).await?;
  Ok(post)
}

// TODO トランザクションを貼る
pub async fn update_pickup_blog_posts(tx: &mut Transaction<'_, Postgres>, pickup_blog_posts: Vec<PickUpPostRecord>) -> Result<()> {
  // 一旦全削除
  sqlx::query("delete from pickup_posts").execute(&mut **tx).await?;

  // 挿入
  for post in pickup_blog_posts {
    sqlx::query("insert into pickup_posts (post_id) values ($1)").bind(post.post_id).execute(&mut **tx).await?;
  }
  println!("insert into pickup_posts");

  Ok(())
}

impl From<BlogPost> for PickUpPostRecord {
  fn from(post: BlogPost) -> Self {
    Self {
      post_id: post.id,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use common::types::api::{BlogPost, Image};

  #[tokio::test(flavor = "current_thread")]
  async fn blog_post_to_record_by_from_func() {
    let post_id: Uuid = Uuid::new_v4();
    let mock_post: BlogPost = helper::create_blog_post_mock(post_id);
    let record = PickUpPostRecord::from(mock_post);
    assert_eq!(record.post_id, post_id);
  }

  mod helper {
    use chrono::NaiveDate;
    use common::types::api::BlogPost;

    use super::*;

    pub fn create_blog_post_mock(record_id: Uuid) -> BlogPost {
      BlogPost {
        id: record_id,
        title: "ミニマル記事".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-coffee".to_string(),
        },
        post_date: NaiveDate::from_ymd_opt(2025, 3, 1).unwrap(),
        last_update_date: NaiveDate::from_ymd_opt(2025, 3, 2).unwrap(),
        contents: vec![],
      }
    }
  }
}
