use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

/// トップテック記事エンティティ
/// 
/// ビジネスルール: トップテック記事は必ず1つ存在する
#[derive(Debug)]
pub struct TopTechPickEntity {
    post: BlogPostEntity,
}

impl TopTechPickEntity {
    /// 新しいトップテック記事を作成する
    /// 
    /// # Arguments
    /// * `post` - トップテック記事として設定するブログ記事
    /// 
    /// # Returns
    /// * `TopTechPickEntity` - トップテック記事エンティティ
    pub fn new(post: BlogPostEntity) -> Self {
        Self { post }
    }

    /// トップテック記事を取得する
    /// 
    /// # Returns
    /// * `&BlogPostEntity` - トップテック記事への参照
    pub fn get_post(&self) -> &BlogPostEntity {
        &self.post
    }

    /// トップテック記事を移動して取得する
    /// 
    /// # Returns
    /// * `BlogPostEntity` - トップテック記事
    pub fn into_post(self) -> BlogPostEntity {
        self.post
    }

    /// トップテック記事を置き換える
    /// 
    /// # Arguments
    /// * `new_post` - 新しいトップテック記事
    pub fn replace_post(&mut self, new_post: BlogPostEntity) {
        self.post = new_post;
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use uuid::Uuid;

    fn create_test_blog_post(id: &str, title: &str) -> BlogPostEntity {
        let uuid = Uuid::parse_str(id).unwrap();
        BlogPostEntity::new(uuid, title.to_string())
    }

    #[test]
    fn トップテック記事を1件で作成できる() {
        let post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "トップテック記事");

        let top_tech_pick = TopTechPickEntity::new(post);

        let retrieved_post = top_tech_pick.get_post();
        assert_eq!(retrieved_post.get_title_text(), "トップテック記事");
    }

    #[test]
    fn トップテック記事を取得できる() {
        let post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "技術記事");

        let top_tech_pick = TopTechPickEntity::new(post);
        let retrieved_post = top_tech_pick.get_post();

        assert_eq!(retrieved_post.get_title_text(), "技術記事");
    }

    #[test]
    fn トップテック記事を置き換えできる() {
        let initial_post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "古い記事");
        let mut top_tech_pick = TopTechPickEntity::new(initial_post);

        let new_post = create_test_blog_post("00000000-0000-0000-0000-000000000002", "新しい記事");
        top_tech_pick.replace_post(new_post);

        let updated_post = top_tech_pick.get_post();
        assert_eq!(updated_post.get_title_text(), "新しい記事");
    }

    #[test]
    fn トップテック記事のidが正しく保持される() {
        let post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事");

        let top_tech_pick = TopTechPickEntity::new(post);
        let retrieved_post = top_tech_pick.get_post();

        assert_eq!(
            retrieved_post.get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()
        );
    }

    #[test]
    fn 置き換え後のidが正しく更新される() {
        let initial_post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1");
        let mut top_tech_pick = TopTechPickEntity::new(initial_post);

        let new_post = create_test_blog_post("00000000-0000-0000-0000-000000000010", "新記事");
        top_tech_pick.replace_post(new_post);
        let updated_post = top_tech_pick.get_post();

        assert_eq!(
            updated_post.get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000010").unwrap()
        );
    }

    #[test]
    fn into_postでトップテック記事を消費して取得できる() {
        let post = create_test_blog_post("00000000-0000-0000-0000-000000000001", "消費記事");
        let top_tech_pick = TopTechPickEntity::new(post);

        let consumed_post = top_tech_pick.into_post();
        assert_eq!(consumed_post.get_title_text(), "消費記事");
        assert_eq!(
            consumed_post.get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()
        );
    }
}