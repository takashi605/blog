#[cfg(test)]
mod tests {
  use crate::tests::helper::http::methods::Methods;
  use crate::tests::helper::http::request::Request;
  use anyhow::Result;
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn get_single_blog_post() -> Result<()> {
    let target_user_id: Uuid = Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801")?;
    let expected_resp: BlogPost = BlogPost {
      id: target_user_id,
      title: "テストタイトル".to_string(),
      thumbnail: Image { path: "test-book".to_string() },
      post_date: "2021-01-01".parse()?,
      last_update_date: "2021-01-01".parse()?,
      contents: vec![
        BlogPostContent::H2(H2Block {
          id: Uuid::new_v4(),
          text: "見出し2".to_string(),
          type_field: "h2".to_string(),
        }),
        BlogPostContent::Paragraph(ParagraphBlock {
          id: Uuid::new_v4(),
          text: RichText {
            text: "段落".to_string(),
            styles: vec![Style { bold: true }],
          },
          type_field: "paragraph".to_string(),
        }),
        BlogPostContent::Image(ImageBlock {
          id: Uuid::new_v4(),
          path: "test-image".to_string(),
          type_field: "image".to_string(),
        }),
      ],
    };
    let resp = Request::new(Methods::GET, "http://localhost:8000/blog/posts/672f2772-72b5-404a-8895-b1fbbf310801").send().await?.text().await?;
    let blog_post: BlogPost = serde_json::from_str(&resp)?;
    assert_blog_post(&blog_post, &expected_resp);
    Ok(())
  }

  // この関数は content の id 以外のフィールドを比較する
  fn assert_blog_post(actual: &BlogPost, expected: &BlogPost) {
    // BlogPost の id, title, post_date などを比較
    assert_eq!(actual.id, expected.id);
    assert_eq!(actual.title, expected.title);
    assert_eq!(actual.thumbnail, expected.thumbnail);
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
          let e = match expected_block {
            BlogPostContent::H2(e) => e,
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
}
