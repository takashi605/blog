//! アプリケーションサービス
//! 
//! 複数のユースケースにまたがる処理や、
//! 外部サービスとの連携を担当するサービス層を定義する。

pub mod response_adapter;

// 将来のアプリケーションサービス例（現在は使用されていない）
// これらは Phase 2 でドメイン層実装時に使用される

/*
use crate::application::dto::ApplicationError;
use anyhow::Result;

// 将来のブログ記事管理サービス例
pub struct BlogPostService {
    // リポジトリやドメインサービスへの依存
}

impl BlogPostService {
    pub fn new() -> Self {
        Self {}
    }
    
    // 複数のユースケースにまたがる処理例
    pub async fn publish_blog_post(&self, draft_id: uuid::Uuid) -> Result<(), ApplicationError> {
        // 1. 下書き記事の取得
        // 2. 公開前バリデーション
        // 3. 公開状態への更新
        // 4. 通知の送信
        todo!("Phase 2 で実装")
    }
}
*/