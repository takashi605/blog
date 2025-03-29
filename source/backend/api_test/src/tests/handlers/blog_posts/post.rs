#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::BlogPost;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_blog_post() -> Result<()> {
    let url = "http://localhost:8000/blog/posts";

    let blog_post_for_req: BlogPost = test_helper::create_blog_post_for_req(Uuid::new_v4(), "テスト記事").await.unwrap();
    let blog_post_json_for_req: String = serde_json::to_string(&blog_post_for_req).context("JSON データに変換できませんでした").unwrap();

    let post_request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);

    let resp = post_request.send().await.unwrap().text().await.unwrap();
    let blog_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    test_helper::assert_blog_post_without_uuid(&blog_post_by_resp, &blog_post_for_req);
    Ok(())
  }
}