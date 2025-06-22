use anyhow::{Context, Result};

use crate::{domain::{
  blog_domain::{
    blog_post_entity::{
      content_entity::ContentEntity,
      image_content_entity::ImageContentEntity,
      rich_text_vo::{LinkVO, RichTextPartVO, RichTextStylesVO, RichTextVO},
      BlogPostEntity,
    },
    pick_up_post_set_entity::PickUpPostSetEntity,
    popular_post_set_entity::PopularPostSetEntity,
  },
  image_domain::ImageEntity,
}, infrastructure::repositories::image_sqlx_repository::ImageRecord};

use super::tables::{
  AnyContentBlockRecord, BlogPostRecord, CodeBlockRecord, HeadingBlockRecord, ImageBlockRecordWithRelations, ParagraphBlockRecordWithRelations,
  PostContentRecord, RichTextRecordWithRelations,
  pickup_posts_table::PickUpPostRecord,
  popular_posts_table::PopularPostRecord,
};

/// BlogPostRecordとその関連データからBlogPostEntityを作成する
pub fn convert_to_blog_post_entity(
  blog_post_record: BlogPostRecord,
  thumbnail_record: ImageRecord,
  content_records: Vec<(PostContentRecord, AnyContentBlockRecord)>,
) -> Result<BlogPostEntity> {
  let mut blog_post = BlogPostEntity::new(blog_post_record.id, blog_post_record.title);

  // サムネイル画像を設定
  blog_post.set_thumbnail(thumbnail_record.id, thumbnail_record.file_path);

  // 投稿日と最終更新日を設定
  blog_post.set_post_date(blog_post_record.post_date);
  blog_post.set_last_update_date(blog_post_record.last_update_date);

  // コンテンツを順番通りに変換・追加
  let mut sorted_contents = content_records;
  sorted_contents.sort_by_key(|(post_content, _)| post_content.sort_order);

  for (_, content_block) in sorted_contents {
    let content_entity = convert_content_block_to_entity(content_block).context("コンテンツブロックの変換に失敗しました")?;
    blog_post.add_content(content_entity);
  }

  Ok(blog_post)
}

/// AnyContentBlockRecordからContentEntityに変換する
fn convert_content_block_to_entity(content_block: AnyContentBlockRecord) -> Result<ContentEntity> {
  match content_block {
    AnyContentBlockRecord::HeadingBlockRecord(heading) => convert_heading_to_content_entity(heading),
    AnyContentBlockRecord::ParagraphBlockRecord(paragraph) => convert_paragraph_to_content_entity(paragraph),
    AnyContentBlockRecord::ImageBlockRecord(image_block) => convert_image_block_to_content_entity(image_block),
    AnyContentBlockRecord::CodeBlockRecord(code_block) => convert_code_block_to_content_entity(code_block),
  }
}

/// HeadingBlockRecordからContentEntityに変換する
fn convert_heading_to_content_entity(heading: HeadingBlockRecord) -> Result<ContentEntity> {
  match heading.heading_level {
    2 => Ok(ContentEntity::h2(heading.id, heading.text_content)),
    3 => Ok(ContentEntity::h3(heading.id, heading.text_content)),
    _ => Err(anyhow::anyhow!("サポートされていない見出しレベル: {}", heading.heading_level)),
  }
}

/// ParagraphBlockRecordWithRelationsからContentEntityに変換する
fn convert_paragraph_to_content_entity(paragraph: ParagraphBlockRecordWithRelations) -> Result<ContentEntity> {
  let rich_text_parts = convert_rich_text_records_to_parts(paragraph.rich_text_records_with_relations).context("リッチテキストの変換に失敗しました")?;

  let rich_text_vo = RichTextVO::new(rich_text_parts);
  Ok(ContentEntity::paragraph(paragraph.paragraph_block.id, rich_text_vo))
}

/// ImageBlockRecordWithRelationsからContentEntityに変換する
fn convert_image_block_to_content_entity(image_block: ImageBlockRecordWithRelations) -> Result<ContentEntity> {
  // ImageEntityを作成
  let image_entity = ImageEntity::new(image_block.image_record.id, image_block.image_record.file_path);
  
  // ImageContentEntityを作成
  let image_content_entity = ImageContentEntity::new(image_block.image_block_record.id, image_entity);
  
  // ContentEntityとして返す
  Ok(ContentEntity::image_from_entity(image_content_entity))
}

/// CodeBlockRecordからContentEntityに変換する
fn convert_code_block_to_content_entity(code_block: CodeBlockRecord) -> Result<ContentEntity> {
  Ok(ContentEntity::code_block(code_block.id, code_block.title, code_block.code, code_block.language))
}

/// RichTextRecordWithRelationsのベクターからRichTextPartVOのベクターに変換する
fn convert_rich_text_records_to_parts(rich_text_records: Vec<RichTextRecordWithRelations>) -> Result<Vec<RichTextPartVO>> {
  let mut parts = Vec::new();

  for rich_text_record in rich_text_records {
    let part = convert_rich_text_record_to_part(rich_text_record).context("リッチテキスト部分の変換に失敗しました")?;
    parts.push(part);
  }

  // sort_orderでソート
  parts.sort_by_key(|_| 0); // TODO: sort_orderフィールドが必要な場合は追加

  Ok(parts)
}

/// RichTextRecordWithRelationsからRichTextPartVOに変換する
fn convert_rich_text_record_to_part(rich_text_record: RichTextRecordWithRelations) -> Result<RichTextPartVO> {
  // スタイルを変換
  let styles = convert_styles_to_vo(&rich_text_record.style_records);

  // リンクを変換
  let link = rich_text_record.link_record.map(|link_record| LinkVO { url: link_record.url });

  Ok(RichTextPartVO::new(rich_text_record.text_record.text_content, Some(styles), link))
}

/// TextStyleRecordのベクターからRichTextStylesVOに変換する
fn convert_styles_to_vo(style_records: &[super::tables::TextStyleRecord]) -> RichTextStylesVO {
  let mut styles = RichTextStylesVO::default();

  for style_record in style_records {
    match style_record.style_type.as_str() {
      "bold" => styles.bold = true,
      "inline-code" => styles.inline_code = true,
      _ => {
        // 未知のスタイルは無視（ログ出力など考慮）
      }
    }
  }

  styles
}

#[cfg(test)]
mod tests {
  use uuid::Uuid;

use super::*;

  #[test]
  fn test_convert_styles_to_vo() {
    let style_records = vec![
      super::super::tables::TextStyleRecord {
        id: Uuid::new_v4(),
        style_type: "bold".to_string(),
      },
      super::super::tables::TextStyleRecord {
        id: Uuid::new_v4(),
        style_type: "inline-code".to_string(),
      },
    ];

    let styles = convert_styles_to_vo(&style_records);

    assert!(styles.bold);
    assert!(styles.inline_code);
  }

  #[test]
  fn test_convert_heading_to_content_entity() {
    let heading_id = Uuid::new_v4();
    let heading = HeadingBlockRecord {
      id: heading_id,
      heading_level: 2,
      text_content: "テスト見出し".to_string(),
    };

    let result = convert_heading_to_content_entity(heading);
    assert!(result.is_ok());

    match result.unwrap() {
      ContentEntity::H2(h2_entity) => {
        assert_eq!(h2_entity.get_id(), heading_id);
        assert_eq!(h2_entity.get_value(), "テスト見出し");
      }
      _ => panic!("期待されるコンテンツタイプはH2です"),
    }
  }

  #[test]
  fn test_convert_code_block_to_content_entity() {
    let code_block_id = Uuid::new_v4();
    let code_block = CodeBlockRecord {
      id: code_block_id,
      title: "サンプルコード".to_string(),
      code: "console.log('Hello');".to_string(),
      language: "javascript".to_string(),
    };

    let result = convert_code_block_to_content_entity(code_block);
    assert!(result.is_ok());

    match result.unwrap() {
      ContentEntity::CodeBlock(code_entity) => {
        assert_eq!(code_entity.get_id(), code_block_id);
        assert_eq!(code_entity.get_title(), "サンプルコード");
        assert_eq!(code_entity.get_code(), "console.log('Hello');");
        assert_eq!(code_entity.get_language(), "javascript");
      }
      _ => panic!("期待されるコンテンツタイプはCodeBlockです"),
    }
  }
}

/// PopularPostRecordのVecからPopularPostSetEntityに変換する（記事取得には外部リポジトリが必要）
/// 
/// # Arguments
/// * `records` - PopularPostRecordのVec
/// * `blog_posts` - 取得済みのBlogPostEntityのVec
/// 
/// # Returns
/// * `Ok(PopularPostSetEntity)` - 変換されたPopularPostSetEntity
/// * `Err` - レコード数が3件でない場合
pub fn convert_popular_records_to_entity(records: Vec<PopularPostRecord>, blog_posts: Vec<BlogPostEntity>) -> Result<PopularPostSetEntity> {
  if records.len() != 3 {
    return Err(anyhow::anyhow!("人気記事は必ず3件である必要があります。取得件数: {}", records.len()));
  }

  if blog_posts.len() != 3 {
    return Err(anyhow::anyhow!("ブログ記事は必ず3件である必要があります。取得件数: {}", blog_posts.len()));
  }

  let posts_array: [BlogPostEntity; 3] = blog_posts.try_into()
    .map_err(|_| anyhow::anyhow!("記事配列の変換に失敗しました"))?;

  Ok(PopularPostSetEntity::new(posts_array))
}

/// PickUpPostRecordとBlogPostEntityのリストからPickUpPostSetEntityを作成する
pub fn convert_pickup_records_to_entity(records: Vec<PickUpPostRecord>, blog_posts: Vec<BlogPostEntity>) -> Result<PickUpPostSetEntity> {
  if records.len() != 3 {
    return Err(anyhow::anyhow!("ピックアップ記事は必ず3件である必要があります。取得件数: {}", records.len()));
  }

  if blog_posts.len() != 3 {
    return Err(anyhow::anyhow!("ブログ記事は必ず3件である必要があります。取得件数: {}", blog_posts.len()));
  }

  let posts_array: [BlogPostEntity; 3] = blog_posts.try_into()
    .map_err(|_| anyhow::anyhow!("記事配列の変換に失敗しました"))?;

  Ok(PickUpPostSetEntity::new(posts_array))
}
