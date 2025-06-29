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

  #[tokio::test(flavor = "current_thread")]
  async fn put_blog_post_cannot_unpublish_popular_post() -> Result<()> {
    // 人気記事専用のIDを直接指定（重複のない記事を使用）
    let popular_post_id = "f735a7b7-8bbc-4cb5-b6cf-c188734f64d3"; // ミニマル記事3（人気記事のみ）

    // 該当記事を取得して存在確認
    let post_url = format!("http://localhost:8001/admin/blog/posts/{}", popular_post_id);
    let get_request = Request::new(Methods::GET, &post_url);
    let get_response = get_request.send().await.unwrap().text().await.unwrap();
    let popular_post: BlogPost = serde_json::from_str(&get_response).context("人気記事の取得に失敗")?;

    // 未来の日付を設定して非公開にしようとする
    let tomorrow = chrono::Utc::now().date_naive() + chrono::Duration::days(1);

    let update_request = UpdateBlogPostRequest {
      title: popular_post.title.clone(),
      thumbnail: popular_post.thumbnail.clone(),
      published_date: tomorrow,
      contents: popular_post.contents.clone(),
    };

    let url = format!("http://localhost:8001/admin/blog/posts/{}", popular_post.id);
    let request_body = serde_json::to_string(&update_request).context("JSON データに変換できませんでした")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let response = put_request.send().await.unwrap();

    // 400 Bad Request が返されることを確認
    assert_eq!(response.status(), 400);

    let resp_body = response.text().await.unwrap();
    let error_response: ErrResponse = serde_json::from_str(&resp_body).context("エラーレスポンスのパースに失敗")?;

    // エラーメッセージに人気記事は非公開にできない旨が含まれていることを確認
    assert!(error_response.message.contains("人気記事に設定されているため非公開にできません"));

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn put_blog_post_cannot_unpublish_pickup_post() -> Result<()> {
    // ピックアップ記事専用のIDを直接指定（重複のない記事を使用）
    let pickup_post_id = "20b73825-9a6f-4901-aa42-e104a8d2c4f6"; // ミニマル記事1（ピックアップ記事のみ）

    // 該当記事を取得して存在確認
    let post_url = format!("http://localhost:8001/admin/blog/posts/{}", pickup_post_id);
    let get_request = Request::new(Methods::GET, &post_url);
    let get_response = get_request.send().await.unwrap().text().await.unwrap();
    let pickup_post: BlogPost = serde_json::from_str(&get_response).context("ピックアップ記事の取得に失敗")?;

    // 未来の日付を設定して非公開にしようとする
    let tomorrow = chrono::Utc::now().date_naive() + chrono::Duration::days(1);

    let update_request = UpdateBlogPostRequest {
      title: pickup_post.title.clone(),
      thumbnail: pickup_post.thumbnail.clone(),
      published_date: tomorrow,
      contents: pickup_post.contents.clone(),
    };

    let url = format!("http://localhost:8001/admin/blog/posts/{}", pickup_post.id);
    let request_body = serde_json::to_string(&update_request).context("JSON データに変換できませんでした")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let response = put_request.send().await.unwrap();

    // 400 Bad Request が返されることを確認
    assert_eq!(response.status(), 400);

    let resp_body = response.text().await.unwrap();
    let error_response: ErrResponse = serde_json::from_str(&resp_body).context("エラーレスポンスのパースに失敗")?;

    // エラーメッセージにピックアップ記事は非公開にできない旨が含まれていることを確認
    assert!(error_response.message.contains("ピックアップ記事に設定されているため非公開にできません"));

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn put_blog_post_cannot_unpublish_top_tech_pick_post() -> Result<()> {
    // トップテックピック記事のIDを直接指定
    let top_tech_pick_post_id = "672f2772-72b5-404a-8895-b1fbbf310801"; // 初めての技術スタックへの挑戦

    // 該当記事を取得して存在確認
    let post_url = format!("http://localhost:8001/admin/blog/posts/{}", top_tech_pick_post_id);
    let get_request = Request::new(Methods::GET, &post_url);
    let get_response = get_request.send().await.unwrap().text().await.unwrap();
    let top_tech_pick_post: BlogPost = serde_json::from_str(&get_response).context("トップテックピック記事の取得に失敗")?;

    // 未来の日付を設定して非公開にしようとする
    let tomorrow = chrono::Utc::now().date_naive() + chrono::Duration::days(1);

    let update_request = UpdateBlogPostRequest {
      title: top_tech_pick_post.title.clone(),
      thumbnail: top_tech_pick_post.thumbnail.clone(),
      published_date: tomorrow,
      contents: top_tech_pick_post.contents.clone(),
    };

    let url = format!("http://localhost:8001/admin/blog/posts/{}", top_tech_pick_post.id);
    let request_body = serde_json::to_string(&update_request).context("JSON データに変換できませんでした")?;

    let put_request = Request::new(Methods::PUT { body: request_body }, &url);

    let response = put_request.send().await.unwrap();

    // 400 Bad Request が返されることを確認
    assert_eq!(response.status(), 400);

    let resp_body = response.text().await.unwrap();
    let error_response: ErrResponse = serde_json::from_str(&resp_body).context("エラーレスポンスのパースに失敗")?;

    // エラーメッセージにトップテックピック記事は非公開にできない旨が含まれていることを確認
    assert!(error_response.message.contains("トップテックピック記事に設定されているため非公開にできません"));

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
