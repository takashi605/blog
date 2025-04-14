use crate::db::pool::POOL;
use anyhow::Result;
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow)]
pub struct TopTechPickRecord {
  pub id: Uuid,
  pub post_id: Uuid,
}

pub async fn fetch_top_tech_pick_blog_post() -> Result<TopTechPickRecord> {
  // 古い順に3件取得
  let post = sqlx::query_as::<_, TopTechPickRecord>("select id, post_id from top_tech_pick_post").fetch_one(&*POOL).await?;
  Ok(post)
}

pub async fn update_top_tech_pick_post(new_post_id: Uuid) -> Result<(), sqlx::Error> {
  sqlx::query("update top_tech_pick_post set post_id = $1").bind(new_post_id).execute(&*POOL).await?;
  Ok(())
}
