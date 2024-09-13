use anyhow::{Context, Result};

#[derive(PartialEq, Debug)]
enum Methods {
  GET,
  POST,
  PUT,
  DELETE,
}

pub struct Request {
  method: Methods,
  url: String,
}

impl Request {
  pub fn new(method: Methods, url: &str) -> Self {
    Request {
      method,
      url: url.to_string(),
    }
  }

  pub async fn send(&self) -> Result<Response> {
    let resp = reqwest::get(&self.url)
      .await
      .context("/ に対する get リクエストを正常に送信できませんでした")?;
    Ok(Response::new(resp))
  }
}

pub struct Response {
  resp: reqwest::Response,
}

impl Response {
  pub fn new(resp: reqwest::Response) -> Self {
    Response {
      resp,
    }
  }

  pub async fn text(self) -> Result<String> {
    self.resp
      .text()
      .await
      .context("レスポンスをテキストに変換できませんでした")
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  #[tokio::test(flavor = "current_thread")]
  async fn initialize_request() {
    let req = Request::new(Methods::GET, "http://localhost:8000");
    assert_eq!(req.method, Methods::GET);
  }

  #[tokio::test(flavor = "current_thread")]
  async fn send_get_request() -> Result<()> {
    let req = Request::new(Methods::GET, "http://localhost:8000");
    let resp = req.send().await?
      .text().await?;
    assert_eq!(resp, "Hello world!");

    Ok(())
  }
}
