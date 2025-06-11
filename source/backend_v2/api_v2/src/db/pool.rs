use sqlx::postgres::PgPoolOptions;
use std::{env, sync::LazyLock};

// TODO context でエラーをラップする
// シングルトンとしてのPgPoolの定義
pub static POOL: LazyLock<sqlx::Pool<sqlx::Postgres>> = LazyLock::new(|| {
  let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
  PgPoolOptions::new().max_connections(5).connect_lazy(&database_url).expect("Failed to create pool")
});
