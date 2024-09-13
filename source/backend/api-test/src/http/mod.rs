use anyhow::{Context, Result};

#[derive(PartialEq, Debug)]
pub enum Methods {
  GET,
  POST { body: String },
  PUT,
  DELETE,
}

pub struct Request {
  method: Methods,
  url: String,
  _body: Option<String>,
  _headers: Option<Vec<(String, String)>>,
  _url_params: Option<Vec<(String, String)>>,
}

impl Request {
  pub fn new(method: Methods, url: &str) -> Self {
    Request { method, url: url.to_string(), _body: None, _headers: None, _url_params: None }
  }

  pub async fn send(&self) -> Result<Response> {
    let client = reqwest::Client::new();
    let resp = match &self.method {
      Methods::GET => client.get(&self.url).send().await.context("get リクエストを正常に送信できませんでした")?,
      Methods::POST { body } => client.post(&self.url).body(body.to_string()).send().await.context("post リクエストを正常に送信できませんでした")?,
      Methods::PUT => client.put(&self.url).send().await.context("put リクエストを正常に送信できませんでした")?,
      Methods::DELETE => client.delete(&self.url).send().await.context("delete リクエストを正常に送信できませんでした")?,
    };
    Ok(Response::new(resp))
  }
}

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
