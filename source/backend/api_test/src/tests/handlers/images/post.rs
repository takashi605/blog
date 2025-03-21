#[cfg(test)]
mod tests {
  use crate::tests::{
    handlers::images::{post::helper, test_helper},
    helper::http::{methods::Methods, request::Request},
  };
  use anyhow::{Context, Result};
  use common::types::api::response::Image;

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_image() -> Result<()> {
    let image_for_req: Image = helper::create_image_for_req();
    let blog_post_json_for_req: String = serde_json::to_string(&image_for_req).context("JSON データに変換できませんでした").unwrap();

    let url = "http://localhost:8000/blog/images";
    let request = Request::new(Methods::POST {
      body: blog_post_json_for_req,
    }, &url);
    let resp = request.send().await.unwrap().text().await.unwrap();

    let image_by_resp:Image = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    test_helper::assert_image(&image_by_resp, &image_for_req);

    Ok(())
  }
}

mod helper {
  use common::types::api::response::Image;
  use uuid::Uuid;

  pub fn create_image_for_req() -> Image {
    // uuid は適当に生成
    let image = Image {
      id: Uuid::new_v4(),
      path: "test-image".to_string(),
    };
    image
  }
}
