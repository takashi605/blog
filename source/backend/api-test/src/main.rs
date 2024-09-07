#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("http://localhost:8000")
        .await?.text().await?;
    println!("{resp:#?}");
    Ok(())
}

#[cfg(test)]
mod tests {
  #[tokio::test(flavor = "current_thread")]
  async fn root_get() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("http://localhost:8000")
        .await?.text().await?;
    assert_eq!(resp,"Hello world!");
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn root_post() -> Result<(), Box<dyn std::error::Error>> {
    let resp: String = reqwest::Client::new()
        .post("http://localhost:8000")
        .body("post message")
        .send().await?.text().await?;
    assert_eq!(resp,"post message");
    Ok(())
  }
}
