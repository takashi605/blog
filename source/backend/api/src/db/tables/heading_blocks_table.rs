use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct HeadingBlock {
    pub id: Uuid,
    pub content_id: Uuid,
    pub heading_level: i16,
    pub text_content: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
