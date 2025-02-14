#[cfg(test)]
mod tests {
  use crate::tests::helper::http::{methods::Methods, request::Request};
  use anyhow::{Context, Result};
  use common::types::api::response::Image;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn get_all_images() -> Result<()> {
    let url = "http://localhost:8000/blog/images";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_images_resp: Vec<Image> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_images: Vec<Image> = helper::expected_images();

    helper::assert_images(&actual_images_resp, &expected_images);

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

    pub fn assert_images(actual: &Vec<Image>, expected: &Vec<Image>) {
      assert_eq!(actual.len(), expected.len());
      for (actual, expected) in actual.iter().zip(expected) {
        // uuid は適当に生成されるので長さだけチェック
        assert_eq!(actual.id.to_string().len(), 36);
        assert_eq!(actual.path, expected.path);
      }
    }
  }
}
