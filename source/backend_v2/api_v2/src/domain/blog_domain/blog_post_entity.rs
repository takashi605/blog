mod content_type;
mod content_entity;
mod h2_entity;
mod h3_entity;
mod paragraph_entity;
mod image_content_entity;
mod code_block_entity;
mod rich_text_vo;

use uuid::Uuid;
use crate::domain::{blog_domain::blog_post_entity::content_entity::ContentEntity, image_domain::ImageEntity};

// BlogPost aggregate root
#[derive(Debug)]
pub struct BlogPostEntity {
    id: Uuid,
    title: String,
    contents: Vec<ContentEntity>,
    thumbnail: Option<ImageEntity>,
}

impl BlogPostEntity {
    pub fn new(id: Uuid, title: String) -> Self {
        Self {
            id,
            title,
            contents: Vec::new(),
            thumbnail: None,
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
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::blog_domain::{blog_post_entity::content_type::ContentType, blog_post_entity::rich_text_vo::{RichTextVO, RichTextPartVO}};

    #[test]
    fn idと記事タイトルを渡すと記事データを生成できる() {
        let id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
        let title = "記事タイトル1".to_string();
        
        let blog_post = BlogPostEntity::new(id, title.clone());
        
        assert_eq!(blog_post.get_id(), id);
        assert_eq!(blog_post.get_title_text(), "記事タイトル1");
    }

    #[test]
    fn サムネイル画像を持っている() {
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
    fn コンテンツとしてh2_h3及び段落を持つ記事を生成できる() {
        let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
        let mut blog_post = BlogPostEntity::new(post_id, "記事タイトル1".to_string());
        
        // H2コンテンツを追加
        let h2_content = ContentEntity::h2(
            Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap(),
            "h2見出し".to_string()
        );
        blog_post.add_content(h2_content);
        
        // H3コンテンツを追加
        let h3_content = ContentEntity::h3(
            Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap(),
            "h3見出し".to_string()
        );
        blog_post.add_content(h3_content);
        
        // 段落コンテンツを追加
        let paragraph_content = ContentEntity::paragraph(
            Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap(),
            RichTextVO::new(vec![RichTextPartVO::new("段落".to_string(), None, None)])
        );
        blog_post.add_content(paragraph_content);
        
        let contents = blog_post.get_contents();
        assert!(contents.len() >= 3);
        
        // H2コンテンツの検証
        match &contents[0] {
            ContentEntity::H2(h2) => {
                assert_eq!(h2.get_value(), "h2見出し");
                assert_eq!(h2.get_type(), ContentType::H2);
                assert_eq!(h2.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap());
            }
            _ => panic!("期待されるコンテンツタイプはH2です"),
        }
        
        // H3コンテンツの検証
        match &contents[1] {
            ContentEntity::H3(h3) => {
                assert_eq!(h3.get_value(), "h3見出し");
                assert_eq!(h3.get_type(), ContentType::H3);
                assert_eq!(h3.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000002").unwrap());
            }
            _ => panic!("期待されるコンテンツタイプはH3です"),
        }
        
        // 段落コンテンツの検証
        match &contents[2] {
            ContentEntity::Paragraph(p) => {
                assert_eq!(p.get_type(), ContentType::Paragraph);
                assert_eq!(p.get_id(), Uuid::parse_str("00000000-0000-0000-0000-000000000003").unwrap());
                let expected_rich_text = RichTextVO::new(vec![RichTextPartVO::new("段落".to_string(), None, None)]);
                assert_eq!(p.get_value(), &expected_rich_text);
            }
            _ => panic!("期待されるコンテンツタイプはParagraphです"),
        }
    }

    #[test]
    fn サムネイル画像が設定されていない場合はNoneを返す() {
        let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
        let blog_post = BlogPostEntity::new(post_id, "記事タイトル1".to_string());
        
        assert!(blog_post.get_thumbnail().is_none());
    }

    #[test]
    fn 複数のコンテンツを追加できる() {
        let post_id = Uuid::parse_str("00000000-0000-0000-0000-000000000001").unwrap();
        let mut blog_post = BlogPostEntity::new(post_id, "記事タイトル".to_string());
        
        // 複数のコンテンツを追加
        for i in 0..5 {
            let content = ContentEntity::paragraph(
                Uuid::new_v4(),
                RichTextVO::new(vec![RichTextPartVO::new(format!("段落{}", i), None, None)])
            );
            blog_post.add_content(content);
        }
        
        assert_eq!(blog_post.get_contents().len(), 5);
    }

    #[test]
    fn 空の記事を作成できる() {
        let id = Uuid::new_v4();
        let blog_post = BlogPostEntity::new(id, "空の記事".to_string());
        
        assert_eq!(blog_post.get_contents().len(), 0);
        assert!(blog_post.get_thumbnail().is_none());
    }
}