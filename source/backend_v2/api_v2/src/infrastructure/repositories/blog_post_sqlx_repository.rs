pub mod converter;
pub mod db_pool;
pub mod tables;

// 公開する必要のある型をre-export
pub use converter::*;
pub use db_pool::*;
pub use tables::*;

use anyhow::{Context, Result};
use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::blog_domain::{
    blog_post_entity::BlogPostEntity,
    blog_post_repository::BlogPostRepository,
};

use self::tables::{
    blog_posts_table::fetch_blog_post_by_id,
    images_table::fetch_image_by_id,
    post_contents_table::{fetch_post_contents_by_post_id, fetch_any_content_block},
};

/// SQLxを使用したBlogPostRepositoryの実装
pub struct BlogPostSqlxRepository {
    pool: PgPool,
}

impl BlogPostSqlxRepository {
    /// 新しいBlogPostSqlxRepositoryインスタンスを作成する
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[async_trait::async_trait]
impl BlogPostRepository for BlogPostSqlxRepository {
    async fn find(&self, id: &str) -> Result<BlogPostEntity> {
        let post_id = Uuid::parse_str(id)
            .context("無効なUUID形式のIDです")?;

        // ブログ記事のメイン情報を取得
        let blog_post_record = fetch_blog_post_by_id(&self.pool, post_id)
            .await
            .context("ブログ記事の取得に失敗しました")?;

        // サムネイル画像を取得
        let thumbnail_record = fetch_image_by_id(&self.pool, blog_post_record.thumbnail_image_id)
            .await
            .context("サムネイル画像の取得に失敗しました")?;

        // コンテンツ一覧を取得
        let post_content_records = fetch_post_contents_by_post_id(&self.pool, post_id)
            .await
            .context("投稿コンテンツ一覧の取得に失敗しました")?;

        // 各コンテンツの詳細を並列取得
        let mut content_blocks = Vec::new();
        for post_content_record in post_content_records {
            let content_block = fetch_any_content_block(&self.pool, post_content_record.clone())
                .await
                .context("コンテンツブロックの取得に失敗しました")?;
            content_blocks.push((post_content_record, content_block));
        }

        // エンティティに変換
        convert_to_blog_post_entity(blog_post_record, thumbnail_record, content_blocks)
            .context("BlogPostEntityへの変換に失敗しました")
    }

    async fn save(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
        todo!("save メソッドは後で実装します")
    }

    async fn find_latests(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
        todo!("find_latests メソッドは後で実装します")
    }

    async fn find_top_tech_pick(&self) -> Result<BlogPostEntity> {
        todo!("find_top_tech_pick メソッドは後で実装します")
    }

    async fn reselect_top_tech_pick_post(&self, _blog_post: &BlogPostEntity) -> Result<BlogPostEntity> {
        todo!("reselect_top_tech_pick_post メソッドは後で実装します")
    }

    async fn find_pick_up_posts(&self, _quantity: u32) -> Result<Vec<BlogPostEntity>> {
        todo!("find_pick_up_posts メソッドは後で実装します")
    }

    async fn reselect_pick_up_posts(&self, _pickup_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
        todo!("reselect_pick_up_posts メソッドは後で実装します")
    }

    async fn find_popular_posts(&self, _quantity: Option<u32>) -> Result<Vec<BlogPostEntity>> {
        todo!("find_popular_posts メソッドは後で実装します")
    }

    async fn reselect_popular_posts(&self, _popular_posts: &[BlogPostEntity]) -> Result<Vec<BlogPostEntity>> {
        todo!("reselect_popular_posts メソッドは後で実装します")
    }
}
