use std::sync::Arc;

use crate::application::dto::BlogPostDTO;
use crate::application::dto_mapper;
use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
use domain_data_mapper::convert_dto_to_entity;
use dto::UpdateBlogPostDTO;

pub mod domain_data_mapper;
pub mod dto;

pub struct UpdateBlogPostUseCase {
  repository: Arc<dyn BlogPostRepository>,
}

impl UpdateBlogPostUseCase {
  pub fn new(repository: Arc<dyn BlogPostRepository>) -> Self {
    Self { repository }
  }

  pub async fn execute(&self, id: &str, dto: UpdateBlogPostDTO) -> anyhow::Result<BlogPostDTO> {
    // 既存記事の存在確認
    let mut existing_blog_post = self.repository.find(id).await?;

    // 非公開化しようとしている場合（未来の日付設定）は制限チェックを実行
    let today = chrono::Utc::now().date_naive();
    if dto.published_date > today {
      self.validate_unpublish_restrictions(id).await?;
    }

    // DTOから更新内容をエンティティに反映
    convert_dto_to_entity(dto, &mut existing_blog_post)?;

    // リポジトリで更新
    let updated_blog_post = self.repository.update(&existing_blog_post).await?;

    // BlogPostEntityをBlogPostDTOに変換
    let result_dto = dto_mapper::convert_to_blog_post_dto(updated_blog_post);

    Ok(result_dto)
  }

  async fn validate_unpublish_restrictions(&self, post_id: &str) -> anyhow::Result<()> {
    // トップテックピック記事チェック（最優先）
    if let Ok(top_tech_pick) = self.repository.find_top_tech_pick().await {
      if top_tech_pick.get_post().get_id().to_string() == post_id {
        return Err(anyhow::anyhow!("トップテックピック記事に設定されているため非公開にできません"));
      }
    }

    // ピックアップ記事チェック
    if let Ok(pickup_posts) = self.repository.find_pick_up_posts().await {
      for post in pickup_posts.get_all_posts() {
        if post.get_id().to_string() == post_id {
          return Err(anyhow::anyhow!("ピックアップ記事に設定されているため非公開にできません"));
        }
      }
    }

    // 人気記事チェック
    if let Ok(popular_posts) = self.repository.find_popular_posts().await {
      for post in popular_posts.get_all_posts() {
        if post.get_id().to_string() == post_id {
          return Err(anyhow::anyhow!("人気記事に設定されているため非公開にできません"));
        }
      }
    }

    Ok(())
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;
  use crate::domain::blog_domain::blog_post_repository::BlogPostRepository;
  use mockall::mock;
  use std::sync::Arc;
  use uuid::Uuid;

  mock! {
    BlogPostRepo {}

    #[async_trait::async_trait]
    impl BlogPostRepository for BlogPostRepo {
      async fn find(&self, id: &str) -> anyhow::Result<BlogPostEntity>;
      async fn save(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
      async fn update(&self, blog_post: &BlogPostEntity) -> anyhow::Result<BlogPostEntity>;
      async fn find_latests(&self, quantity: Option<u32>) -> anyhow::Result<Vec<BlogPostEntity>>;
      async fn find_top_tech_pick(&self) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn update_top_tech_pick_post(&self, top_tech_pick: &crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity) -> anyhow::Result<crate::domain::blog_domain::top_tech_pick_entity::TopTechPickEntity>;
      async fn find_pick_up_posts(&self) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
      async fn find_popular_posts(&self) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> anyhow::Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
      async fn find_all(&self) -> anyhow::Result<Vec<BlogPostEntity>>;
    }
  }

  #[tokio::test]
  async fn test_update_blog_post_calls_repository_find_and_update() {
    // Arrange
    let post_id = "00000000-0000-0000-0000-000000000001";
    let updated_title = "更新されたタイトル";

    let mut mock_repository = MockBlogPostRepo::new();

    // findメソッドが呼ばれることを期待
    mock_repository.expect_find().times(1).with(mockall::predicate::eq(post_id)).returning(move |_| {
      Ok(BlogPostEntity::new(
        Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap(),
        "元のタイトル".to_string(),
      ))
    });

    // updateメソッドが呼ばれることを期待
    mock_repository.expect_update().times(1).returning(move |_| {
      Ok(BlogPostEntity::new(
        Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap(),
        "更新されたタイトル".to_string(),
      ))
    });

    let usecase = UpdateBlogPostUseCase::new(Arc::new(mock_repository));
    let dto = dto::UpdateBlogPostDTO {
      title: updated_title.to_string(),
      thumbnail: crate::application::usecase::create_blog_post::dto::CreateImageDTO {
        id: Uuid::new_v4(),
        path: "path/to/image.jpg".to_string(),
      },
      published_date: chrono::NaiveDate::from_ymd_opt(2024, 1, 1).unwrap(),
      contents: vec![],
    };

    // Act
    let result = usecase.execute(post_id, dto).await;

    // Assert
    assert!(result.is_ok());
    let blog_post_dto = result.unwrap();
    assert_eq!(blog_post_dto.title, updated_title);
  }
}
