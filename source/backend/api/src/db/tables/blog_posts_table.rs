use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct BlogPost {
    pub id: Uuid,
    pub title: String,
    pub thumbnail_image_id: Uuid,
    pub post_date: chrono::NaiveDate,
    pub last_update_date: chrono::NaiveDate,
    pub published_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
