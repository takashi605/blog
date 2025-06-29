#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::{BlogPost, ErrResponse, UpdateBlogPostRequest};

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
  async fn put_blog_post_success() -> Result<()> {
    // テスト用の画像を取得
    let thumbnail = test_helper::fetch_any_image().await?;

    // まず新しい記事を作成
    let create_request = common::types::api::CreateBlogPostRequest {
      title: "作成された記事".to_string(),
      thumbnail: common::types::api::CreateImageContentRequest {
        id: Some(thumbnail.id),
        path: thumbnail.path.clone(),
      },
      post_date: "2025-01-01".parse()?,
      last_update_date: "2025-01-01".parse()?,
      published_date: "2025-01-01".parse()?,
      contents: vec![common::types::api::CreateBlogPostContentRequest::H2(common::types::api::CreateH2BlockRequest {
        text: "元の見出し".to_string(),
      })],
    };

    let create_url = "http://localhost:8001/admin/blog/posts";
    let create_body = serde_json::to_string(&create_request).context("作成リクエストのJSON変換に失敗")?;
    let create_request_obj = Request::new(Methods::POST { body: create_body }, create_url);
    let create_resp = create_request_obj.send().await.unwrap().text().await.unwrap();
    let created_post: BlogPost = serde_json::from_str(&create_resp).context("作成レスポンスのパースに失敗")?;

    // 編集用の画像ブロック用画像を取得
    let image_for_block = test_helper::fetch_any_image().await?;

    // 編集リクエストを作成（post_dateとlast_update_dateは含まない）
    let update_request = UpdateBlogPostRequest {
      title: "編集後のタイトル".to_string(),
      thumbnail: thumbnail,
      published_date: created_post.published_date,
      contents: vec![
        common::types::api::BlogPostContent::H2(common::types::api::H2Block {
          id: uuid::Uuid::new_v4(),
          text: "編集後の見出し".to_string(),
        }),
        common::types::api::BlogPostContent::Image(common::types::api::ImageBlock {
          id: uuid::Uuid::new_v4(),
          path: image_for_block.path,
        }),
      ],
    };

    let url = format!("http://localhost:8001/admin/blog/posts/{}", created_post.id);
    let request_body = serde_json::to_string(&update_request).context("編集リクエストのJSON変換に失敗")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let response = put_request.send().await.unwrap();
    let status = response.status();
    let resp = response.text().await.unwrap();
    
    // デバッグ用：レスポンスの内容を出力
    println!("Response status: {}", status);
    println!("Response body: {}", resp);
    
    if status < 200 || status >= 300 {
      return Err(anyhow::anyhow!("PUT request failed with status {}: {}", status, resp));
    }
    
    let edited_post: BlogPost = serde_json::from_str(&resp).context("編集レスポンスのパースに失敗")?;

    // 編集後の記事データを検証
    assert_eq!(edited_post.title, "編集後のタイトル");
    assert_eq!(edited_post.id, created_post.id);

    // 更新日が今日の日付になっていることを確認
    let today = chrono::Utc::now().date_naive();
    assert_eq!(edited_post.last_update_date, today);

    // 投稿日は変わらないことを確認
    assert_eq!(edited_post.post_date, created_post.post_date);

    // 公開日が正しく設定されていることを確認
    assert_eq!(edited_post.published_date, update_request.published_date);

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn put_blog_post_not_found() -> Result<()> {
    // 存在しない記事IDを使用
    let non_existent_id = uuid::Uuid::new_v4();
    let dummy_post = test_helper::minimal_blog_post1().unwrap();

    // 編集リクエストを作成
    let update_request = UpdateBlogPostRequest {
      title: "存在しない記事".to_string(),
      thumbnail: dummy_post.thumbnail,
      published_date: dummy_post.published_date,
      contents: dummy_post.contents,
    };

    let url = format!("http://localhost:8001/admin/blog/posts/{}", non_existent_id);
    let request_body = serde_json::to_string(&update_request).context("JSON データに変換できませんでした")?;

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
