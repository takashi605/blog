#[cfg(test)]
mod tests {
  use crate::tests::handlers::blog_posts::post::helper;
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::BlogPost;
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_blog_post() -> Result<()> {
    let url = "http://localhost:8000/blog/posts";

    // テスト用のブログ記事 json を作成
    let blog_post_for_req: BlogPost = helper::create_blog_post_for_req(Uuid::new_v4(), "テスト記事").await.unwrap();
    let blog_post_json_for_req: String = serde_json::to_string(&blog_post_for_req).context("JSON データに変換できませんでした").unwrap();

    // POST リクエストを送信 -> レスポンスを取得 -> JSON データを構造体にパース
    let post_request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);
    let resp = post_request.send().await.unwrap().text().await.unwrap();
    let blog_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    test_helper::assert_blog_post_without_uuid(&blog_post_by_resp, &blog_post_for_req);
    Ok(())
  }
}

mod helper {
  use crate::tests::handlers::blog_posts::test_helper;
  use anyhow::Result;
  use common::types::api::response::{BlogPost, BlogPostContent, CodeBlock, H2Block, H3Block, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  pub async fn create_blog_post_for_req(id: Uuid, title: &str) -> Result<BlogPost> {
    // DB 上に存在する画像を使わないとエラーするので、適当な画像を取得する
    let any_image = test_helper::fetch_any_image().await?;
    let blog_post = BlogPost {
      id,
      title: title.to_string(),
      thumbnail: any_image.clone(),
      post_date: "2021-01-01".parse()?,
      last_update_date: "2021-01-02".parse()?,
      contents: vec![
        BlogPostContent::Paragraph(ParagraphBlock {
          id: Uuid::new_v4(),
          text: vec![RichText {
            text: "これはテスト用の文字列です。".to_string(),
            styles: Style { bold: true },
          }],
          type_field: "paragraph".to_string(),
        }),
        BlogPostContent::H2(H2Block {
          id: Uuid::new_v4(),
          text: "見出しレベル2".to_string(),
          type_field: "h2".to_string(),
        }),
        BlogPostContent::H3(H3Block {
          id: Uuid::new_v4(),
          text: "見出しレベル3".to_string(),
          type_field: "h3".to_string(),
        }),
        BlogPostContent::Image(ImageBlock {
          id: any_image.id,
          path: any_image.path,
          type_field: "image".to_string(),
        }),
        BlogPostContent::Code(CodeBlock {
          id: Uuid::new_v4(),
          type_field: "codeBlock".to_string(),
          title: "サンプルコード".to_string(),
          code: "console.log(Hello, World!)".to_string(),
          language: "javascript".to_string(),
        }),
      ],
    };

    Ok(blog_post)
  }
}
