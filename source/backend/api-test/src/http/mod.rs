pub mod methods;
pub mod request;
mod response;

use anyhow::{Context, Result};

#[cfg(test)]
mod tests {
  use reqwest::header::CONTENT_TYPE;

  use super::*;
  use crate::http::methods::Methods;
  use crate::http::request::Request;
  #[tokio::test(flavor = "current_thread")]
  async fn initialize_request() {
    let req = Request::new(Methods::GET, "http://localhost:8000/api");
    assert_eq!(req.method, Methods::GET);
  }

  #[tokio::test(flavor = "current_thread")]
  async fn send_get_request() -> Result<()> {
    let req = Request::new(Methods::GET, "http://localhost:8000/api");
    let resp = req.send().await?.text().await?;
    assert_eq!(resp, "Hello world!");

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn send_post_request_with_json() -> Result<()> {
    let req = Request::new(
      Methods::POST {
        body: "post message".to_string(),
      },
      "http://localhost:8000/api",
    );
    // デフォルトでは Content-Type が json になっている
    if let Some(content_type) = req
      .request_builder
      .try_clone()
      .context("RequestBuilder のクローンを生成できませんでした")?
      .build()
      .context("Request を生成できませんでした")?
      .headers()
      .get(CONTENT_TYPE)
    {
      assert_eq!(content_type.to_str()?, "application/json");
    } else {
      anyhow::bail!("Content-Type ヘッダーが見つかりませんでした");
    }
    let resp = req.send().await?.text().await?;
    assert_eq!(resp, "post message");

    Ok(())
  }
}
