mod http;


fn main() {
  println!("これは API テスト用のクレートです。cargo test コマンドでテストを実行してください。");
}

#[cfg(test)]
mod tests {
  use anyhow::{Context, Result};
  use crate::http::{Request, Methods};

  #[tokio::test(flavor = "current_thread")]
  async fn root_get() -> Result<()> {
    let resp = Request::new(Methods::GET, "http://localhost:8000")
      .send().await?
      .text().await?;
    assert_eq!(resp, "Hello world!");
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn root_post() -> Result<()> {
    let resp: String = reqwest::Client::new()
      .post("http://localhost:8000")
      .body("post message")
      .send()
      .await
      .context("/ に対する post リクエストを正常に送信できませんでした")?
      .text()
      .await
      .context("/ に対して post リクエストを送信しましたが、レスポンスをテキストに変換できませんでした")?;
    assert_eq!(resp, "post message");
    Ok(())
  }
}
