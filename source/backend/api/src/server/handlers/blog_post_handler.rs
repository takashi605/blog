use actix_web::{web, Scope};

pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts").route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

mod handle_funcs {
  use actix_web::{HttpResponse, Responder};
  use anyhow::Result;
  use common::types::api::response::{BlogPost, BlogPostContent, H2Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
  use uuid::Uuid;

  use crate::db::tables::{
    blog_posts_table::fetch_blog_post_by_id,
    heading_blocks_table::fetch_heading_blocks_by_content_id,
    image_blocks_table::fetch_image_blocks_by_content_id,
    images_table::fetch_image_by_id,
    paragraph_blocks_table::{fetch_paragraph_block_by_content_id, fetch_rich_texts_by_paragraph, fetch_styles_by_rich_text_id},
    post_contents_table::fetch_post_contents_by_post_id,
  };

  pub async fn get_blog_post() -> impl Responder {
    // テスト取得なのでいったん unwrap で処理
    let post = fetch_blog_post_by_id(target_user_id().unwrap()).await.unwrap();
    println!("{:?}", post);
    let contents = fetch_post_contents_by_post_id(post.id).await.unwrap();
    println!("{:?}", contents);
    let thumbnail = fetch_image_by_id(post.thumbnail_image_id).await.unwrap();
    println!("{:?}", thumbnail);
    // TODO コンテントタイプが enum にできないか検討
    for content in contents {
      match content.content_type.as_str() {
        "heading" => {
          let heading_block = fetch_heading_blocks_by_content_id(content.id).await.unwrap();
          println!("{:?}", heading_block);
        }
        "image" => {
          let image_block = fetch_image_blocks_by_content_id(content.id).await.unwrap();
          println!("{:?}", image_block);
        }
        "paragraph" => {
          let paragraph_block = fetch_paragraph_block_by_content_id(content.id).await.unwrap();
          println!("{:?}", paragraph_block);
          let texts = fetch_rich_texts_by_paragraph(paragraph_block.id).await.unwrap();
          println!("{:?}", texts);
          for text in texts {
            let styles = fetch_styles_by_rich_text_id(text.id).await.unwrap();
            println!("{:?}", styles);
          }
        }
        // TODO 全てのコンテントタイプは明示的に処理する
        _ => {}
      }
    }

    let blog_post: BlogPost = blog_post_literal().expect("記事データの生成に失敗しました。");
    HttpResponse::Ok().json(blog_post)
  }

  pub fn blog_post_literal() -> Result<BlogPost> {
    let target_user_id: Uuid = target_user_id()?;
    let blog_post = BlogPost {
      id: target_user_id,
      title: "テストタイトル".to_string(),
      thumbnail: Image { path: "test-book".to_string() },
      post_date: "2021-01-01".parse()?,
      last_update_date: "2021-01-02".parse()?,
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
          path: "test-coffee".to_string(),
          type_field: "image".to_string(),
        }),
      ],
    };

    Ok(blog_post)
  }

  fn target_user_id() -> Result<Uuid> {
    let uuid = Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801")?;
    Ok(uuid)
  }
}
