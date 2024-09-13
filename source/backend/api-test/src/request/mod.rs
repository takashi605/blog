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
}

#[cfg(test)]
mod tests {
  use super::*;
  #[tokio::test(flavor = "current_thread")]
  async fn initialize_request() {
    let req = Request::new(Methods::GET, "http://localhost:8000");
    assert_eq!(req.method, Methods::GET);
  }
}
