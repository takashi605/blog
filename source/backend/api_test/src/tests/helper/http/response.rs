use anyhow::{Context, Result};

pub struct Response {
  resp: reqwest::Response,
}

impl Response {
  pub fn new(resp: reqwest::Response) -> Self {
    Response { resp }
  }

  pub async fn text(self) -> Result<String> {
    self.resp.text().await.context("レスポンスをテキストに変換できませんでした")
  }

  pub fn status(&self) -> u16 {
    self.resp.status().as_u16()
  }
}
