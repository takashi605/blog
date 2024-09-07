#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("http://localhost:8000")
        .await?.text().await?;
    println!("{resp:#?}");
    Ok(())
}

#[cfg(test)]
mod tests {
  use anyhow::{Context, Result};

  #[tokio::test(flavor = "current_thread")]
  async fn root_get() -> Result<()> {
    let resp = reqwest::get("http://localhost:8000")
        .await.context("/ に対する get リクエストを正常に送信できませんでした")?.text().await.context("/ に対して get リクエストを送信しましたが、レスポンスをテキストに変換できませんでした")?;
    assert_eq!(resp,"Hello world!");
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn root_post() -> Result<()> {
    let resp: String = reqwest::Client::new()
        .post("http://localhost:8000")
        .body("post message")
        .send().await.context("/ に対する post リクエストを正常に送信できませんでした")?.text().await.context("/ に対して post リクエストを送信しましたが、レスポンスをテキストに変換できませんでした")?;
    assert_eq!(resp,"post message");
    Ok(())
  }
}
