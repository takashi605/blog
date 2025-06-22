//! インフラ層
//! 
//! リポジトリインターフェースの具象実装と外部サービスアダプターを含む。
//! この層は永続化、外部API、その他のI/O処理を担当する。

pub mod di_container;
pub mod repositories;
pub mod server;