#[cfg(test)]
mod tests {
  use crate::tests::helper::http::request::Request;
  use crate::tests::{handlers::blog_posts::test_helper, helper::http::methods::Methods};
  use anyhow::{Context, Result};
  use common::types::api::{BlogPost, BlogPostContent, H2Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  #[tokio::test(flavor = "current_thread")]
  async fn get_single_blog_post() -> Result<()> {
    let url = format!("http://localhost:8001/blog/posts/{uuid}", uuid = helper::regular_post_id().unwrap());
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_post: BlogPost = helper::expected_regular_blog_post().unwrap();

    test_helper::assert_blog_post_without_uuid(&actual_blog_post_resp, &expected_blog_post);
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_top_tech_pick_blog_post() -> Result<()> {
    let url = "http://localhost:8001/blog/posts/top-tech-pick";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_post: BlogPost = helper::expected_regular_blog_post().unwrap();

    test_helper::assert_blog_post_without_uuid(&actual_blog_post_resp, &expected_blog_post);

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_pickup_blog_posts() -> Result<()> {
    let url = "http://localhost:8001/blog/posts/pickup";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_post: Vec<BlogPost> = helper::expected_pickup_blog_posts().unwrap();

    assert_eq!(actual_blog_post_resp.len(), expected_blog_post.len());
    for (actual, expected) in actual_blog_post_resp.iter().zip(expected_blog_post.iter()) {
      test_helper::assert_blog_post_without_uuid(actual, expected);
    }
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_popular_blog_posts() -> Result<()> {
    let url = "http://localhost:8001/blog/posts/popular";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_posts: Vec<BlogPost> = helper::expected_popular_blog_posts().unwrap();

    assert_eq!(actual_blog_post_resp.len(), expected_blog_posts.len());
    for (actual, expected) in actual_blog_post_resp.iter().zip(expected_blog_posts.iter()) {
      test_helper::assert_blog_post_without_uuid(actual, expected);
    }
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_latest_blog_posts() -> Result<()> {
    let url = "http://localhost:8001/blog/posts/latest";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let blog_post_resp: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    for i in 0..blog_post_resp.len() - 1 {
      let current_post = &blog_post_resp[i];
      let next_post = &blog_post_resp[i + 1];
      assert!(current_post.post_date >= next_post.post_date);
    }
    Ok(())
  }

  // 存在しないブログ記事を取得すると 404 エラーとエラーメッセージが返る
  #[tokio::test(flavor = "current_thread")]
  async fn get_not_exist_blog_post() -> Result<()> {
    let url = format!("http://localhost:8001/blog/posts/{uuid}", uuid = Uuid::new_v4());
    let resp = Request::new(Methods::GET, &url).send().await.unwrap();
    let resp_status = resp.status();
    let resp_body = resp.text().await.unwrap();

    // ステータスが 404 エラーであることを確認
    assert_eq!(resp_status, 404);
    assert_eq!(resp_body.contains("ブログ記事が見つかりませんでした。"), true);
    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_admin_blog_posts_include_unpublished() -> Result<()> {
    let url = "http://localhost:8001/admin/blog/posts?include_unpublished=true";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_posts: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    // 50年後記事（未公開記事）が含まれていることを確認
    let future_post_exists = actual_blog_posts.iter().any(|post| post.title == "50年後記事1");
    assert!(future_post_exists, "50年後記事1（未公開記事）が取得結果に含まれていません");

    // 既存の公開記事も含まれていることを確認
    let regular_post_exists = actual_blog_posts.iter().any(|post| post.title == "初めての技術スタックへの挑戦");
    assert!(regular_post_exists, "通常の公開記事が取得結果に含まれていません");

    // 複数の記事が取得されることを確認（公開記事 + 未公開記事）
    assert!(
      actual_blog_posts.len() >= 4,
      "4件以上の記事が取得されるべきです。実際: {}",
      actual_blog_posts.len()
    );

    Ok(())
  }

  #[tokio::test(flavor = "current_thread")]
  async fn get_admin_blog_posts_exclude_unpublished() -> Result<()> {
    let url = "http://localhost:8001/admin/blog/posts?include_unpublished=false";
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_posts: Vec<BlogPost> = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();

    // 50年後記事（未公開記事）が含まれていないことを確認
    let future_post_exists = actual_blog_posts.iter().any(|post| post.title == "50年後記事1");
    assert!(!future_post_exists, "50年後記事1（未公開記事）が取得結果に含まれています");

    // 既存の公開記事は含まれていることを確認
    let regular_post_exists = actual_blog_posts.iter().any(|post| post.title == "初めての技術スタックへの挑戦");
    assert!(regular_post_exists, "通常の公開記事が取得結果に含まれていません");

    // 公開記事のみが取得されることを確認
    assert!(
      actual_blog_posts.len() >= 3,
      "3件以上の公開記事が取得されるべきです。実際: {}",
      actual_blog_posts.len()
    );

    Ok(())
  }

  // 管理者用: 単一記事取得（未公開記事も含む）
  #[tokio::test(flavor = "current_thread")]
  async fn get_admin_single_blog_post_published() -> Result<()> {
    let url = format!("http://localhost:8001/admin/blog/posts/{uuid}", uuid = helper::regular_post_id().unwrap());
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_post: BlogPost = helper::expected_regular_blog_post().unwrap();

    test_helper::assert_blog_post_without_uuid(&actual_blog_post_resp, &expected_blog_post);
    Ok(())
  }

  // 管理者用: 単一記事取得（未公開記事）
  #[tokio::test(flavor = "current_thread")]
  async fn get_admin_single_blog_post_unpublished() -> Result<()> {
    let url = format!("http://localhost:8001/admin/blog/posts/{uuid}", uuid = test_helper::future_post_id().unwrap());
    let resp = Request::new(Methods::GET, &url).send().await.unwrap().text().await.unwrap();

    let actual_blog_post_resp: BlogPost = serde_json::from_str(&resp).context("JSON データをパースできませんでした").unwrap();
    let expected_blog_post: BlogPost = test_helper::expected_future_blog_post().unwrap();

    test_helper::assert_blog_post_without_uuid(&actual_blog_post_resp, &expected_blog_post);
    Ok(())
  }

  // 管理者用: 存在しない記事取得で404エラー
  #[tokio::test(flavor = "current_thread")]
  async fn get_admin_single_blog_post_not_found() -> Result<()> {
    let url = format!("http://localhost:8001/admin/blog/posts/{uuid}", uuid = Uuid::new_v4());
    let resp = Request::new(Methods::GET, &url).send().await.unwrap();
    let resp_status = resp.status();
    let resp_body = resp.text().await.unwrap();

    // ステータスが 404 エラーであることを確認
    assert_eq!(resp_status, 404);
    assert_eq!(resp_body.contains("ブログ記事が見つかりませんでした。"), true);
    Ok(())
  }

  mod helper {
    use common::types::api::{CodeBlock, H3Block, Link};

    use super::*;

    pub fn expected_regular_blog_post() -> Result<BlogPost> {
      let target_post_id: Uuid = regular_post_id()?;
      let blog_post = BlogPost {
        id: target_post_id,
        title: "初めての技術スタックへの挑戦".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-coffee".to_string()
        },
        post_date: "2021-01-01".parse()?,
        last_update_date: "2021-01-02".parse()?,
        published_date: "2021-01-01".parse()?,
        contents: vec![
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "新しい技術スタックに挑戦することは、いつも冒険と学びの場です。未経験の技術に取り組むたびに、新たな可能性が広がり、成長を実感します。未知のフレームワークやツールを使いこなしていく過程で、技術と一体になる感覚を得ることができます。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "最初のステップ".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "学習環境の準備".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "すべては一歩から始まります。既存の快適な環境を離れ、新しい技術への挑戦を始めます。最初はドキュメントを読み、サンプルコードを試しながら理解を深めていきます。コードを読むことは、詳細なロジックを理解するための重要な歩準です。一緒にコードを書き試していくと、その過程で新しい発見や意外な気づきが広がり、それらが学習の楽しさにつながります。学ぶつれ、最初は難しく思えたことも後になると理解出来るようになり、それによって自信も上がってきます。最初の図書の読み方やツールの使い方を学んでいく中で、学ぶことの楽しさが潤しみ、目標に向かう過程がより愉快なものに変わっていきます。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "学びの中での気づき".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "試行錯誤の重要性".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![
              RichText {
                text: "試行錯誤は技術習得において欠かせないプロセスです。一度でうまくいかないことがほとんどですが、その失敗から学ぶことで次のステップへのヒントを得ることができます。新しい技術を学ぶ過程では、複数のアプローチを試してみて、何が効果的で何がそうでないかを確認することが非常に重要です。このプロセスによって、自分に合った最適な方法を見つけ出し、技術に対する理解が深まります。".to_string(),
                styles: Style { bold: false, inline_code: false },
                link: Option::Some(Link {
                  url: "https://example.com".to_string(),
                }),
              },
              RichText {
                text: "繰り返しの実践が技術力を向上させる鍵です。".to_string(),
                styles: Style { bold: true, inline_code: false },
                link: Option::None,
              },
              RichText {
                text: "新しいコードを試し、デバッグしながら学ぶことで、単なる理論以上の実践的なスキルを身に付けることができます。".to_string(),
                styles: Style { bold: false, inline_code: true },
                link: Option::None,
              },
            ],
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "課題に対処するプロセス".to_string(),
          }),
          BlogPostContent::Image(ImageBlock {
            id: Uuid::new_v4(),
            path: "test-book".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "技術の習得には多くの時間と試行錯誤が必要です。途中でエラーに遭遇したり、思った通りに動作しないこともありますが、それが学びの一部です。失敗を繰り返しながら改善を続けることで、徐々に技術が身についていきます。問題に直面した際に、その原因を調査し、解決する過程で多くの新しい知識を得ることができます。このプロセスは、ただ単に技術を学ぶだけでなく、課題解決能力や論理的な思考力を鍛える機会にもなります。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
          BlogPostContent::Code(CodeBlock {
            id: Uuid::new_v4(),
            title: "サンプルコード".to_string(),
            code: "console.log(\"Hello, World!\");".to_string(),
            language: "javascript".to_string(),
          })
        ],
      };

      Ok(blog_post)
    }

    pub fn regular_post_id() -> Result<Uuid> {
      let uuid = Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801")?;
      Ok(uuid)
    }

    pub fn expected_pickup_blog_posts() -> Result<Vec<BlogPost>> {
      let result = vec![
        test_helper::minimal_blog_post1()?,
        test_helper::minimal_blog_post2()?,
        expected_regular_blog_post()?,
      ];
      Ok(result)
    }

    pub fn expected_popular_blog_posts() -> Result<Vec<BlogPost>> {
      let result = vec![
        test_helper::minimal_blog_post2()?,
        test_helper::minimal_blog_post3()?,
        expected_regular_blog_post()?,
      ];
      Ok(result)
    }
  }
}
