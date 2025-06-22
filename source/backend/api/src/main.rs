//  3層アーキテクチャモジュール
mod application;
mod domain;
mod infrastructure;

use anyhow::Result;
use infrastructure::server::start_api_server;

#[cfg(test)]
mod tests;

#[actix_web::main]
async fn main() -> Result<()> {
  start_api_server().await
}
