use anyhow::{Context, Result};
use reqwest;
use crate::http::methods::Methods;
use crate::http::response::Response;

pub struct Request {
  pub method: Methods,
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
