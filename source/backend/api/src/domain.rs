//! ドメイン層
//!
//! ビジネスエンティティ、値オブジェクト、リポジトリインターフェースを含む。
//! この層は外部の関心事から独立し、純粋なビジネスロジックを含む。
//!
//! ## 命名規則
//! - エンティティ: `XxxEntity`
//! - 値オブジェクト: `XxxVO`
//!
//! ## ドメインごとに分離された構造
//! - `blog_domain`: ブログ記事関連のドメイン
//!   - `blog_post_entity`: BlogPost集約のルートエンティティ
//!   - `blog_post/*`: BlogPostコンテンツ関連のサブエンティティ
//!   - `rich_text_vo`: リッチテキスト値オブジェクト
//! - `image_domain`: 画像管理関連のドメイン

pub mod blog_domain;
pub mod image_domain;

// 公開API（将来必要に応じて追加）
