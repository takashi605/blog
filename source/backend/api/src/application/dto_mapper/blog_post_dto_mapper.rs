use crate::application::dto::{
  BlogPostCodeBlockDTO, BlogPostContentDTO, BlogPostDTO, BlogPostH2BlockDTO, BlogPostH3BlockDTO, BlogPostImageBlockDTO, BlogPostLinkDTO,
  BlogPostParagraphBlockDTO, BlogPostRichTextDTO, BlogPostStyleDTO, ImageDTO,
};
use crate::domain::blog_domain::blog_post_entity::content_entity::ContentEntity;
use crate::domain::blog_domain::blog_post_entity::BlogPostEntity;

pub fn convert_to_blog_post_dto(blog_post: BlogPostEntity) -> BlogPostDTO {
  // JstDateをNaiveDateに変換（DTOはUTCとして扱う）
  let published_date = blog_post.get_published_date().to_naive_date();

  let thumbnail = convert_thumbnail(&blog_post);
  let contents = convert_contents(&blog_post);

  BlogPostDTO {
    id: blog_post.get_id().to_string(),
    title: blog_post.get_title_text().to_string(),
    thumbnail,
    post_date: blog_post.get_post_date().to_naive_date(),
    last_update_date: blog_post.get_last_update_date().to_naive_date(),
    contents,
    published_date,
    is_public: true, // TODO: 実際の公開状態を使用
  }
}

fn convert_thumbnail(blog_post: &BlogPostEntity) -> ImageDTO {
  if let Some(thumb) = blog_post.get_thumbnail() {
    ImageDTO {
      id: thumb.get_id(),
      path: thumb.get_path().to_string(),
    }
  } else {
    // デフォルトのサムネイル
    ImageDTO {
      id: uuid::Uuid::nil(),
      path: String::new(),
    }
  }
}

fn convert_contents(blog_post: &BlogPostEntity) -> Vec<BlogPostContentDTO> {
  blog_post
    .get_contents()
    .iter()
    .map(|content| match content {
      ContentEntity::H2(h2) => BlogPostContentDTO::H2(BlogPostH2BlockDTO {
        id: h2.get_id(),
        text: h2.get_value().to_string(),
      }),
      ContentEntity::H3(h3) => BlogPostContentDTO::H3(BlogPostH3BlockDTO {
        id: h3.get_id(),
        text: h3.get_value().to_string(),
      }),
      ContentEntity::Paragraph(para) => {
        let rich_texts: Vec<BlogPostRichTextDTO> = para
          .get_value()
          .get_text()
          .iter()
          .map(|part| BlogPostRichTextDTO {
            text: part.get_text().to_string(),
            styles: BlogPostStyleDTO {
              bold: part.get_styles().bold,
              inline_code: part.get_styles().inline_code,
            },
            link: part.get_link().map(|link| BlogPostLinkDTO { url: link.url.clone() }),
          })
          .collect();

        BlogPostContentDTO::Paragraph(BlogPostParagraphBlockDTO {
          id: para.get_id(),
          text: rich_texts,
        })
      }
      ContentEntity::Image(img) => BlogPostContentDTO::Image(BlogPostImageBlockDTO {
        id: img.get_id(),
        path: img.get_path().to_string(),
      }),
      ContentEntity::CodeBlock(code) => BlogPostContentDTO::Code(BlogPostCodeBlockDTO {
        id: code.get_id(),
        title: code.get_title().to_string(),
        code: code.get_code().to_string(),
        language: code.get_language().to_string(),
      }),
    })
    .collect()
}

#[cfg(test)]
mod tests {
  use super::*;
  use uuid::Uuid;

  #[test]
  fn test_convert_to_dto_converts_all_content_types_correctly() {
    use crate::domain::blog_domain::blog_post_entity::{
      content_entity::ContentEntity,
      h2_entity::H2Entity,
      h3_entity::H3Entity,
      image_content_entity::ImageContentEntity,
      paragraph_entity::ParagraphEntity,
      rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO},
    };
    use crate::domain::blog_domain::jst_date_vo::JstDate;
    use chrono::NaiveDate;

    // Arrange
    // 複雑なコンテンツを含むBlogPostEntityを作成
    let blog_post_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440001").unwrap();
    let thumbnail_id = Uuid::parse_str("550e8400-e29b-41d4-a716-446655440002").unwrap();
    let post_date = NaiveDate::from_ymd_opt(2024, 1, 15).unwrap();
    let last_update_date = NaiveDate::from_ymd_opt(2024, 1, 20).unwrap();

    // RichTextVOの作成（スタイルとリンク付き）
    let rich_text = RichTextVO::new(vec![
      RichTextPartVO::new("通常のテキストと".to_string(), None, None),
      RichTextPartVO::new(
        "太字テキスト".to_string(),
        Some(RichTextStylesVO {
          bold: true,
          inline_code: false,
        }),
        None,
      ),
      RichTextPartVO::new("と".to_string(), None, None),
      RichTextPartVO::new(
        "リンク付きテキスト".to_string(),
        None,
        Some(LinkVO {
          url: "https://example.com".to_string(),
        }),
      ),
      RichTextPartVO::new("と".to_string(), None, None),
      RichTextPartVO::new(
        "インラインコード".to_string(),
        Some(RichTextStylesVO {
          bold: false,
          inline_code: true,
        }),
        None,
      ),
    ]);

    // 各種コンテンツブロックを作成
    let contents = vec![
      ContentEntity::H2(H2Entity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440003").unwrap(),
        "見出し2".to_string(),
      )),
      ContentEntity::H3(H3Entity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440004").unwrap(),
        "見出し3".to_string(),
      )),
      ContentEntity::Paragraph(ParagraphEntity::new(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440005").unwrap(),
        rich_text,
      )),
      {
        use crate::domain::image_domain::image_entity::ImageEntity;
        let image_entity = ImageEntity::new(
          Uuid::parse_str("550e8400-e29b-41d4-a716-446655440099").unwrap(),
          "https://example.com/image.jpg".to_string(),
        );
        ContentEntity::Image(ImageContentEntity::new(
          Uuid::parse_str("550e8400-e29b-41d4-a716-446655440006").unwrap(),
          image_entity,
        ))
      },
      ContentEntity::code_block(
        Uuid::parse_str("550e8400-e29b-41d4-a716-446655440007").unwrap(),
        "サンプルコード".to_string(),
        "fn main() { println!(\"Hello\"); }".to_string(),
        "rust".to_string(),
      ),
    ];

    let mut blog_post = BlogPostEntity::new(blog_post_id, "テストブログ記事".to_string());
    blog_post.set_thumbnail(thumbnail_id, "test/image/path".to_string());
    blog_post.set_post_date(JstDate::from_naive_date(post_date));
    blog_post.set_last_update_date(JstDate::from_naive_date(last_update_date));

    // コンテンツを個別に追加（moveで所有権を移動）
    for content in contents {
      blog_post.add_content(content);
    }

    // Act
    let dto = convert_to_blog_post_dto(blog_post);

    // Assert
    // 基本情報の検証
    assert_eq!(dto.id, "550e8400-e29b-41d4-a716-446655440001");
    assert_eq!(dto.title, "テストブログ記事");
    assert_eq!(dto.thumbnail.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440002").unwrap());
    assert_eq!(dto.thumbnail.path, "test/image/path");
    assert_eq!(dto.post_date, post_date);
    assert_eq!(dto.last_update_date, last_update_date);

    // コンテンツの検証
    assert_eq!(dto.contents.len(), 5);

    // H2ブロックの検証
    match &dto.contents[0] {
      BlogPostContentDTO::H2(h2) => {
        assert_eq!(h2.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440003").unwrap());
        assert_eq!(h2.text, "見出し2");
      }
      _ => panic!("Expected H2 block"),
    }

    // H3ブロックの検証
    match &dto.contents[1] {
      BlogPostContentDTO::H3(h3) => {
        assert_eq!(h3.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440004").unwrap());
        assert_eq!(h3.text, "見出し3");
      }
      _ => panic!("Expected H3 block"),
    }

    // Paragraphブロックの検証
    match &dto.contents[2] {
      BlogPostContentDTO::Paragraph(para) => {
        assert_eq!(para.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440005").unwrap());
        assert_eq!(para.text.len(), 6); // 6つのRichTextパート

        // 通常テキスト
        assert_eq!(para.text[0].text, "通常のテキストと");
        assert!(!para.text[0].styles.bold);
        assert!(!para.text[0].styles.inline_code);
        assert!(para.text[0].link.is_none());

        // 太字テキスト
        assert_eq!(para.text[1].text, "太字テキスト");
        assert!(para.text[1].styles.bold);
        assert!(!para.text[1].styles.inline_code);
        assert!(para.text[1].link.is_none());

        // 通常テキスト
        assert_eq!(para.text[2].text, "と");
        assert!(!para.text[2].styles.bold);
        assert!(!para.text[2].styles.inline_code);
        assert!(para.text[2].link.is_none());

        // リンク付きテキスト
        assert_eq!(para.text[3].text, "リンク付きテキスト");
        assert!(!para.text[3].styles.bold);
        assert!(!para.text[3].styles.inline_code);
        assert!(para.text[3].link.is_some());
        assert_eq!(para.text[3].link.as_ref().unwrap().url, "https://example.com");

        // 通常テキスト
        assert_eq!(para.text[4].text, "と");
        assert!(!para.text[4].styles.bold);
        assert!(!para.text[4].styles.inline_code);
        assert!(para.text[4].link.is_none());

        // インラインコード
        assert_eq!(para.text[5].text, "インラインコード");
        assert!(!para.text[5].styles.bold);
        assert!(para.text[5].styles.inline_code);
        assert!(para.text[5].link.is_none());
      }
      _ => panic!("Expected Paragraph block"),
    }

    // Imageブロックの検証
    match &dto.contents[3] {
      BlogPostContentDTO::Image(img) => {
        assert_eq!(img.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440006").unwrap());
        assert_eq!(img.path, "https://example.com/image.jpg");
      }
      _ => panic!("Expected Image block"),
    }

    // CodeBlockの検証
    match &dto.contents[4] {
      BlogPostContentDTO::Code(code) => {
        assert_eq!(code.id, Uuid::parse_str("550e8400-e29b-41d4-a716-446655440007").unwrap());
        assert_eq!(code.title, "サンプルコード");
        assert_eq!(code.code, "fn main() { println!(\"Hello\"); }");
        assert_eq!(code.language, "rust");
      }
      _ => panic!("Expected Code block"),
    }
  }
}
