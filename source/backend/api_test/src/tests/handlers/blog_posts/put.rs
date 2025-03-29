#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::BlogPost;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn pub_pickup_posts() -> Result<()> {
    let url = "http://localhost:8000/blog/posts/pickup";

    let pickup_posts_for_req: Vec<BlogPost> = helper::create_pickup_posts_for_req().await.unwrap();
    let pickup_posts_json_for_req: String = serde_json::to_string(&pickup_posts_for_req).context("JSON データに変換できませんでした").unwrap();

    let put_request = Request::new(
      Methods::PUT {
        body: pickup_posts_json_for_req,
      },
      &url,
    );

    let resp = put_request.send().await.unwrap().text().await.unwrap();
    let pickup_posts_by_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    pickup_posts_by_resp.iter().zip(pickup_posts_for_req.iter()).for_each(|(by_resp, for_req)| {
      test_helper::assert_blog_post_without_uuid(by_resp, for_req);
    });
    Ok(())
  }

  mod helper {
    use super::*;

    pub async fn create_pickup_posts_for_req() -> Result<Vec<BlogPost>> {
      let pickup_posts = vec![
        test_helper::expected_minimal_blog_post1().unwrap(),
        test_helper::expected_minimal_blog_post2().unwrap(),
        test_helper::expected_minimal_blog_post3().unwrap(),
      ];

      Ok(pickup_posts)
    }
  }
}
