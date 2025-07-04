use crate::tests::helper::http::methods::Methods;
use crate::tests::helper::http::response::Response;
use anyhow::{Context, Result};
use reqwest;
use reqwest::header::CONTENT_TYPE;

pub struct Request {
  pub request_builder: reqwest::RequestBuilder,
  pub _method: Methods,
  _headers: Option<Vec<(String, String)>>,
  _url_params: Option<Vec<(String, String)>>,
}

impl Request {
  pub fn new(method: Methods, url: &str) -> Self {
    let client = reqwest::Client::new();
    let request_builder = match &method {
      Methods::GET => client.get(url),
      Methods::POST { body } => client.post(url).body(body.to_string()).header(CONTENT_TYPE, "application/json"),
      Methods::PUT { body } => client.put(url).body(body.to_string()).header(CONTENT_TYPE, "application/json"),
    };
    Request {
      request_builder,
      _method: method,
      _headers: None,
      _url_params: None,
    }
  }

  pub async fn send(self) -> Result<Response> {
    let resp = self.request_builder.send().await.context("HTTP リクエストを送りましたが、エラーが発生しました")?;
    Ok(Response::new(resp))
  }
}
