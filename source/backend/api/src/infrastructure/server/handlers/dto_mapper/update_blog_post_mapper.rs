use crate::application::usecase::create_blog_post::dto::CreateImageDTO;
use crate::application::usecase::update_blog_post::dto::UpdateBlogPostDTO;
use crate::infrastructure::server::handlers::dto_mapper::create_blog_post_mapper::api_create_blog_post_contents_to_create_dto;
use common::types::api::UpdateBlogPostRequest;

pub fn api_update_blog_post_request_to_update_dto(request: UpdateBlogPostRequest) -> UpdateBlogPostDTO {
  UpdateBlogPostDTO {
    title: request.title,
    thumbnail: CreateImageDTO {
      id: request.thumbnail.id,
      path: request.thumbnail.path,
    },
    published_date: request.published_date,
    contents: api_create_blog_post_contents_to_create_dto(request.contents),
  }
}
