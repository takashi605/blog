#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::BlogPost;

  #[tokio::test(flavor = "current_thread")]
  async fn put_top_tech_pick_post() -> Result<()> {
    let url = "http://localhost:8000/admin/blog/posts/top-tech-pick";

    let top_tech_pick_post_for_req: BlogPost =test_helper::minimal_blog_post1().unwrap();
    let top_tech_pick_post_json_for_req: String = serde_json::to_string(&top_tech_pick_post_for_req).context("JSON データに変換できませんでした").unwrap();

    let put_request = Request::new(
      Methods::PUT {
        body: top_tech_pick_post_json_for_req,
      },
      &url,
    );

    let resp = put_request.send().await.unwrap().text().await.unwrap();
    let top_tech_pick_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    test_helper::assert_blog_post_without_uuid(&top_tech_pick_post_by_resp, &top_tech_pick_post_for_req);
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn put_pickup_posts() -> Result<()> {
    let url = "http://localhost:8000/admin/blog/posts/pickup";

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

  #[tokio::test(flavor = "current_thread")]
  async fn put_popular_posts() -> Result<()> {
    let url = "http://localhost:8000/admin/blog/posts/popular";

    let popular_posts_for_req: Vec<BlogPost> = helper::create_popular_posts_for_req().await.unwrap();
    let popular_posts_json_for_req: String = serde_json::to_string(&popular_posts_for_req).context("JSON データに変換できませんでした").unwrap();

    let put_request = Request::new(
      Methods::PUT {
        body: popular_posts_json_for_req,
      },
      &url,
    );

    let resp = put_request.send().await.unwrap().text().await.unwrap();
    let popular_posts_by_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    popular_posts_by_resp.iter().zip(popular_posts_for_req.iter()).for_each(|(by_resp, for_req)| {
      test_helper::assert_blog_post_without_uuid(by_resp, for_req);
    });
    Ok(())
  }

  mod helper {
    use super::*;

    pub async fn create_pickup_posts_for_req() -> Result<Vec<BlogPost>> {
      let pickup_posts = vec![
        test_helper::minimal_blog_post1().unwrap(),
        test_helper::minimal_blog_post2().unwrap(),
        test_helper::minimal_blog_post3().unwrap(),
      ];

      Ok(pickup_posts)
    }

    pub async fn create_popular_posts_for_req() -> Result<Vec<BlogPost>> {
      let popular_posts = vec![
        test_helper::minimal_blog_post3().unwrap(),
        test_helper::minimal_blog_post2().unwrap(),
        test_helper::minimal_blog_post1().unwrap(),
      ];

      Ok(popular_posts)
    }
  }
}
