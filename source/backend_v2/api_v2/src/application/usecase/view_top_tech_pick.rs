use std::sync::Arc;

use anyhow::Result;

use crate::{
    domain::blog_domain::{
        blog_post_repository::BlogPostRepository,
        top_tech_pick_entity::TopTechPickEntity,
    },
    application::dto::BlogPostDTO,
    application::dto_mapper,
};

/// トップテック記事閲覧ユースケース
///
/// 現在設定されているトップテック記事を取得する
pub struct ViewTopTechPickUseCase {
    blog_post_repository: Arc<dyn BlogPostRepository>,
}

impl ViewTopTechPickUseCase {
    /// 新しいViewTopTechPickUseCaseインスタンスを作成する
    ///
    /// # Arguments
    /// * `blog_post_repository` - ブログ記事リポジトリ
    pub fn new(blog_post_repository: Arc<dyn BlogPostRepository>) -> Self {
        Self {
            blog_post_repository,
        }
    }

    /// トップテック記事を取得する
    ///
    /// # Returns
    /// * `Ok(BlogPostDTO)` - トップテック記事のDTO
    /// * `Err` - 記事が見つからないか、エラーが発生した場合
    pub async fn execute(&self) -> Result<BlogPostDTO> {
        // リポジトリからトップテック記事を取得
        let top_tech_pick = self.blog_post_repository.find_top_tech_pick().await?;
        
        // TopTechPickEntityからBlogPostEntityを取得してDTOへ変換
        let dto = dto_mapper::convert_to_blog_post_dto(top_tech_pick.into_post());
        
        Ok(dto)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::sync::Arc;
    use crate::domain::blog_domain::{
        blog_post_entity::BlogPostEntity,
        blog_post_factory::{BlogPostFactory, CreateBlogPostInput, CreateImageInput},
    };
    use mockall::mock;
    
    // モックリポジトリの定義
    mock! {
        BlogPostRepositoryImpl {}
        
        #[async_trait::async_trait]
        impl BlogPostRepository for BlogPostRepositoryImpl {
            async fn find(&self, id: &str) -> Result<BlogPostEntity>;
            async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;
            async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>>;
            async fn find_top_tech_pick(&self) -> Result<TopTechPickEntity>;
            async fn update_top_tech_pick_post(&self, top_tech_pick: &TopTechPickEntity) -> Result<TopTechPickEntity>;
            async fn find_pick_up_posts(&self) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
            async fn update_pick_up_posts(&self, pickup_posts: &crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity) -> Result<crate::domain::blog_domain::pick_up_post_set_entity::PickUpPostSetEntity>;
            async fn find_popular_posts(&self) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
            async fn update_popular_posts(&self, popular_post_set: &crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity) -> Result<crate::domain::blog_domain::popular_post_set_entity::PopularPostSetEntity>;
        }
    }
    
    #[tokio::test]
    async fn test_execute_returns_top_tech_pick_post() {
        // Arrange
        let mut mock_repository = MockBlogPostRepositoryImpl::new();
        
        // テスト用のブログ記事を作成
        let thumbnail_id = uuid::Uuid::new_v4();
        let input = CreateBlogPostInput {
            title: "トップテック記事のタイトル".to_string(),
            thumbnail: Some(CreateImageInput {
                id: thumbnail_id,
                path: "https://example.com/thumbnail.jpg".to_string(),
            }),
            post_date: None,
            last_update_date: None,
            contents: vec![],
        };
        let expected_post = BlogPostFactory::create(input);
        let expected_post_id = expected_post.get_id();
        let expected_post_title = expected_post.get_title_text().to_string();
        
        // モックの設定
        mock_repository
            .expect_find_top_tech_pick()
            .times(1)
            .return_once(move || Ok(TopTechPickEntity::new(expected_post)));
        
        let repository = Arc::new(mock_repository);
        let usecase = ViewTopTechPickUseCase::new(repository);
        
        // Act
        let result = usecase.execute().await;
        
        // Assert
        assert!(result.is_ok());
        let dto = result.unwrap();
        assert_eq!(dto.id, expected_post_id.to_string());
        assert_eq!(dto.title, expected_post_title);
        assert_eq!(dto.thumbnail.id, thumbnail_id);
        assert_eq!(dto.thumbnail.path, "https://example.com/thumbnail.jpg");
    }
    
    #[tokio::test]
    async fn test_execute_propagates_repository_error() {
        // Arrange
        let mut mock_repository = MockBlogPostRepositoryImpl::new();
        
        // モックの設定（エラーを返す）
        mock_repository
            .expect_find_top_tech_pick()
            .times(1)
            .return_once(|| Err(anyhow::anyhow!("データベースエラー")));
        
        let repository = Arc::new(mock_repository);
        let usecase = ViewTopTechPickUseCase::new(repository);
        
        // Act
        let result = usecase.execute().await;
        
        // Assert
        assert!(result.is_err());
        assert_eq!(result.unwrap_err().to_string(), "データベースエラー");
    }
}