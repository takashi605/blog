#[cfg(test)]
mod tests {
  use crate::tests::helper::http::methods::Methods;
  use crate::tests::helper::http::request::Request;
  use anyhow::{Context, Result};
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn get_single_blog_post() -> Result<()> {
    let url = format!("http://localhost:8000/blog/posts/{uuid}", uuid = helper::target_post_id()?);
    let resp = Request::new(Methods::GET, &url).send().await?.text().await?;

    let actual_blog_post_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした")?;
    let expected_blog_post: BlogPost = helper::expected_blog_post()?;

    helper::assert_blog_post(&actual_blog_post_resp, &expected_blog_post);
    Ok(())
  }

  mod helper {
    use common::types::api::response::H3Block;

    use super::*;

    pub fn expected_blog_post() -> Result<BlogPost> {
      let target_user_id: Uuid = target_post_id()?;
      let blog_post = BlogPost {
        id: target_user_id,
        title: "初めての技術スタックへの挑戦".to_string(),
        thumbnail: Image { path: "test-coffee".to_string() },
        post_date: "2021-01-01".parse()?,
        last_update_date: "2021-01-02".parse()?,
        contents: vec![
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "新しい技術スタックに挑戦することは、いつも冒険と学びの場です。未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。".to_string(),
              styles: Style { bold: false },
            }],
            type_field: "paragraph".to_string(),
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "最初のステップ".to_string(),
            type_field: "h2".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "学習環境の準備".to_string(),
            type_field: "h3".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。".to_string(),
              styles: Style { bold: false },
            }],
            type_field: "paragraph".to_string(),
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "学びの中での気づき".to_string(),
            type_field: "h2".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "試行錯誤の重要性".to_string(),
            type_field: "h3".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![
              RichText {
                text: "試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。".to_string(),
                styles: Style { bold: false },
              },
              RichText {
                text: "繰り返しの実践が技術力を向上させる鍵です。".to_string(),
                styles: Style { bold: true },
              },
              RichText {
                text: "新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。".to_string(),
                styles: Style { bold: false },
              },
            ],
            type_field: "paragraph".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "課題に対処するプロセス".to_string(),
            type_field: "h3".to_string(),
          }),
          BlogPostContent::Image(ImageBlock {
            id: Uuid::new_v4(),
            path: "test-book".to_string(),
            type_field: "image".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "技術の習得には多くの時間と試行錯誤が必要です。途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。".to_string(),
              styles: Style { bold: false },
            }],
            type_field: "paragraph".to_string(),
          }),
        ],
      };

      Ok(blog_post)
    }

    pub fn target_post_id() -> Result<Uuid> {
      let uuid = Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801")?;
      Ok(uuid)
    }

    // この関数は content の id 以外のフィールドを比較する
    pub fn assert_blog_post(actual: &BlogPost, expected: &BlogPost) {
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
        println!("actual_block: {:?}", actual_block);
        println!("expected_block: {:?}", expected_block);
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
  }
}
