use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

/// ピックアップ記事群エンティティ
/// 
/// ビジネスルール: ピックアップ記事は必ず3件存在する
#[derive(Debug)]
pub struct PickUpPostSetEntity {
    posts: [BlogPostEntity; 3],
}

impl PickUpPostSetEntity {
    /// 新しいピックアップ記事群を作成する
    /// 
    /// # Arguments
    /// * `posts` - ピックアップ記事の配列（必ず3件）
    /// 
    /// # Returns
    /// * `PickUpPostSetEntity` - ピックアップ記事群エンティティ
    pub fn new(posts: [BlogPostEntity; 3]) -> Self {
        Self { posts }
    }

    /// 全てのピックアップ記事を取得する
    /// 
    /// # Returns
    /// * `&[BlogPostEntity; 3]` - ピックアップ記事の配列への参照（3件固定）
    pub fn get_all_posts(&self) -> &[BlogPostEntity; 3] {
        &self.posts
    }

    /// 全てのピックアップ記事を移動して取得する
    /// 
    /// # Returns
    /// * `[BlogPostEntity; 3]` - ピックアップ記事の配列（3件固定）
    pub fn into_all_posts(self) -> [BlogPostEntity; 3] {
        self.posts
    }

    /// ピックアップ記事を置き換える
    /// 
    /// # Arguments
    /// * `new_posts` - 新しいピックアップ記事の配列（必ず3件）
    pub fn replace_posts(&mut self, new_posts: [BlogPostEntity; 3]) {
        self.posts = new_posts;
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
    fn can_create_pick_up_post_set_with_three_posts() {
        let posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000001", "ピックアップ記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000002", "ピックアップ記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000003", "ピックアップ記事3"),
        ];

        let pick_up_post_set = PickUpPostSetEntity::new(posts);

        let all_posts = pick_up_post_set.get_all_posts();
        assert_eq!(all_posts.len(), 3);
        assert_eq!(all_posts[0].get_title_text(), "ピックアップ記事1");
        assert_eq!(all_posts[1].get_title_text(), "ピックアップ記事2");
        assert_eq!(all_posts[2].get_title_text(), "ピックアップ記事3");
    }

    #[test]
    fn can_retrieve_all_pick_up_posts() {
        let posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事A"),
            create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事B"),
            create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事C"),
        ];

        let pick_up_post_set = PickUpPostSetEntity::new(posts);
        let retrieved_posts = pick_up_post_set.get_all_posts();

        assert_eq!(retrieved_posts.len(), 3);
        assert_eq!(retrieved_posts[0].get_title_text(), "記事A");
        assert_eq!(retrieved_posts[1].get_title_text(), "記事B");
        assert_eq!(retrieved_posts[2].get_title_text(), "記事C");
    }

    #[test]
    fn can_replace_pick_up_posts() {
        let initial_posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000001", "古い記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000002", "古い記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000003", "古い記事3"),
        ];

        let mut pick_up_post_set = PickUpPostSetEntity::new(initial_posts);

        let new_posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000004", "新しい記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000005", "新しい記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000006", "新しい記事3"),
        ];

        pick_up_post_set.replace_posts(new_posts);

        let updated_posts = pick_up_post_set.get_all_posts();
        assert_eq!(updated_posts[0].get_title_text(), "新しい記事1");
        assert_eq!(updated_posts[1].get_title_text(), "新しい記事2");
        assert_eq!(updated_posts[2].get_title_text(), "新しい記事3");
    }

    #[test]
    fn pick_up_post_ids_are_correctly_maintained() {
        let posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
        ];

        let pick_up_post_set = PickUpPostSetEntity::new(posts);
        let retrieved_posts = pick_up_post_set.get_all_posts();

        assert_eq!(
            retrieved_posts[0].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap()
        );
        assert_eq!(
            retrieved_posts[1].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap()
        );
        assert_eq!(
            retrieved_posts[2].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap()
        );
    }

    #[test]
    fn ids_are_correctly_updated_after_replacement() {
        let initial_posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000001", "記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000002", "記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000003", "記事3"),
        ];

        let mut pick_up_post_set = PickUpPostSetEntity::new(initial_posts);

        let new_posts = [
            create_test_blog_post("00000000-0000-0000-0000-000000000010", "新記事1"),
            create_test_blog_post("00000000-0000-0000-0000-000000000020", "新記事2"),
            create_test_blog_post("00000000-0000-0000-0000-000000000030", "新記事3"),
        ];

        pick_up_post_set.replace_posts(new_posts);
        let updated_posts = pick_up_post_set.get_all_posts();

        assert_eq!(
            updated_posts[0].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000010").unwrap()
        );
        assert_eq!(
            updated_posts[1].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000020").unwrap()
        );
        assert_eq!(
            updated_posts[2].get_id(),
            Uuid::parse_str("00000000-0000-0000-0000-000000000030").unwrap()
        );
    }
}