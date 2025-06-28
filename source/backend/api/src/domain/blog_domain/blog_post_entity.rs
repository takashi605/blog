pub mod code_block_entity;
pub mod content_entity;
pub mod h2_entity;
pub mod h3_entity;
pub mod image_content_entity;
pub mod paragraph_entity;
pub mod rich_text_vo;

use crate::domain::{blog_domain::blog_post_entity::content_entity::ContentEntity, image_domain::ImageEntity};
use chrono::{Local, NaiveDate};
use uuid::Uuid;

// BlogPost aggregate root
#[derive(Debug)]
pub struct BlogPostEntity {
  id: Uuid,
  title: String,
  contents: Vec<ContentEntity>,
  thumbnail: Option<ImageEntity>,
  post_date: NaiveDate,
  last_update_date: NaiveDate,
  published_date: NaiveDate,
}

impl BlogPostEntity {
  pub fn new(id: Uuid, title: String) -> Self {
    let today = Local::now().date_naive();
    Self {
      id,
      title,
      contents: Vec::new(),
      thumbnail: None,
      post_date: today,
      last_update_date: today,
      published_date: today,
    }
  }

  pub fn get_id(&self) -> Uuid {
    self.id
  }

  pub fn get_title_text(&self) -> &str {
    &self.title
  }

  pub fn set_thumbnail(&mut self, id: Uuid, path: String) -> &mut Self {
    self.thumbnail = Some(ImageEntity::new(id, path));
    self
  }

  pub fn get_thumbnail(&self) -> Option<&ImageEntity> {
    self.thumbnail.as_ref()
  }

  pub fn add_content(&mut self, content: ContentEntity) -> &mut Self {
    self.contents.push(content);
    self
  }

  pub fn get_contents(&self) -> &[ContentEntity] {
    &self.contents
  }

  pub fn set_post_date(&mut self, date: NaiveDate) -> &mut Self {
    self.post_date = date;
    self
  }

  pub fn get_post_date(&self) -> NaiveDate {
    self.post_date
  }

  pub fn set_last_update_date(&mut self, date: NaiveDate) -> &mut Self {
    self.last_update_date = date;
    self
  }

  pub fn get_last_update_date(&self) -> NaiveDate {
    self.last_update_date
  }

  pub fn set_published_date(&mut self, date: NaiveDate) -> &mut Self {
    self.published_date = date;
    self
  }

  pub fn get_published_date(&self) -> NaiveDate {
    self.published_date
  }

  pub fn is_published(&self) -> bool {
    let today = Local::now().date_naive();
    self.published_date <= today
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::rich_text_vo::{RichTextPartVO, RichTextVO};

  #[test]
  fn can_generate_blog_post_data_with_id_and_title() {
    let id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let title = "記事タイトル1".to_string();

    let blog_post = BlogPostEntity::new(id, title.clone());

    assert_eq!(blog_post.get_id(), id);
    assert_eq!(blog_post.get_title_text(), "記事タイトル1");
  }

  #[test]
  fn has_thumbnail_image() {
    let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let mut blog_post = BlogPostEntity::new(post_id, "記事タイトル1".to_string());

    let image_id = Uuid::parse_str("535c8105-fd92-47b7-93ce-dc01b379ae66").unwrap();
    let image_path = "path/to/image".to_string();

    blog_post.set_thumbnail(image_id, image_path.clone());

    let thumbnail = blog_post.get_thumbnail().unwrap();
    assert_eq!(thumbnail.get_id(), image_id);
    assert_eq!(thumbnail.get_path(), "path/to/image");
  }

  #[test]
  fn can_generate_blog_post_with_h2_h3_and_paragraph_content() {
    let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let mut blog_post = BlogPostEntity::new(post_id, "記事タイトル1".to_string());

    // H2コンテンツを追加
    let h2_content = ContentEntity::h2(Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap(), "h2見出し".to_string());
    blog_post.add_content(h2_content);

    // H3コンテンツを追加
    let h3_content = ContentEntity::h3(Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap(), "h3見出し".to_string());
    blog_post.add_content(h3_content);

    // 段落コンテンツを追加
    let paragraph_content = ContentEntity::paragraph(
      Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap(),
      RichTextVO::new(vec![RichTextPartVO::new("段落".to_string(), None, None)]),
    );
    blog_post.add_content(paragraph_content);

    let contents = blog_post.get_contents();
    assert!(contents.len() >= 3);

    // H2コンテンツの検証
    match &contents[0] {
      ContentEntity::H2(h2) => {
        assert_eq!(h2.get_value(), "h2見出し");
        assert_eq!(h2.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());
      }
      _ => panic!("期待されるコンテンツタイプはH2です"),
    }

    // H3コンテンツの検証
    match &contents[1] {
      ContentEntity::H3(h3) => {
        assert_eq!(h3.get_value(), "h3見出し");
        assert_eq!(h3.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap());
      }
      _ => panic!("期待されるコンテンツタイプはH3です"),
    }

    // 段落コンテンツの検証
    match &contents[2] {
      ContentEntity::Paragraph(p) => {
        assert_eq!(p.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap());
        let expected_rich_text = RichTextVO::new(vec![RichTextPartVO::new("段落".to_string(), None, None)]);
        assert_eq!(p.get_value(), &expected_rich_text);
      }
      _ => panic!("期待されるコンテンツタイプはParagraphです"),
    }
  }

  #[test]
  fn returns_none_when_thumbnail_image_is_not_set() {
    let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let blog_post = BlogPostEntity::new(post_id, "記事タイトル1".to_string());

    assert!(blog_post.get_thumbnail().is_none());
  }

  #[test]
  fn can_add_multiple_contents() {
    let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
    let mut blog_post = BlogPostEntity::new(post_id, "記事タイトル".to_string());

    // 複数のコンテンツを追加
    for i in 0..5 {
      let content = ContentEntity::paragraph(Uuid::new_v4(), RichTextVO::new(vec![RichTextPartVO::new(format!("段落{}", i), None, None)]));
      blog_post.add_content(content);
    }

    assert_eq!(blog_post.get_contents().len(), 5);
  }

  #[test]
  fn can_create_empty_blog_post() {
    let id = Uuid::new_v4();
    let blog_post = BlogPostEntity::new(id, "空の記事".to_string());

    assert_eq!(blog_post.get_contents().len(), 0);
    assert!(blog_post.get_thumbnail().is_none());
  }

  #[test]
  fn can_set_post_date_and_last_update_date() {
    use chrono::NaiveDate;

    let id = Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(id, "日付のある記事".to_string());

    let post_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
    let last_update_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();

    blog_post.set_post_date(post_date);
    blog_post.set_last_update_date(last_update_date);

    assert_eq!(blog_post.get_post_date(), post_date);
    assert_eq!(blog_post.get_last_update_date(), last_update_date);
  }

  #[test]
  fn default_values_for_post_date_and_last_update_date() {
    use chrono::Local;

    let id = Uuid::new_v4();
    let blog_post = BlogPostEntity::new(id, "デフォルト日付の記事".to_string());

    let today = Local::now().date_naive();

    // デフォルトでは本日の日付が設定される
    assert_eq!(blog_post.get_post_date(), today);
    assert_eq!(blog_post.get_last_update_date(), today);
  }

  #[test]
  fn is_published_returns_true_when_published_date_is_today_or_past() {
    use chrono::NaiveDate;

    let id = Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(id, "過去日付で公開する記事".to_string());

    // 昨日の日付で公開日を設定
    let yesterday = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
    blog_post.set_published_date(yesterday);

    assert!(blog_post.is_published());
  }

  #[test]
  fn is_published_returns_false_when_published_date_is_future() {
    use chrono::NaiveDate;

    let id = Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(id, "未来日付で公開予定の記事".to_string());

    // 未来の日付で公開日を設定
    let future_date = NaiveDate::from_ymd_opt(3000, 12, 31).unwrap();
    blog_post.set_published_date(future_date);

    assert!(!blog_post.is_published());
  }

  #[test]
  fn can_set_and_get_published_date() {
    use chrono::NaiveDate;

    let id = Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(id, "公開日設定記事".to_string());

    let published_date = NaiveDate::from_ymd_opt(2024, 6, 15).unwrap();
    blog_post.set_published_date(published_date);

    assert_eq!(blog_post.get_published_date(), published_date);
  }
}
