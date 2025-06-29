use crate::application::usecase::create_blog_post::dto::{
  CreateBlogPostDTO, CreateContentDTO, CreateImageDTO, CreateLinkDTO, CreateRichTextDTO, CreateStyleDTO,
};
use common::types::api;
use uuid::Uuid;

// 新しいリクエスト型用の変換関数
pub fn api_create_blog_post_request_to_create_dto(request: api::CreateBlogPostRequest) -> CreateBlogPostDTO {
  CreateBlogPostDTO {
    title: request.title,
    thumbnail: api_create_image_request_to_create_dto(request.thumbnail),
    post_date: Some(request.post_date),
    last_update_date: Some(request.last_update_date),
    published_date: Some(request.published_date),
    contents: request.contents.into_iter().map(api_create_content_request_to_create_dto).collect(),
  }
}

fn api_create_image_request_to_create_dto(request: api::CreateImageContentRequest) -> CreateImageDTO {
  CreateImageDTO {
    id: request.id.unwrap_or_else(|| Uuid::new_v4()), // IDが指定されていれば使用、なければ新規生成
    path: request.path,
  }
}

pub fn api_create_content_request_to_create_dto(request: api::CreateBlogPostContentRequest) -> CreateContentDTO {
  match request {
    api::CreateBlogPostContentRequest::H2(h2) => CreateContentDTO::H2 {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: h2.text,
    },
    api::CreateBlogPostContentRequest::H3(h3) => CreateContentDTO::H3 {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: h3.text,
    },
    api::CreateBlogPostContentRequest::Paragraph(paragraph) => CreateContentDTO::Paragraph {
      id: Uuid::new_v4(), // 新しいIDを生成
      text: paragraph.text.into_iter().map(api_create_rich_text_request_to_create_dto).collect(),
    },
    api::CreateBlogPostContentRequest::Image(image) => CreateContentDTO::Image {
      id: Uuid::new_v4(), // 新しいIDを生成
      path: image.path,
    },
    api::CreateBlogPostContentRequest::Code(code) => CreateContentDTO::CodeBlock {
      id: Uuid::new_v4(), // 新しいIDを生成
      title: code.title,
      code: code.code,
      language: code.language,
    },
  }
}

fn api_create_rich_text_request_to_create_dto(api_rich_text: api::RichText) -> CreateRichTextDTO {
  CreateRichTextDTO {
    text: api_rich_text.text,
    styles: api_create_style_request_to_create_dto(api_rich_text.styles),
    link: api_rich_text.link.map(api_create_link_request_to_create_dto),
  }
}

fn api_create_style_request_to_create_dto(api_style: api::Style) -> CreateStyleDTO {
  CreateStyleDTO {
    bold: api_style.bold,
    inline_code: api_style.inline_code,
  }
}

fn api_create_link_request_to_create_dto(api_link: api::Link) -> CreateLinkDTO {
  CreateLinkDTO { url: api_link.url }
}

pub fn api_create_blog_post_contents_to_create_dto(contents: Vec<api::BlogPostContent>) -> Vec<CreateContentDTO> {
  contents.into_iter().map(api_blog_post_content_to_create_dto).collect()
}

fn api_blog_post_content_to_create_dto(content: api::BlogPostContent) -> CreateContentDTO {
  match content {
    api::BlogPostContent::H2(h2) => CreateContentDTO::H2 { id: h2.id, text: h2.text },
    api::BlogPostContent::H3(h3) => CreateContentDTO::H3 { id: h3.id, text: h3.text },
    api::BlogPostContent::Paragraph(paragraph) => CreateContentDTO::Paragraph {
      id: paragraph.id,
      text: paragraph.text.into_iter().map(api_create_rich_text_request_to_create_dto).collect(),
    },
    api::BlogPostContent::Image(image) => CreateContentDTO::Image {
      id: image.id,
      path: image.path,
    },
    api::BlogPostContent::Code(code) => CreateContentDTO::CodeBlock {
      id: code.id,
      title: code.title,
      code: code.code,
      language: code.language,
    },
  }
}
