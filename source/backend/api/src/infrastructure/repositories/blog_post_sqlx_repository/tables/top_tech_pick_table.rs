use anyhow::Result;
use sqlx::{Executor, FromRow, Postgres};
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct TopTechPickRecord {
  pub id: Uuid,
  pub post_id: Uuid,
}

pub async fn fetch_top_tech_pick_blog_post(executor: impl Executor<'_, Database = Postgres>) -> Result<TopTechPickRecord> {
  let post = sqlx::query_as::<_, TopTechPickRecord>("select id, post_id from top_tech_pick_post").fetch_one(executor).await?;
  Ok(post)
}

pub async fn update_top_tech_pick_post(executor: impl Executor<'_, Database = Postgres>, new_post_id: Uuid) -> Result<(), sqlx::Error> {
  sqlx::query("update top_tech_pick_post set post_id = $1").bind(new_post_id).execute(executor).await?;
  Ok(())
}
