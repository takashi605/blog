//! アプリケーション層内部DTO
//! 
//! ドメイン層とアプリケーション層間のデータ転送オブジェクト（DTO）を定義する。
//! APIレスポンス用の型（common::types::api::response）とは分離し、
//! 将来のドメインエンティティとの変換に使用される。

// 将来のドメインエンティティからの変換用トレイト
pub trait FromDomainEntity<T> {
    fn from_domain(entity: T) -> Self;
}

// 将来のドメインエンティティへの変換用トレイト
pub trait ToDomainEntity<T> {
    fn to_domain(self) -> anyhow::Result<T>;
}

// アプリケーション層のエラー型
#[derive(Debug, thiserror::Error)]
pub enum ApplicationError {
    #[error("ドメインエンティティの変換に失敗しました: {0}")]
    DomainConversionFailed(String),
    
    #[error("バリデーションエラー: {0}")]
    ValidationError(String),
    
    #[error("リソースが見つかりませんでした: {0}")]
    ResourceNotFound(String),
}

// 将来のアプリケーション層DTO例（現在は使用されていない）
// これらは Phase 2 でドメインエンティティ実装時に使用される

/*
// 将来のブログ記事 DTO 例
#[derive(Debug, Clone)]
pub struct BlogPostDto {
    pub id: uuid::Uuid,
    pub title: String,
    pub thumbnail_id: uuid::Uuid,
    pub post_date: chrono::NaiveDate,
    pub last_update_date: chrono::NaiveDate,
    pub contents: Vec<ContentDto>,
}

#[derive(Debug, Clone)]
pub enum ContentDto {
    Heading { level: u8, text: String },
    Paragraph { text: Vec<RichTextDto> },
    Image { id: uuid::Uuid, path: String },
    CodeBlock { title: String, code: String, language: String },
}

#[derive(Debug, Clone)]
pub struct RichTextDto {
    pub text: String,
    pub bold: bool,
    pub inline_code: bool,
    pub link_url: Option<String>,
}
*/