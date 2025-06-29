use crate::domain::blog_domain::{
  blog_post_entity::BlogPostEntity, pick_up_post_set_entity::PickUpPostSetEntity, popular_post_set_entity::PopularPostSetEntity,
  top_tech_pick_entity::TopTechPickEntity,
};
use anyhow::Result;

/// ブログ記事リポジトリのトレイト
///
/// ブログ記事エンティティのCRUD操作と特殊な検索・更新機能を提供する
#[async_trait::async_trait]
pub trait BlogPostRepository: Send + Sync {
  /// 単一の記事を取得する
  ///
  /// # Arguments
  /// * `id` - 記事のID
  ///
  /// # Returns
  /// * `Ok(BlogPostEntity)` - 記事が見つかった場合
  /// * `Err` - 記事が見つからないか、データベースエラーの場合
  async fn find(&self, id: &str) -> Result<BlogPostEntity>;

  /// 新しい記事を保存する
  ///
  /// # Arguments
  /// * `blog_post` - 保存する記事エンティティ
  ///
  /// # Returns
  /// * `Ok(BlogPostEntity)` - 保存に成功した場合、保存された記事を返す
  /// * `Err` - 保存に失敗した場合
  async fn save(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;

  /// 既存の記事を更新する
  ///
  /// # Arguments
  /// * `blog_post` - 更新する記事エンティティ
  ///
  /// # Returns
  /// * `Ok(BlogPostEntity)` - 更新に成功した場合、更新された記事を返す
  /// * `Err` - 更新に失敗した場合
  async fn update(&self, blog_post: &BlogPostEntity) -> Result<BlogPostEntity>;

  /// 最新の記事を複数取得する
  ///
  /// # Arguments
  /// * `quantity` - 取得する記事数（Noneの場合はデフォルト数）
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostEntity>)` - 投稿日時の降順でソートされた記事リスト
  /// * `Err` - データベースエラーの場合
  async fn find_latests(&self, quantity: Option<u32>) -> Result<Vec<BlogPostEntity>>;

  /// トップテックピック記事を取得する
  ///
  /// # Returns
  /// * `Ok(TopTechPickEntity)` - 現在のトップテックピック記事
  /// * `Err` - 記事が見つからないか、データベースエラーの場合
  async fn find_top_tech_pick(&self) -> Result<TopTechPickEntity>;

  /// トップテックピック記事を更新する
  ///
  /// # Arguments
  /// * `top_tech_pick` - 新しいトップテックピック記事
  ///
  /// # Returns
  /// * `Ok(TopTechPickEntity)` - 更新に成功した場合、更新された記事を返す
  /// * `Err` - 更新に失敗した場合
  async fn update_top_tech_pick_post(&self, top_tech_pick: &TopTechPickEntity) -> Result<TopTechPickEntity>;

  /// ピックアップ記事を取得する
  ///
  /// # Returns
  /// * `Ok(PickUpPostSetEntity)` - ピックアップ記事群（3件固定）
  /// * `Err` - データベースエラーの場合
  async fn find_pick_up_posts(&self) -> Result<PickUpPostSetEntity>;

  /// ピックアップ記事を更新する
  ///
  /// # Arguments
  /// * `pickup_posts` - 新しいピックアップ記事群（3件固定）
  ///
  /// # Returns
  /// * `Ok(PickUpPostSetEntity)` - 更新に成功した場合、更新された記事群を返す
  /// * `Err` - 更新に失敗した場合
  async fn update_pick_up_posts(&self, pickup_posts: &PickUpPostSetEntity) -> Result<PickUpPostSetEntity>;

  /// 人気記事を複数取得する（3件固定）
  ///
  /// # Returns
  /// * `Ok(PopularPostSetEntity)` - 人気記事群エンティティ（3件固定）
  /// * `Err` - データベースエラーの場合
  async fn find_popular_posts(&self) -> Result<PopularPostSetEntity>;

  /// 人気記事を更新する
  ///
  /// # Arguments
  /// * `popular_post_set` - 新しい人気記事群（3件固定）
  ///
  /// # Returns
  /// * `Ok(PopularPostSetEntity)` - 更新に成功した場合、更新された人気記事群を返す
  /// * `Err` - 更新に失敗した場合
  async fn update_popular_posts(&self, popular_post_set: &PopularPostSetEntity) -> Result<PopularPostSetEntity>;

  /// 全記事を取得する
  ///
  /// # Returns
  /// * `Ok(Vec<BlogPostEntity>)` - 全記事リスト
  /// * `Err` - データベースエラーの場合
  async fn find_all(&self) -> Result<Vec<BlogPostEntity>>;
}
