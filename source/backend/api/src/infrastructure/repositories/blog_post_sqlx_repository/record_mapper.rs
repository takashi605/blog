use anyhow::Result;
use uuid::Uuid;

use crate::{
  domain::blog_domain::{
    blog_post_entity::{content_entity::ContentEntity, rich_text_vo::RichTextPartVO, BlogPostEntity},
    pick_up_post_set_entity::PickUpPostSetEntity,
    popular_post_set_entity::PopularPostSetEntity,
  },
  infrastructure::repositories::image_sqlx_repository::ImageRecord,
};

use super::tables::{
  AnyContentBlockRecord, BlogPostRecord, CodeBlockRecord, HeadingBlockRecord, ImageBlockRecord, ImageBlockRecordWithRelations, ParagraphBlockRecord,
  ParagraphBlockRecordWithRelations, PostContentRecord, PostContentType, RichTextLinkRecord, RichTextRecord, RichTextRecordWithRelations, TextStyleRecord,
  pickup_posts_table::PickUpPostRecord,
  popular_posts_table::PopularPostRecord,
};

/// BlogPostEntityからBlogPostRecordとその関連データに分解する
pub fn convert_from_blog_post_entity(entity: &BlogPostEntity) -> Result<(BlogPostRecord, Vec<(PostContentRecord, AnyContentBlockRecord)>)> {
  // サムネイルが設定されていることを確認
  let thumbnail = entity.get_thumbnail().ok_or_else(|| anyhow::anyhow!("サムネイル画像が設定されていません"))?;

  // BlogPostRecordを作成
  let blog_post_record = BlogPostRecord {
    id: entity.get_id(),
    title: entity.get_title_text().to_string(),
    thumbnail_image_id: thumbnail.get_id(),
    post_date: entity.get_post_date(),
    last_update_date: entity.get_last_update_date(),
  };

  // ContentRecordを作成
  let mut content_records = Vec::new();
  for (index, content) in entity.get_contents().iter().enumerate() {
    // コンテンツエンティティのIDを使用してpost_contentのIDとする
    let content_id = get_content_id_from_entity(content);
    let post_content_record = PostContentRecord {
      id: content_id,
      post_id: entity.get_id(),
      content_type: String::from(get_content_type_from_entity(content)),
      sort_order: index as i32,
    };

    let content_block_record = convert_content_entity_to_block_record(content, content_id)?;
    content_records.push((post_content_record, content_block_record));
  }

  Ok((blog_post_record, content_records))
}

/// ContentEntityからIDを取得する
fn get_content_id_from_entity(content: &ContentEntity) -> Uuid {
  match content {
    ContentEntity::H2(h2) => h2.get_id(),
    ContentEntity::H3(h3) => h3.get_id(),
    ContentEntity::Paragraph(paragraph) => paragraph.get_id(),
    ContentEntity::Image(image) => image.get_id(),
    ContentEntity::CodeBlock(code_block) => code_block.get_id(),
  }
}

/// ContentEntityからPostContentTypeを取得する
fn get_content_type_from_entity(content: &ContentEntity) -> PostContentType {
  match content {
    ContentEntity::H2(_) | ContentEntity::H3(_) => PostContentType::Heading,
    ContentEntity::Paragraph(_) => PostContentType::Paragraph,
    ContentEntity::Image(_) => PostContentType::Image,
    ContentEntity::CodeBlock(_) => PostContentType::CodeBlock,
  }
}

/// ContentEntityからAnyContentBlockRecordに変換する
fn convert_content_entity_to_block_record(content: &ContentEntity, content_id: Uuid) -> Result<AnyContentBlockRecord> {
  match content {
    ContentEntity::H2(h2) => Ok(AnyContentBlockRecord::HeadingBlockRecord(HeadingBlockRecord {
      id: content_id,
      heading_level: 2,
      text_content: h2.get_value().to_string(),
    })),
    ContentEntity::H3(h3) => Ok(AnyContentBlockRecord::HeadingBlockRecord(HeadingBlockRecord {
      id: content_id,
      heading_level: 3,
      text_content: h3.get_value().to_string(),
    })),
    ContentEntity::Paragraph(paragraph) => {
      let paragraph_block_record = ParagraphBlockRecord { id: content_id };

      let rich_text_records = convert_rich_text_vo_to_records(paragraph.get_value(), content_id)?;

      Ok(AnyContentBlockRecord::ParagraphBlockRecord(ParagraphBlockRecordWithRelations {
        paragraph_block: paragraph_block_record,
        rich_text_records_with_relations: rich_text_records,
      }))
    }
    ContentEntity::Image(image_content) => {
      let image_record_id = image_content.get_image().get_id();
      let image_record = ImageRecord {
        id: image_record_id, // 画像コンテンツのIDを画像レコードのIDとして使用
        file_path: image_content.get_path().to_string(),
      };

      let image_block_record = ImageBlockRecord {
        id: content_id, // post_contentのIDを使用
        image_id: image_record_id,
      };

      Ok(AnyContentBlockRecord::ImageBlockRecord(ImageBlockRecordWithRelations {
        image_block_record,
        image_record,
      }))
    }
    ContentEntity::CodeBlock(code_block) => Ok(AnyContentBlockRecord::CodeBlockRecord(CodeBlockRecord {
      id: content_id,
      title: code_block.get_title().to_string(),
      code: code_block.get_code().to_string(),
      language: code_block.get_language().to_string(),
    })),
  }
}

/// RichTextVOからRichTextRecordWithRelationsのベクターに変換する
fn convert_rich_text_vo_to_records(
  rich_text: &crate::domain::blog_domain::blog_post_entity::rich_text_vo::RichTextVO,
  paragraph_block_id: Uuid,
) -> Result<Vec<RichTextRecordWithRelations>> {
  let mut records = Vec::new();

  for (index, part) in rich_text.get_text().iter().enumerate() {
    let record = convert_rich_text_part_to_record(part, index, paragraph_block_id)?;
    records.push(record);
  }

  Ok(records)
}

/// RichTextPartVOからRichTextRecordWithRelationsに変換する
fn convert_rich_text_part_to_record(part: &RichTextPartVO, sort_order: usize, paragraph_block_id: Uuid) -> Result<RichTextRecordWithRelations> {
  // RichTextRecordはtext_contentを直接持つ
  let rich_text_record = RichTextRecord {
    id: Uuid::new_v4(),
    paragraph_block_id,
    text_content: part.get_text().to_string(),
    sort_order: sort_order as i32,
  };

  let style_records = convert_styles_vo_to_records(part.get_styles());

  let link_record = if let Some(link) = part.get_link() {
    Some(RichTextLinkRecord {
      id: Uuid::new_v4(),
      rich_text_id: rich_text_record.id,
      url: link.url.clone(),
    })
  } else {
    None
  };

  Ok(RichTextRecordWithRelations {
    text_record: rich_text_record,
    style_records,
    link_record,
  })
}

/// RichTextStylesVOからTextStyleRecordのベクターに変換する
fn convert_styles_vo_to_records(styles: &crate::domain::blog_domain::blog_post_entity::rich_text_vo::RichTextStylesVO) -> Vec<TextStyleRecord> {
  let mut records = Vec::new();

  if styles.bold {
    records.push(TextStyleRecord {
      id: Uuid::new_v4(),
      style_type: "bold".to_string(),
    });
  }
  if styles.inline_code {
    records.push(TextStyleRecord {
      id: Uuid::new_v4(),
      style_type: "inline-code".to_string(),
    });
  }

  records
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::domain::blog_domain::blog_post_entity::{
    rich_text_vo::{LinkVO, RichTextStylesVO, RichTextVO},
    BlogPostEntity,
  };
  use chrono::NaiveDate;

  #[test]
  fn test_convert_from_blog_post_entity_with_three_records() {
    // テスト用のBlogPostEntityを作成
    let blog_post_id = Uuid::new_v4();
    let mut blog_post = BlogPostEntity::new(blog_post_id, "テスト記事".to_string());

    // サムネイル画像を設定
    let thumbnail_id = Uuid::new_v4();
    blog_post.set_thumbnail(thumbnail_id, "/images/thumbnail.jpg".to_string());

    // 日付を設定
    let post_date = NaiveDate::from_ymd_opt(2024, 1, 1).unwrap();
    blog_post.set_post_date(post_date);
    blog_post.set_last_update_date(post_date);

    // H2見出しを追加
    let h2_content = ContentEntity::h2(Uuid::new_v4(), "見出し2".to_string());
    blog_post.add_content(h2_content);

    // パラグラフを追加（リッチテキスト付き）
    let mut styles = RichTextStylesVO::default();
    styles.bold = true;
    styles.inline_code = true;

    let link = LinkVO {
      url: "https://example.com".to_string(),
    };

    let rich_text_part = RichTextPartVO::new("テストテキスト".to_string(), Some(styles), Some(link));
    let rich_text = RichTextVO::new(vec![rich_text_part]);
    let paragraph_content = ContentEntity::paragraph(Uuid::new_v4(), rich_text);
    blog_post.add_content(paragraph_content);

    // コードブロックを追加
    let code_block_content = ContentEntity::code_block(
      Uuid::new_v4(),
      "サンプルコード".to_string(),
      "console.log('Hello');".to_string(),
      "javascript".to_string(),
    );
    blog_post.add_content(code_block_content);

    // 変換を実行
    let result = convert_from_blog_post_entity(&blog_post);
    assert!(result.is_ok());

    let (blog_post_record, content_records) = result.unwrap();

    // BlogPostRecordの検証
    assert_eq!(blog_post_record.id, blog_post_id);
    assert_eq!(blog_post_record.title, "テスト記事");
    assert_eq!(blog_post_record.post_date, post_date);
    assert_eq!(blog_post_record.last_update_date, post_date);
    assert_eq!(blog_post_record.thumbnail_image_id, thumbnail_id);

    // ContentRecordsの検証（3つのコンテンツ）
    assert_eq!(content_records.len(), 3);

    // 1つ目: H2見出し
    let (post_content_1, content_block_1) = &content_records[0];
    assert_eq!(post_content_1.post_id, blog_post_id);
    assert_eq!(post_content_1.content_type, "heading");
    assert_eq!(post_content_1.sort_order, 0);

    match content_block_1 {
      AnyContentBlockRecord::HeadingBlockRecord(heading) => {
        assert_eq!(heading.heading_level, 2);
        assert_eq!(heading.text_content, "見出し2");
      }
      _ => panic!("期待されるコンテンツタイプはHeadingBlockRecordです"),
    }

    // 2つ目: パラグラフ
    let (post_content_2, content_block_2) = &content_records[1];
    assert_eq!(post_content_2.content_type, "paragraph");
    assert_eq!(post_content_2.sort_order, 1);

    match content_block_2 {
      AnyContentBlockRecord::ParagraphBlockRecord(paragraph) => {
        assert_eq!(paragraph.rich_text_records_with_relations.len(), 1);
        let rich_text_record = &paragraph.rich_text_records_with_relations[0];
        assert_eq!(rich_text_record.text_record.text_content, "テストテキスト");
        assert_eq!(rich_text_record.style_records.len(), 2);
        assert!(rich_text_record.link_record.is_some());
        assert_eq!(rich_text_record.link_record.as_ref().unwrap().url, "https://example.com");
      }
      _ => panic!("期待されるコンテンツタイプはParagraphBlockRecordです"),
    }

    // 3つ目: コードブロック
    let (post_content_3, content_block_3) = &content_records[2];
    assert_eq!(post_content_3.content_type, "code_block");
    assert_eq!(post_content_3.sort_order, 2);

    match content_block_3 {
      AnyContentBlockRecord::CodeBlockRecord(code_block) => {
        assert_eq!(code_block.title, "サンプルコード");
        assert_eq!(code_block.code, "console.log('Hello');");
        assert_eq!(code_block.language, "javascript");
      }
      _ => panic!("期待されるコンテンツタイプはCodeBlockRecordです"),
    }
  }

  #[test]
  fn test_convert_styles_vo_to_records() {
    let mut styles = RichTextStylesVO::default();
    styles.bold = true;
    styles.inline_code = true;

    let records = convert_styles_vo_to_records(&styles);

    assert_eq!(records.len(), 2);
    assert!(records.iter().any(|r| r.style_type == "bold"));
    assert!(records.iter().any(|r| r.style_type == "inline-code"));
  }

  #[test]
  fn test_get_content_type_from_entity() {
    let h2_content = ContentEntity::h2(Uuid::new_v4(), "H2".to_string());
    assert_eq!(get_content_type_from_entity(&h2_content), PostContentType::Heading);

    let h3_content = ContentEntity::h3(Uuid::new_v4(), "H3".to_string());
    assert_eq!(get_content_type_from_entity(&h3_content), PostContentType::Heading);

    let rich_text = RichTextVO::new(vec![RichTextPartVO::new("テスト".to_string(), None, None)]);
    let paragraph_content = ContentEntity::paragraph(Uuid::new_v4(), rich_text);
    assert_eq!(get_content_type_from_entity(&paragraph_content), PostContentType::Paragraph);

    let code_block_content = ContentEntity::code_block(Uuid::new_v4(), "タイトル".to_string(), "コード".to_string(), "rust".to_string());
    assert_eq!(get_content_type_from_entity(&code_block_content), PostContentType::CodeBlock);
  }
}

/// PopularPostSetEntityからPopularPostRecordのVecに変換する
pub fn convert_popular_post_set_to_records(popular_post_set: &PopularPostSetEntity) -> Vec<PopularPostRecord> {
  popular_post_set.get_all_posts()
    .iter()
    .map(|post| PopularPostRecord {
      id: Uuid::new_v4(), // 新規UUID生成
      post_id: post.get_id(),
    })
    .collect()
}

/// PickUpPostSetEntityをPickUpPostRecordのリストに変換する
pub fn convert_pickup_post_set_to_records(pickup_post_set: &PickUpPostSetEntity) -> Vec<PickUpPostRecord> {
  pickup_post_set.get_all_posts()
    .iter()
    .map(|post| PickUpPostRecord {
      post_id: post.get_id(),
    })
    .collect()
}
