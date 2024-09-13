pub mod request;
pub mod methods;
mod response;

use anyhow::{Context, Result};

#[cfg(test)]
mod tests {
  use super::*;
  use crate::http::request::Request;
  use crate::http::methods::Methods;
  #[tokio::test(flavor = "current_thread")]
  async fn initialize_request() {
    let req = Request::new(Methods::GET, "http://localhost:8000");
    assert_eq!(req.method, Methods::GET);
  }

  #[tokio::test(flavor = "current_thread")]
  async fn send_get_request() -> Result<()> {
    let req = Request::new(Methods::GET, "http://localhost:8000");
    let resp = req.send().await?.text().await?;
    assert_eq!(resp, "Hello world!");

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn send_post_request() -> Result<()> {
    let req = Request::new(
      Methods::POST {
        body: "post message".to_string(),
      },
      "http://localhost:8000",
    );
    let resp = req.send().await?.text().await?;
    assert_eq!(resp, "post message");

    Ok(())
  }
}
