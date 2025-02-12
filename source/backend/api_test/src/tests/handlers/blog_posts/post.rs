#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, Image, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn post_single_blog_post() -> Result<()> {
    let url = "http://localhost:8000/blog/posts";

    let blog_post_for_req: BlogPost = helper::create_blog_post_for_req().await.unwrap();
    let blog_post_json_for_req: String = serde_json::to_string(&blog_post_for_req).context("JSON データに変換できませんでした").unwrap();

    let post_request = Request::new(Methods::POST { body: blog_post_json_for_req }, &url);

    let resp = post_request.send().await.unwrap().text().await.unwrap();

    let blog_post_by_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    test_helper::assert_blog_post_without_uuid(&blog_post_by_resp, &blog_post_for_req);
    Ok(())
  }

  mod helper {
    use common::types::api::response::H3Block;

    use super::*;

    pub async fn create_blog_post_for_req() -> Result<BlogPost> {
      // DB 上に存在する画像を使わないとエラーするので、適当な画像を取得する
      let thumbnail = fetch_thumbnail_image().await?;
      let target_post_id: Uuid = target_post_id()?;
      let blog_post = BlogPost {
        id: target_post_id,
        title: "テスト記事".to_string(),
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

    pub fn target_post_id() -> Result<Uuid> {
      let uuid = Uuid::parse_str("2f9795cd-7e7d-453e-96e5-228f36a03fd1")?;
      Ok(uuid)
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
