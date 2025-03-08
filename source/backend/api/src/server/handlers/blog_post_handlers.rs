pub mod create_blog_post;
pub mod fetch_blog_post;

use actix_web::{web, Scope};

use super::image_handlers::image_scope;

// TODO image_scope が同階層の別モジュールとなっており構造的に気持ち悪いので、上手く階層化する
pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope()).service(image_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts")
    .route("/pickup", web::get().to(handle_funcs::get_pickup_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
    .route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use super::{create_blog_post::create_single_blog_post, fetch_blog_post::fetch_single_blog_post};

  use crate::server::handlers::response::err::ApiCustomError;
  use actix_web::{web, HttpResponse, Responder};
  use anyhow::Result;
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    let post_id = path.into_inner();
    let uuid = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(uuid).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  pub async fn get_pickup_blog_posts() -> Result<impl Responder, ApiCustomError> {
    let blog_posts = expected_pickup_blog_posts().map_err(|_| ApiCustomError::Other(anyhow::anyhow!("ブログ記事の取得に失敗しました。")))?;

    Ok(HttpResponse::Ok().json(blog_posts))
  }

  pub async fn create_blog_post(blog_post_req: web::Json<BlogPost>) -> Result<impl Responder, ApiCustomError> {
    println!("create_blog_post");
    let blog_post_req = blog_post_req.into_inner();

    let inserted_blog_post = create_single_blog_post(blog_post_req).await?;
    Ok(HttpResponse::Ok().json(inserted_blog_post))
  }

  fn expected_pickup_blog_posts() -> Result<Vec<BlogPost>> {
    let result = vec![expected_minimal_blog_post1()?, expected_minimal_blog_post2()?, expected_regular_blog_post()?];
    Ok(result)
  }

  fn regular_post_id() -> Result<Uuid> {
    let uuid = Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801")?;
    Ok(uuid)
  }

  fn expected_minimal_blog_post1() -> Result<BlogPost> {
    let blog_post = BlogPost {
      id: Uuid::parse_str("20b73825-9a6f-4901-aa42-e104a8d2c4f6")?,
      title: "ミニマル記事1".to_string(),
      thumbnail: Image {
        id: Uuid::new_v4(),
        path: "test-book".to_string(),
      },
      post_date: "2025-01-01".parse()?,
      last_update_date: "2025-01-01".parse()?,
      contents: vec![
        BlogPostContent::H2(H2Block {
          id: Uuid::new_v4(),
          text: "ミニマル記事1の見出し".to_string(),
          type_field: "h2".to_string(),
        }),
        BlogPostContent::Paragraph(ParagraphBlock {
          id: Uuid::new_v4(),
          text: vec![RichText {
            text: "これはミニマル記事1の段落です。".to_string(),
            styles: Style { bold: false },
          }],
          type_field: "paragraph".to_string(),
        }),
      ],
    };
    Ok(blog_post)
  }

  fn expected_regular_blog_post() -> Result<BlogPost> {
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

  fn expected_minimal_blog_post2() -> Result<BlogPost> {
    let blog_post = BlogPost {
      id: Uuid::parse_str("91450c47-9845-4398-ad3a-275118d223ea")?,
      title: "ミニマル記事2".to_string(),
      thumbnail: Image {
        id: Uuid::new_v4(),
        path: "test-mechanical".to_string(),
      },
      post_date: "2025-02-01".parse()?,
      last_update_date: "2025-02-01".parse()?,
      contents: vec![
        BlogPostContent::H2(H2Block {
          id: Uuid::new_v4(),
          text: "ミニマル記事2の見出し".to_string(),
          type_field: "h2".to_string(),
        }),
        BlogPostContent::Paragraph(ParagraphBlock {
          id: Uuid::new_v4(),
          text: vec![RichText {
            text: "これはミニマル記事2の段落です。".to_string(),
            styles: Style { bold: false },
          }],
          type_field: "paragraph".to_string(),
        }),
      ],
    };
    Ok(blog_post)
  }
}
