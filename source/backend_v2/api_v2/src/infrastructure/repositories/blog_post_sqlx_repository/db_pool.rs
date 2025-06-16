use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use std::env;
use anyhow::Result;

/// 新しいデータベース接続プールを作成する
/// 
/// この関数は依存性注入用に設計されており、
/// リポジトリインスタンスに注入するために使用される
pub async fn create_db_pool() -> Result<PgPool> {
    let database_url = env::var("DATABASE_URL")
        .map_err(|_| anyhow::anyhow!("DATABASE_URL environment variable must be set"))?;
    
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to create database pool: {}", e))?;
    
    Ok(pool)
}

/// テスト用のデータベース接続プールを作成する
/// 
/// テスト環境では異なる設定を使用する場合がある
#[cfg(test)]
pub async fn create_test_db_pool() -> Result<PgPool> {
    let database_url = env::var("TEST_DATABASE_URL")
        .or_else(|_| env::var("DATABASE_URL"))
        .map_err(|_| anyhow::anyhow!("TEST_DATABASE_URL or DATABASE_URL environment variable must be set"))?;
    
    let pool = PgPoolOptions::new()
        .max_connections(2)  // テスト用は少ない接続数
        .connect(&database_url)
        .await
        .map_err(|e| anyhow::anyhow!("Failed to create test database pool: {}", e))?;
    
    Ok(pool)
}