use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post)).route("", web::post().to(handle_funcs::create_blog_post))
}

mod handle_funcs {
  use crate::server::handlers::{crud::fetch_blog_post::fetch_single_blog_post, response::err::ApiCustomError};
  use actix_web::{web, HttpResponse, Responder};
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, H3Block, Image, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  pub async fn get_blog_post(path: web::Path<String>) -> Result<impl Responder, ApiCustomError> {
    let post_id = path.into_inner();
    let uuid = Uuid::parse_str(&post_id).map_err(|_| ApiCustomError::Other(anyhow::anyhow!("パスパラメータのパースに失敗しました。")))?;
    let blog_post = fetch_single_blog_post(uuid).await?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  pub async fn create_blog_post() -> Result<impl Responder, ApiCustomError> {
    let post_id =
      Uuid::parse_str("2f9795cd-7e7d-453e-96e5-228f36a03fd1")
        .map_err(|_| ApiCustomError::Other(anyhow::anyhow!("UUID のパースに失敗しました。")))?;
    let post_date = "2021-01-01".parse().map_err(|_| ApiCustomError::Other(anyhow::anyhow!("日付のパースに失敗しました。")))?;
    let last_update_date = "2021-01-02".parse().map_err(|_| ApiCustomError::Other(anyhow::anyhow!("日付のパースに失敗しました。")))?;

    // TODO モックデータなので適切なタイミングで本物に置き換える
    let resp_blog_post = BlogPost {
      id: post_id,
      title: "テスト記事".to_string(),
      thumbnail: Image {
        path: "test-coffee".to_string(),
      },
      post_date,
      last_update_date,
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
        })
      ],
    };

    Ok(HttpResponse::Ok().json(resp_blog_post))
  }
}
