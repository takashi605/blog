#[cfg(test)]
mod tests {
  use crate::tests::handlers::blog_posts::post::helper;
  use crate::tests::helper::http::methods::Methods;
  use crate::tests::helper::http::request::Request;
  use anyhow::{Context, Result};
  use common::types::api::{BlogPost, CreateBlogPostRequest};

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_blog_post() -> Result<()> {
    let url = "http://localhost:8001/admin/blog/posts";

    // テスト用のブログ記事 json を作成
    let blog_post_for_req: CreateBlogPostRequest = helper::create_blog_post_request_for_req("テスト記事").await.unwrap();
    let blog_post_json_for_req: String = serde_json::to_string(&blog_post_for_req).context("JSON データに変換できませんでした").unwrap();

    // POST リクエストを送信 -> レスポンスを取得 -> JSON データを構造体にパース
    let post_request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);
    let resp = post_request.send().await.unwrap().text().await.unwrap();
    let blog_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    // レスポンスのBlogPostとリクエストのCreateBlogPostRequestの内容を比較
    assert_eq!(blog_post_by_resp.title, blog_post_for_req.title);
    assert_eq!(blog_post_by_resp.post_date, blog_post_for_req.post_date);
    assert_eq!(blog_post_by_resp.last_update_date, blog_post_for_req.last_update_date);
    assert_eq!(blog_post_by_resp.published_date, blog_post_for_req.published_date);
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn post_blog_post_with_future_published_date() -> Result<()> {
    let url = "http://localhost:8001/admin/blog/posts";

    // 未来の公開日を設定したテスト用のブログ記事 json を作成
    let blog_post_for_req: CreateBlogPostRequest = helper::create_blog_post_request_with_future_date("未来公開記事").await.unwrap();
    let blog_post_json_for_req: String = serde_json::to_string(&blog_post_for_req).context("JSON データに変換できませんでした").unwrap();

    // POST リクエストを送信 -> レスポンスを取得 -> JSON データを構造体にパース
    let post_request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);
    let resp = post_request.send().await.unwrap().text().await.unwrap();
    // println!("API Response: {}", resp); // レスポンス内容をログ出力（コミット前にコメントアウト）
    let blog_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    // レスポンスのBlogPostとリクエストのCreateBlogPostRequestの内容を比較
    assert_eq!(blog_post_by_resp.title, blog_post_for_req.title);
    assert_eq!(blog_post_by_resp.post_date, blog_post_for_req.post_date);
    assert_eq!(blog_post_by_resp.last_update_date, blog_post_for_req.last_update_date);
    assert_eq!(blog_post_by_resp.published_date, blog_post_for_req.published_date);

    // 未来の公開日が正しく設定されていることを確認
    let future_date = chrono::NaiveDate::from_ymd_opt(2025, 12, 31).unwrap();
    assert_eq!(blog_post_by_resp.published_date, future_date);
    Ok(())
  }
}

mod helper {
  use crate::tests::handlers::blog_posts::test_helper;
  use anyhow::Result;
  use common::types::api::{
    CreateBlogPostContentRequest, CreateBlogPostRequest, CreateCodeBlockRequest, CreateH2BlockRequest, CreateH3BlockRequest, CreateImageBlockRequest,
    CreateImageContentRequest, CreateParagraphBlockRequest, Link, RichText, Style,
  };

  pub async fn create_blog_post_request_for_req(title: &str) -> Result<CreateBlogPostRequest> {
    // DB 上に存在する画像を使わないとエラーするので、適当な画像を取得する
    let any_image = test_helper::fetch_any_image().await?;
    let blog_post_request = CreateBlogPostRequest {
      title: title.to_string(),
      thumbnail: CreateImageContentRequest {
        id: Some(any_image.id), // 既存画像のIDを指定
        path: any_image.path.clone(),
      },
      post_date: "2021-01-01".parse()?,
      last_update_date: "2021-01-02".parse()?,
      published_date: "2021-01-03".parse()?,
      contents: vec![
        CreateBlogPostContentRequest::Paragraph(CreateParagraphBlockRequest {
          text: vec![
            RichText {
              text: "これはテスト用の文字列です。".to_string(),
              styles: Style { bold: true, inline_code: true },
              link: Option::None,
            },
            RichText {
              text: "これはテスト用の文字列その2です。".to_string(),
              styles: Style {
                bold: false,
                inline_code: false,
              },
              link: Option::Some(Link {
                url: "https://example.com".to_string(),
              }),
            },
          ],
        }),
        CreateBlogPostContentRequest::H2(CreateH2BlockRequest {
          text: "見出しレベル2".to_string(),
        }),
        CreateBlogPostContentRequest::H3(CreateH3BlockRequest {
          text: "見出しレベル3".to_string(),
        }),
        CreateBlogPostContentRequest::Image(CreateImageBlockRequest { path: any_image.path.clone() }),
        CreateBlogPostContentRequest::Code(CreateCodeBlockRequest {
          title: "サンプルコード".to_string(),
          code: "console.log('Hello, World!')".to_string(),
          language: "javascript".to_string(),
        }),
      ],
    };

    Ok(blog_post_request)
  }

  pub async fn create_blog_post_request_with_future_date(title: &str) -> Result<CreateBlogPostRequest> {
    // DB 上に存在する画像を使わないとエラーするので、適当な画像を取得する
    let any_image = test_helper::fetch_any_image().await?;
    let blog_post_request = CreateBlogPostRequest {
      title: title.to_string(),
      thumbnail: CreateImageContentRequest {
        id: Some(any_image.id), // 既存画像のIDを指定
        path: any_image.path.clone(),
      },
      post_date: "2021-01-01".parse()?,
      last_update_date: "2021-01-02".parse()?,
      published_date: "2025-12-31".parse()?, // 未来の公開日を設定
      contents: vec![CreateBlogPostContentRequest::Paragraph(CreateParagraphBlockRequest {
        text: vec![RichText {
          text: "これは未来に公開される記事です。".to_string(),
          styles: Style {
            bold: false,
            inline_code: false,
          },
          link: Option::None,
        }],
      })],
    };

    Ok(blog_post_request)
  }
}
