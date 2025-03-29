use crate::tests::helper::http::methods::Methods;
use crate::tests::helper::http::request::Request;
use anyhow::{Context, Result};
use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ParagraphBlock, RichText, Style};
use uuid::Uuid;

pub fn assert_blog_post_without_uuid(actual: &BlogPost, expected: &BlogPost) {
  // BlogPost の id, title, post_date などを比較
  assert_eq!(actual.id, expected.id);
  assert_eq!(actual.title, expected.title);
  assert_eq!(actual.thumbnail.path, expected.thumbnail.path);
  assert_eq!(actual.post_date, expected.post_date);
  assert_eq!(actual.last_update_date, expected.last_update_date);

  // contents が空だとテストにならないのではじく
  assert!(actual.contents.len() > 0);

  // contents の要素数をチェック
  assert_eq!(actual.contents.len(), expected.contents.len());

  // 各要素ごとに「id だけ無視して他は比較」
  for (i, (actual_block, expected_block)) in actual.contents.iter().zip(&expected.contents).enumerate() {
    match actual_block {
      BlogPostContent::H2(a) => {
        // TODO json にシリアライズするタイミングで H2 or H3型の情報が抜け落ちているので、Heading 型に統一する
        let e = match expected_block {
          BlogPostContent::H2(e) => e,
          BlogPostContent::H3(e) => &H2Block {
            id: e.id,
            text: e.text.clone(),
            type_field: e.type_field.clone(),
          },
          _ => panic!("H2 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H2のテキスト不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "H2のtype_field不一致: contents[{}]", i);
      }
      BlogPostContent::H3(a) => {
        let e = match expected_block {
          BlogPostContent::H3(e) => e,
          _ => panic!("H3 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H3のテキスト不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "H3のtype_field不一致: contents[{}]", i);
      }
      BlogPostContent::Paragraph(a) => {
        let e = match expected_block {
          BlogPostContent::Paragraph(e) => e,
          _ => panic!("Paragraph 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "Paragraphのテキスト不一致: contents[{}]", i);
      }
      BlogPostContent::Image(a) => {
        let e = match expected_block {
          BlogPostContent::Image(e) => e,
          _ => panic!("Image 以外の要素が入っています"),
        };
        assert_eq!(a.path, e.path, "Imageのpath不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "Imageのtype_field不一致: contents[{}]", i);
      }
    }
  }
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
