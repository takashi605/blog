mod server;
mod db;

use anyhow::Result;
use server::start_api_server;

#[actix_web::main]
async fn main() -> Result<()> {
  start_api_server().await
}
