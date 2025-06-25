#[cfg(test)]
mod tests {
  use crate::tests::{
    handlers::images::{post::helper, test_helper::assert_image},
    helper::http::{methods::Methods, request::Request},
  };
  use anyhow::{Context, Result};
  use common::types::api::{CreateImageRequest, Image};

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_image() -> Result<()> {
    let image_for_req: CreateImageRequest = helper::create_image_for_req();
    let blog_post_json_for_req: String = serde_json::to_string(&image_for_req).context("JSON データに変換できませんでした").unwrap();

    let url = "http://localhost:8001/admin/blog/images";
    let request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);
    let resp = request.send().await.unwrap().text().await.unwrap();

    let image_by_resp: Image = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    assert_image(&image_by_resp, &image_for_req);

    // 全件取得して、insert した画像の path が含まれているか確認する
    let url = "http://localhost:8001/blog/images";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();
    let actual_all_images_resp: Vec<Image> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    helper::assert_any_image_has_path(&actual_all_images_resp, &image_for_req.path);

    Ok(())
  }
}

mod helper {
  use common::types::api::{CreateImageRequest, Image};

  pub fn create_image_for_req() -> CreateImageRequest {
    let image = CreateImageRequest {
      path: "test-image".to_string(),
    };
    image
  }

  pub fn assert_any_image_has_path(images: &Vec<Image>, path: &str) {
    assert!(images.iter().any(|image| image.path == path));
  }
}
