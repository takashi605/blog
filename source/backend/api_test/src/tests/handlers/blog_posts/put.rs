#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, Image, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn pub_pickup_posts() -> Result<()> {
    let url = "http://localhost:8000/blog/posts/pickup";

    let pickup_posts_for_req: Vec<BlogPost> = helper::create_pickup_posts_for_req().await.unwrap();
    let pickup_posts_json_for_req: String = serde_json::to_string(&pickup_posts_for_req).context("JSON データに変換できませんでした").unwrap();

    let put_request = Request::new(Methods::PUT { body: pickup_posts_json_for_req }, &url);

    let resp = put_request.send().await.unwrap().text().await.unwrap();
    let pickup_posts_by_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    pickup_posts_by_resp.iter().zip(pickup_posts_for_req.iter()).for_each(|(by_resp, for_req)| {
      test_helper::assert_blog_post_without_uuid(by_resp, for_req);
    });
    Ok(())
  }

  mod helper {
    use common::types::api::response::H3Block;

    use super::*;

    pub async fn create_pickup_posts_for_req() -> Result<Vec<BlogPost>> {
      let pickup_posts = vec![
        create_blog_post_for_req(Uuid::new_v4(), "タイトル1").await?,
        create_blog_post_for_req(Uuid::new_v4(), "タイトル2").await?,
        create_blog_post_for_req(Uuid::new_v4(), "タイトル3").await?,
      ];

      Ok(pickup_posts)
    }

    pub async fn create_blog_post_for_req(id: Uuid, title: &str) -> Result<BlogPost> {
      // DB 上に存在する画像を使わないとエラーするので、適当な画像を取得する
      let thumbnail = fetch_thumbnail_image().await?;
      let blog_post = BlogPost {
        id,
        title: title.to_string(),
        thumbnail,
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
        ],
      };

      Ok(blog_post)
    }

    async fn fetch_thumbnail_image() -> Result<Image> {
      let url = "http://localhost:8000/blog/images";
      let resp = Request::new(Methods::GET, &url).send().await?.text().await?;

      let images_resp: Vec<Image> = serde_json::from_str(&resp).context("JSON データをパースできませんでした")?;

      if images_resp.len() == 0 {
        panic!("画像が取得できませんでした");
      }

      Ok(images_resp[0].clone())
    }
  }
}
