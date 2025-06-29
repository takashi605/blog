use crate::tests::helper::http::methods::Methods;
use crate::tests::helper::http::request::Request;
use anyhow::{Context, Result};
use common::types::api::{BlogPost, BlogPostContent, H2Block, Image, ParagraphBlock, RichText, Style};
use uuid::Uuid;

pub fn assert_blog_post_without_uuid(actual: &BlogPost, expected: &BlogPost) {
  // BlogPost の title, post_date などを比較（IDは自動生成のため除外）
  assert_eq!(actual.title, expected.title);
  assert_eq!(actual.thumbnail.path, expected.thumbnail.path);
  assert_eq!(actual.post_date, expected.post_date);
  assert_eq!(actual.last_update_date, expected.last_update_date);

  // contents が空だとテストにならないのではじく
  assert!(actual.contents.len() > 0);

  // contents の要素数をチェック
  assert_eq!(actual.contents.len(), expected.contents.len());

  // 各要素ごとに「id」だけ無視して他は比較
  for (i, (actual_block, expected_block)) in actual.contents.iter().zip(&expected.contents).enumerate() {
    match actual_block {
      BlogPostContent::H2(a) => {
        // TODO json にシリアライズするタイミングで H2 or H3型の情報が抜け落ちているので、Heading 型に統一する
        let e = match expected_block {
          BlogPostContent::H2(e) => e,
          BlogPostContent::H3(e) => &H2Block {
            id: e.id,
            text: e.text.clone(),
          },
          _ => panic!("H2 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H2のテキスト不一致: contents[{}]", i);
      }
      BlogPostContent::H3(a) => {
        let e = match expected_block {
          BlogPostContent::H3(e) => e,
          _ => panic!("H3 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H3のテキスト不一致: contents[{}]", i);
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
      }
      BlogPostContent::Code(actual_code_block) => {
        let expected_code_block = match expected_block {
          BlogPostContent::Code(e) => e,
          _ => panic!("CodeBlock 以外の要素が入っています"),
        };
        assert_eq!(actual_code_block.title, expected_code_block.title, "CodeBlock の title 不一致: contents[{}]", i);
        assert_eq!(actual_code_block.code, expected_code_block.code, "CodeBlock の code 不一致: contents[{}]", i);
        assert_eq!(
          actual_code_block.language, expected_code_block.language,
          "CodeBlock の language 不一致: contents[{}]",
          i
        );
      }
    }
  }
}

pub async fn fetch_any_image() -> Result<Image> {
  let url = "http://localhost:8001/blog/images";
  let resp = Request::new(Methods::GET, &url).send().await?.text().await?;

  let images_resp: Vec<Image> = serde_json::from_str(&resp).context("JSON データをパースできませんでした")?;

  if images_resp.len() == 0 {
    panic!("画像が取得できませんでした");
  }

  Ok(images_resp[0].clone())
}

pub fn minimal_blog_post1() -> Result<BlogPost> {
  let blog_post = BlogPost {
    id: Uuid::parse_str("20b73825-9a6f-4901-aa42-e104a8d2c4f6")?,
    title: "ミニマル記事1".to_string(),
    thumbnail: Image {
      id: Uuid::new_v4(),
      path: "test-book".to_string(),
    },
    post_date: "2025-01-01".parse()?,
    last_update_date: "2025-01-01".parse()?,
    published_date: "1900-01-01".parse()?,
    contents: vec![
      BlogPostContent::H2(H2Block {
        id: Uuid::new_v4(),
        text: "ミニマル記事1の見出し".to_string(),
      }),
      BlogPostContent::Paragraph(ParagraphBlock {
        id: Uuid::new_v4(),
        text: vec![RichText {
          text: "これはミニマル記事1の段落です。".to_string(),
          styles: Style {
            bold: false,
            inline_code: false,
          },
          link: Option::None,
        }],
      }),
    ],
  };
  Ok(blog_post)
}

pub fn minimal_blog_post2() -> Result<BlogPost> {
  let blog_post = BlogPost {
    id: Uuid::parse_str("91450c47-9845-4398-ad3a-275118d223ea")?,
    title: "ミニマル記事2".to_string(),
    thumbnail: Image {
      id: Uuid::new_v4(),
      path: "test-mechanical".to_string(),
    },
    post_date: "2025-02-01".parse()?,
    last_update_date: "2025-02-01".parse()?,
    published_date: "1900-01-01".parse()?,
    contents: vec![
      BlogPostContent::H2(H2Block {
        id: Uuid::new_v4(),
        text: "ミニマル記事2の見出し".to_string(),
      }),
      BlogPostContent::Paragraph(ParagraphBlock {
        id: Uuid::new_v4(),
        text: vec![RichText {
          text: "これはミニマル記事2の段落です。".to_string(),
          styles: Style {
            bold: false,
            inline_code: false,
          },
          link: Option::None,
        }],
      }),
    ],
  };
  Ok(blog_post)
}

pub fn minimal_blog_post3() -> Result<BlogPost> {
  let blog_post = BlogPost {
    id: Uuid::parse_str("f735a7b7-8bbc-4cb5-b6cf-c188734f64d3")?,
    title: "ミニマル記事3".to_string(),
    thumbnail: Image {
      id: Uuid::new_v4(),
      path: "test-coffee".to_string(),
    },
    post_date: "2025-03-01".parse()?,
    last_update_date: "2025-03-01".parse()?,
    published_date: "1900-01-01".parse()?,
    contents: vec![
      BlogPostContent::H2(H2Block {
        id: Uuid::new_v4(),
        text: "ミニマル記事3の見出し".to_string(),
      }),
      BlogPostContent::Paragraph(ParagraphBlock {
        id: Uuid::new_v4(),
        text: vec![RichText {
          text: "これはミニマル記事3の段落です。".to_string(),
          styles: Style {
            bold: false,
            inline_code: false,
          },
          link: Option::None,
        }],
      }),
    ],
  };
  Ok(blog_post)
}

pub fn expected_future_blog_post() -> Result<BlogPost> {
  let target_post_id: Uuid = future_post_id()?;

  // シードファイルでは CURRENT_DATE を使用しているため、今日の日付を使用
  let today = chrono::Utc::now().date_naive();
  let today_str = today.format("%Y-%m-%d").to_string();

  // 公開日は50年後に設定（シードファイルの CURRENT_TIMESTAMP + INTERVAL '50 years' に対応）
  let published_date = today + chrono::Duration::days(365 * 50);
  let published_date_str = published_date.format("%Y-%m-%d").to_string();

  let blog_post = BlogPost {
    id: target_post_id,
    title: "50年後記事1".to_string(),
    thumbnail: Image {
      id: Uuid::new_v4(),
      path: "test-book".to_string(),
    },
    post_date: today_str.parse()?,
    last_update_date: today_str.parse()?,
    published_date: published_date_str.parse()?,
    contents: vec![
      BlogPostContent::H2(H2Block {
        id: Uuid::new_v4(),
        text: "50年後記事1の見出し".to_string(),
      }),
      BlogPostContent::Paragraph(ParagraphBlock {
        id: Uuid::new_v4(),
        text: vec![RichText {
          text: "これは50年後に公開される予定の記事の段落です。".to_string(),
          styles: Style {
            bold: false,
            inline_code: false,
          },
          link: Option::None,
        }],
      }),
    ],
  };

  Ok(blog_post)
}

pub fn future_post_id() -> Result<Uuid> {
  let uuid = Uuid::parse_str("12345678-90ab-cdef-1234-567890abcdef")?;
  Ok(uuid)
}
