mod http;

fn main() {
  println!("これは API テスト用のクレートです。cargo test コマンドでテストを実行してください。");
}

#[cfg(test)]
mod tests {
  use crate::http::request::Request;
  use crate::http::methods::Methods;
  use anyhow::{Context, Result};

  #[tokio::test(flavor = "current_thread")]
  async fn root_get() -> Result<()> {
    let resp = Request::new(Methods::GET, "http://localhost:8000").send().await?.text().await?;
    assert_eq!(resp, "Hello world!");
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn root_post() -> Result<()> {
    let resp = Request::new(
      Methods::POST {
        body: "post message".to_string(),
      },
      "http://localhost:8000",
    )
    .send()
    .await?
    .text()
    .await?;
    assert_eq!(resp, "post message");
    Ok(())
  }
}
