#[cfg(test)]
mod tests {
  use crate::tests::{
    handlers::images::test_helper::assert_images,
    helper::http::{methods::Methods, request::Request},
  };
  use anyhow::{Context, Result};
  use common::types::api::Image;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn get_all_images() -> Result<()> {
    let url = "http://localhost:8001/blog/images";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_images_resp: Vec<Image> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_images: Vec<Image> = helper::expected_images();

    // データ数が期待値以上であることを確認
    assert!(actual_images_resp.len() >= expected_images.len(), "取得した画像の数が期待値を下回っています");
    // expected_images　の各画像が含まれていることを、path を確認して検証
    for expected_image in expected_images {
      assert!(
        actual_images_resp.iter().any(|img| img.path == expected_image.path),
        "取得した画像に期待される画像が含まれていません"
      );
    }

    Ok(())
  }

  mod helper {
    use super::*;

    pub fn expected_images() -> Vec<Image> {
      // uuid は適当に生成
      let image1 = Image {
        id: Uuid::new_v4(),
        path: "test-book".to_string(),
      };
      let image2 = Image {
        id: Uuid::new_v4(),
        path: "test-mechanical".to_string(),
      };
      let image3 = Image {
        id: Uuid::new_v4(),
        path: "test-coffee".to_string(),
      };
      vec![image1, image2, image3]
    }
  }
}
