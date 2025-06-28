use actix_web::{web, Scope};

use super::image_handlers::{admin_image_scope, image_scope};

// TODO image_scope が同階層の別モジュールとなっており構造的に気持ち悪いので、上手く階層化する
pub fn blog_scope() -> Scope {
  web::scope("/blog").service(posts_scope()).service(image_scope())
}

fn posts_scope() -> Scope {
  web::scope("/posts")
    .route("/latest", web::get().to(handle_funcs::get_latest_blog_posts))
    .route("/top-tech-pick", web::get().to(handle_funcs::get_top_tech_pick_blog_post))
    .route("/pickup", web::get().to(handle_funcs::get_pickup_blog_posts))
    .route("/popular", web::get().to(handle_funcs::get_popular_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
}

pub fn admin_scope() -> Scope {
  web::scope("/admin/blog").service(admin_blog_posts_scope()).service(admin_image_scope())
}

// 管理者用のスコープ
pub fn admin_blog_posts_scope() -> Scope {
  web::scope("/posts")
    .route("/top-tech-pick", web::put().to(handle_funcs::put_top_tech_pick_blog_post))
    .route("/pickup", web::put().to(handle_funcs::put_pickup_blog_posts))
    .route("/popular", web::put().to(handle_funcs::put_popular_blog_posts))
    .route("/{uuid}", web::get().to(handle_funcs::get_blog_post))
    .route("", web::get().to(handle_funcs::get_admin_blog_posts))
    .route("", web::post().to(handle_funcs::create_blog_post))
}

pub mod handle_funcs {
  use crate::infrastructure::{
    di_container::DiContainer,
    server::handlers::{
      api_mapper::{blog_post_response_mapper, view_blog_post_dto_to_response, view_blog_post_dtos_to_response, view_latest_blog_posts_dto_to_response},
      dto_mapper::create_blog_post_mapper::api_create_blog_post_request_to_create_dto,
      response::err::ApiCustomError,
    },
  };
  use actix_web::{web, HttpResponse, Responder};
  use anyhow::Result;
  use common::types::api::{BlogPost, CreateBlogPostRequest};

  #[utoipa::path(
    get,
    path = "/api/blog/posts/{uuid}",
    responses(
      (status = 200, description = "Blog post found", body = BlogPost),
      (status = 404, description = "Blog post not found")
    ),
    params(
      ("uuid" = String, Path, description = "Blog post UUID")
    )
  )]
  pub async fn get_blog_post(path: web::Path<String>, di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    println!("get_blog_post");
    println!("path: {:?}", path);
    let post_id = path.into_inner();

    // DIコンテナからユースケースを取得
    let usecase = di_container.view_blog_post_usecase();
    let dto = usecase.execute(&post_id).await.map_err(|e| {
      // BlogPostNotFound エラーを特別扱い
      let error_message = e.to_string();
      if error_message.starts_with("BlogPostNotFound:") {
        ApiCustomError::BlogPostNotFound(post_id.clone())
      } else {
        ApiCustomError::Other(e)
      }
    })?;

    // DTOをAPIレスポンスに変換
    let blog_post = view_blog_post_dto_to_response(dto).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/latest",
    responses(
      (status = 200, description = "Latest blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_latest_blog_posts(di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    println!("get_latest_blog_posts");

    // DIコンテナからユースケースを取得
    let usecase = di_container.view_latest_blog_posts_usecase();
    let dto = usecase.execute(None).await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_posts = view_latest_blog_posts_dto_to_response(dto).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_posts))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/top-tech-pick",
    responses(
      (status = 200, description = "Top tech pick blog post", body = BlogPost)
    )
  )]
  pub async fn get_top_tech_pick_blog_post(di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    println!("get_top_tech_pick_blog_post");

    // DIコンテナからユースケースを取得
    let usecase = di_container.view_top_tech_pick_usecase();
    let dto = usecase.execute().await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_post = view_blog_post_dto_to_response(dto).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/top-tech-pick",
    request_body = BlogPost,
    responses(
      (status = 200, description = "Top tech pick blog post updated", body = BlogPost)
    )
  )]
  pub async fn put_top_tech_pick_blog_post(
    di_container: web::Data<DiContainer>,
    top_tech_pick_posts_req: web::Json<BlogPost>,
  ) -> Result<impl Responder, ApiCustomError> {
    println!("put_top_tech_pick_blog_post");

    let requested_post: BlogPost = top_tech_pick_posts_req.into_inner();

    // DIコンテナからユースケースを取得
    let usecase = di_container.select_top_tech_pick_post_usecase();
    let dto = usecase.execute(requested_post.id.to_string()).await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_post = view_blog_post_dto_to_response(dto).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_post))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/pickup",
    responses(
      (status = 200, description = "Pickup blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_pickup_blog_posts(di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    println!("get_pickup_blog_posts");

    // ViewPickUpPostsUseCaseを使用してピックアップ記事を取得
    let usecase = di_container.view_pick_up_posts_usecase();
    let dtos = usecase.execute().await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOからBlogPostレスポンスに変換
    let result: Vec<BlogPost> = dtos.into_iter().map(|dto| blog_post_response_mapper::view_blog_post_dto_to_response(dto).unwrap()).collect();

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/pickup",
    request_body = Vec<BlogPost>,
    responses(
      (status = 200, description = "Pickup blog posts updated", body = Vec<BlogPost>)
    )
  )]
  pub async fn put_pickup_blog_posts(
    di_container: web::Data<DiContainer>,
    pickup_posts_req: web::Json<Vec<BlogPost>>,
  ) -> Result<impl Responder, ApiCustomError> {
    println!("put_pickup_blog_posts");

    let pickup_blog_posts: Vec<BlogPost> = pickup_posts_req.into_inner();

    // BlogPostレスポンスから記事IDのリストを抽出
    let post_ids: Vec<String> = pickup_blog_posts.into_iter().map(|post| post.id.to_string()).collect();

    // SelectPickUpPostsUseCaseを使用してピックアップ記事を更新
    let usecase = di_container.select_pick_up_posts_usecase();
    let dtos = usecase.execute(post_ids).await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOからBlogPostレスポンスに変換
    let result: Vec<BlogPost> = dtos.into_iter().map(|dto| blog_post_response_mapper::view_blog_post_dto_to_response(dto).unwrap()).collect();

    Ok(HttpResponse::Ok().json(result))
  }

  #[utoipa::path(
    get,
    path = "/api/blog/posts/popular",
    responses(
      (status = 200, description = "Popular blog posts", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_popular_blog_posts(di_container: web::Data<DiContainer>) -> Result<impl Responder, ApiCustomError> {
    println!("get_popular_blog_posts");

    // DIコンテナからユースケースを取得
    let usecase = di_container.view_popular_blog_posts_usecase();
    let dtos = usecase.execute().await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_posts = view_blog_post_dtos_to_response(dtos).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_posts))
  }

  #[utoipa::path(
    put,
    path = "/api/admin/blog/posts/popular",
    request_body = Vec<BlogPost>,
    responses(
      (status = 200, description = "Popular blog posts updated", body = Vec<BlogPost>)
    )
  )]
  pub async fn put_popular_blog_posts(
    popular_posts_req: web::Json<Vec<BlogPost>>,
    di_container: web::Data<DiContainer>,
  ) -> Result<impl Responder, ApiCustomError> {
    println!("put_popular_blog_posts");

    // リクエストボディから記事IDリストを抽出
    let popular_blog_posts: Vec<BlogPost> = popular_posts_req.into_inner();
    let post_ids: Vec<String> = popular_blog_posts.into_iter().map(|post| post.id.to_string()).collect();

    // DIコンテナからユースケースを取得
    let usecase = di_container.select_popular_posts_usecase();
    let dtos = usecase.execute(post_ids).await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_posts = view_blog_post_dtos_to_response(dtos).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_posts))
  }

  #[utoipa::path(
    get,
    path = "/api/admin/blog/posts",
    responses(
      (status = 200, description = "All blog posts including unpublished ones", body = Vec<BlogPost>)
    )
  )]
  pub async fn get_admin_blog_posts() -> Result<impl Responder, ApiCustomError> {
    println!("get_admin_blog_posts");

    // ひとまずモックレスポンスを返す
    use common::types::api::{BlogPost, Image, BlogPostContent, H2Block, ParagraphBlock, RichText, Style};
    use uuid::Uuid;
    use chrono::{Utc, Duration};

    let mock_posts = vec![
      BlogPost {
        id: Uuid::parse_str("672f2772-72b5-404a-8895-b1fbbf310801").unwrap(),
        title: "初めての技術スタックへの挑戦".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-coffee".to_string(),
        },
        post_date: "2021-01-01".parse().unwrap(),
        last_update_date: "2021-01-02".parse().unwrap(),
        published_date: "1900-01-01".parse().unwrap(),
        contents: vec![
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "最初のステップ".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "新しい技術スタックに挑戦することは、いつも冒険と学びの場です。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
        ],
      },
      BlogPost {
        id: Uuid::new_v4(),
        title: "50年後記事1".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-book".to_string(),
        },
        post_date: Utc::now().date_naive(),
        last_update_date: Utc::now().date_naive(),
        published_date: (Utc::now() + Duration::days(365 * 50)).date_naive(),
        contents: vec![
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "50年後記事1の見出し".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "これは50年後に公開される予定の記事の段落です。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
        ],
      },
      BlogPost {
        id: Uuid::parse_str("20b73825-9a6f-4901-aa42-e104a8d2c4f6").unwrap(),
        title: "ミニマル記事1".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-book".to_string(),
        },
        post_date: "2025-01-01".parse().unwrap(),
        last_update_date: "2025-01-01".parse().unwrap(),
        published_date: "1900-01-01".parse().unwrap(),
        contents: vec![
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "ミニマル記事1の見出し".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "これはミニマル記事1の段落です。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
        ],
      },
      BlogPost {
        id: Uuid::parse_str("91450c47-9845-4398-ad3a-275118d223ea").unwrap(),
        title: "ミニマル記事2".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-mechanical".to_string(),
        },
        post_date: "2025-02-01".parse().unwrap(),
        last_update_date: "2025-02-01".parse().unwrap(),
        published_date: "1900-01-01".parse().unwrap(),
        contents: vec![
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "ミニマル記事2の見出し".to_string(),
          }),
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "これはミニマル記事2の段落です。".to_string(),
              styles: Style { bold: false, inline_code: false },
              link: Option::None,
            }],
          }),
        ],
      },
    ];

    Ok(HttpResponse::Ok().json(mock_posts))
  }

  #[utoipa::path(
    post,
    path = "/api/admin/blog/posts",
    request_body = CreateBlogPostRequest,
    responses(
      (status = 200, description = "Blog post created", body = BlogPost)
    )
  )]
  pub async fn create_blog_post(
    blog_post_req: web::Json<CreateBlogPostRequest>,
    di_container: web::Data<DiContainer>,
  ) -> Result<impl Responder, ApiCustomError> {
    let blog_post_req = blog_post_req.into_inner();

    // API型をDTO型に変換
    let create_dto = api_create_blog_post_request_to_create_dto(blog_post_req);

    // DIコンテナからユースケースを取得
    let usecase = di_container.create_blog_post_usecase();
    let blog_post_dto = usecase.execute(create_dto).await.map_err(|e| ApiCustomError::Other(e))?;

    // DTOをAPIレスポンスに変換
    let blog_post = view_blog_post_dto_to_response(blog_post_dto).map_err(|e| ApiCustomError::Other(e))?;

    Ok(HttpResponse::Ok().json(blog_post))
  }
}
