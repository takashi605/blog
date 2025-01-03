mod helper;

#[cfg(test)]
mod api_tests {
  use crate::tests::helper::http::methods::Methods;
  use crate::tests::helper::http::request::Request;
  use anyhow::{Context, Result};
  use common::Numbers;
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

  #[tokio::test(flavor = "current_thread")]
  async fn fivesix_get() -> Result<()> {
    let resp = Request::new(Methods::GET, "http://localhost:8000/fivesix").send().await?.text().await?;
    let numbers: Numbers = serde_json::from_str(&resp).context("JSON データをパースできませんでした")?;
    assert_eq!(numbers.num1, 5);
    assert_eq!(numbers.num2, 6);
    Ok(())
  }
}
