#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::{BlogPost, ErrResponse};

  #[tokio::test(flavor = "current_thread")]
  async fn put_top_tech_pick_post() -> Result<()> {
    let url = "http://localhost:8001/admin/blog/posts/top-tech-pick";

    let top_tech_pick_post_for_req: BlogPost = test_helper::minimal_blog_post1().unwrap();
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
    let url = "http://localhost:8001/admin/blog/posts/pickup";

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
    let url = "http://localhost:8001/admin/blog/posts/popular";

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

  #[tokio::test(flavor = "current_thread")]
  async fn edit_blog_post_success() -> Result<()> {
    // 編集対象の記事データを準備
    let mut target_post = test_helper::minimal_blog_post1().unwrap();

    // 編集内容を設定
    target_post.title = "編集後のタイトル".to_string();
    target_post.contents[0] = common::types::api::BlogPostContent::H2(common::types::api::H2Block {
      id: uuid::Uuid::new_v4(),
      text: "編集後の見出し".to_string(),
    });

    let url = format!("http://localhost:8001/admin/blog/posts/{}", target_post.id);
    let request_body = serde_json::to_string(&target_post).context("JSON データに変換できませんでした")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let resp = put_request.send().await.unwrap().text().await.unwrap();
    let edited_post: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした")?;

    // 編集後の記事データを検証
    assert_eq!(edited_post.title, "編集後のタイトル");
    assert_eq!(edited_post.id, target_post.id);

    // 更新日が今日の日付になっていることを確認
    let today = chrono::Utc::now().date_naive();
    assert_eq!(edited_post.last_update_date, today);

    // その他のフィールドが正しく更新されていることを確認
    test_helper::assert_blog_post_without_uuid(&edited_post, &target_post);

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn edit_blog_post_not_found() -> Result<()> {
    // 存在しない記事IDを使用
    let non_existent_id = uuid::Uuid::new_v4();
    let mut dummy_post = test_helper::minimal_blog_post1().unwrap();
    dummy_post.id = non_existent_id;
    dummy_post.title = "存在しない記事".to_string();

    let url = format!("http://localhost:8001/admin/blog/posts/{}", non_existent_id);
    let request_body = serde_json::to_string(&dummy_post).context("JSON データに変換できませんでした")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let response = put_request.send().await.unwrap();

    // 404 Not Found が返されることを確認
    assert_eq!(response.status(), 404);

    let resp_body = response.text().await.unwrap();
    let error_response: ErrResponse = serde_json::from_str(&resp_body).context("エラーレスポンスのパースに失敗")?;

    // エラーメッセージに記事が見つからない旨が含まれていることを確認
    assert!(error_response.message.contains("記事が見つかりません") || error_response.message.contains("not found"));

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
