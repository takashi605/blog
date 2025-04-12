pub mod blog_posts_table;
pub mod code_blocks_table;
pub mod heading_blocks_table;
pub mod image_blocks_table;
pub mod images_table;
pub mod paragraph_blocks_table;
pub mod pickup_posts_table;
pub mod popular_posts_table;
pub mod post_contents_table;
pub mod top_tech_pick_table;

use anyhow::Result;
use blog_posts_table::BlogPostRecord;
use code_blocks_table::CodeBlockRecord;
use common::types::api::response::{BlogPost, BlogPostContent};
use heading_blocks_table::HeadingBlockRecord;
use image_blocks_table::ImageBlockRecord;
use images_table::ImageRecord;
use paragraph_blocks_table::{ParagraphBlockRecord, RichTextRecord, RichTextStyleRecord, TextStyleRecord};
use post_contents_table::PostContentRecord;
use uuid::Uuid;

pub fn generate_blog_post_records_by(
  post: BlogPost,
  style_records: Vec<TextStyleRecord>,
  image_records: Vec<ImageRecord>,
) -> Result<(
  BlogPostRecord,
  Vec<PostContentRecord>,
  Vec<HeadingBlockRecord>,
  Vec<ParagraphBlockRecord>,
  Vec<ImageBlockRecord>,
  Vec<CodeBlockRecord>,
  Vec<RichTextRecord>,
  Vec<RichTextStyleRecord>,
)> {
  let blog_post_record = BlogPostRecord {
    id: post.id,
    title: post.title,
    thumbnail_image_id: post.thumbnail.id,
    post_date: post.post_date,
    last_update_date: post.last_update_date,
  };
  let mut post_content_records: Vec<PostContentRecord> = vec![];
  let mut heading_block_records: Vec<HeadingBlockRecord> = vec![];
  let mut paragraph_block_records: Vec<ParagraphBlockRecord> = vec![];
  let mut rich_text_records: Vec<RichTextRecord> = vec![];
  let mut rich_text_styles: Vec<RichTextStyleRecord> = vec![];
  let mut image_block_records: Vec<ImageBlockRecord> = vec![];
  let mut code_block_records: Vec<CodeBlockRecord> = vec![];

  post.contents.into_iter().enumerate().try_for_each(|(index, content)| -> Result<(), anyhow::Error> {
    let content_record = match content {
      BlogPostContent::Paragraph(paragraph) => {
        paragraph_block_records.push(ParagraphBlockRecord { id: paragraph.id });
        rich_text_records.push(RichTextRecord {
          id: Uuid::new_v4(),
          paragraph_block_id: paragraph.id,
          text_content: paragraph.text.iter().map(|rt| rt.text.clone()).collect::<String>(),
        });
        paragraph.text.iter().for_each(|rt| {
          // paragraph.text に bold:true が含まれている場合、対応する style_id を取得する
          if rt.styles.bold {
            let style_id = style_records.iter().find(|style| style.style_type == "bold").unwrap().id;
            rich_text_styles.push(RichTextStyleRecord {
              style_id,
              rich_text_id: rich_text_records.last().unwrap().id,
            });
          }
          // inline_code:true が含まれている場合、対応する style_id を取得する
          if rt.styles.inline_code {
            let style_id = style_records.iter().find(|style| style.style_type == "inline-code").unwrap().id;
            rich_text_styles.push(RichTextStyleRecord {
              style_id,
              rich_text_id: rich_text_records.last().unwrap().id,
            });
          }
        });
        PostContentRecord {
          id: paragraph.id,
          post_id: post.id,
          content_type: "paragraph".to_string(),
          sort_order: index as i32,
        }
      }
      // 現状は json へのシリアライズ時に h2 と h3 の区別がつかないため、type_field で区別する
      // TODO 適切な方法で区別できるように修正する
      BlogPostContent::H2(h2) => {
        let content_record: PostContentRecord;
        if h2.type_field == "h3" {
          heading_block_records.push(HeadingBlockRecord {
            id: h2.id,
            heading_level: 3,
            text_content: h2.text,
          });
          content_record = PostContentRecord {
            id: h2.id,
            post_id: post.id,
            content_type: "heading".to_string(),
            sort_order: index as i32,
          }
        } else {
          heading_block_records.push(HeadingBlockRecord {
            id: h2.id,
            heading_level: 2,
            text_content: h2.text,
          });
          content_record = PostContentRecord {
            id: h2.id,
            post_id: post.id,
            content_type: "heading".to_string(),
            sort_order: index as i32,
          };
        }
        content_record
      }
      BlogPostContent::H3(h3) => {
        heading_block_records.push(HeadingBlockRecord {
          id: h3.id,
          heading_level: 3,
          text_content: h3.text,
        });
        PostContentRecord {
          id: h3.id,
          post_id: post.id,
          content_type: "heading".to_string(),
          sort_order: index as i32,
        }
      }
      BlogPostContent::Image(image_block) => {
        // path を元に、image_records から image_id を取得する
        let image_id = image_records
          .iter()
          .find(|image| image.file_path == image_block.path)
          .ok_or_else(|| anyhow::anyhow!("画像コンテンツのパスが見つかりませんでした。"))?
          .id;
        image_block_records.push(ImageBlockRecord {
          id: image_block.id,
          image_id: image_id,
        });
        PostContentRecord {
          id: image_block.id,
          post_id: post.id,
          content_type: "image".to_string(),
          sort_order: index as i32,
        }
      }
      BlogPostContent::Code(code_block) => {
        code_block_records.push(CodeBlockRecord {
          id: code_block.id,
          title: code_block.title,
          code: code_block.code,
          language: code_block.language,
        });
        PostContentRecord {
          id: code_block.id,
          post_id: post.id,
          content_type: "code_block".to_string(),
          sort_order: index as i32,
        }
      }
    };
    post_content_records.push(content_record);
    Ok(())
  })?;

  Ok((
    blog_post_record,
    post_content_records,
    heading_block_records,
    paragraph_block_records,
    image_block_records,
    code_block_records,
    rich_text_records,
    rich_text_styles,
  ))
}

#[cfg(test)]
mod tests {
  use crate::db::tables::{
    image_blocks_table::ImageBlockRecord,
    images_table::ImageRecord,
    paragraph_blocks_table::{ParagraphBlockRecord, RichTextRecord, RichTextStyleRecord, TextStyleRecord},
  };

  use super::*;
  use anyhow::Result;
  use uuid::{Uuid, Version};

  #[tokio::test(flavor = "current_thread")]
  async fn blog_post_to_records() -> Result<()> {
    let post_id: Uuid = Uuid::new_v4();
    let mock_post: BlogPost = helper::create_blog_post_mock(post_id).unwrap();
    let mock_style_records: Vec<TextStyleRecord> = vec![TextStyleRecord {
      id: Uuid::new_v4(),
      style_type: "bold".to_string(),
    }];
    let mock_image_records: Vec<ImageRecord> = vec![
      ImageRecord {
        id: Uuid::new_v4(),
        file_path: "test-coffee".to_string(),
      },
      ImageRecord {
        id: Uuid::new_v4(),
        file_path: "test-book".to_string(),
      },
    ];
    let expected_image_block_id = mock_image_records[1].id;

    let (
      blog_post_record,
      post_content_records,
      heading_block_records,
      paragraph_block_records,
      image_block_records,
      code_block_records,
      rich_text_records,
      rich_text_styles,
    ): (
      BlogPostRecord,
      Vec<PostContentRecord>,
      Vec<HeadingBlockRecord>,
      Vec<ParagraphBlockRecord>,
      Vec<ImageBlockRecord>,
      Vec<CodeBlockRecord>,
      Vec<RichTextRecord>,
      Vec<RichTextStyleRecord>,
    ) = generate_blog_post_records_by(mock_post, mock_style_records, mock_image_records).unwrap();
    assert_eq!(blog_post_record.id, post_id);
    assert_eq!(blog_post_record.title, "テスト記事");
    assert_eq!(blog_post_record.post_date, "2021-01-01".parse().unwrap());
    assert_eq!(blog_post_record.last_update_date, "2021-01-02".parse().unwrap());

    assert_eq!(post_content_records.len(), 5);
    assert_eq!(post_content_records[0].post_id, post_id);
    assert_eq!(post_content_records[1].post_id, post_id);
    assert_eq!(post_content_records[2].post_id, post_id);

    assert_eq!(post_content_records[0].content_type, "paragraph");
    assert_eq!(post_content_records[1].content_type, "heading");
    assert_eq!(post_content_records[2].content_type, "heading");

    assert_eq!(post_content_records[0].sort_order, 0);
    assert_eq!(post_content_records[1].sort_order, 1);
    assert_eq!(post_content_records[2].sort_order, 2);

    assert_eq!(heading_block_records.len(), 2);
    assert_eq!(heading_block_records[0].id, post_content_records[1].id);
    assert_eq!(heading_block_records[0].text_content, "見出しレベル2");

    assert_eq!(heading_block_records[1].id, post_content_records[2].id);
    assert_eq!(heading_block_records[1].text_content, "見出しレベル3");

    assert_eq!(paragraph_block_records.len(), 1);
    assert_eq!(paragraph_block_records[0].id, post_content_records[0].id);

    assert_eq!(rich_text_records.len(), 1);
    assert_eq!(rich_text_records[0].id.get_version(), Some(Version::Random)); // UUIDv4 が生成されていることを確認
    assert_eq!(rich_text_records[0].text_content, "これはテスト用の文字列です。");

    assert_eq!(rich_text_styles.len(), 1);
    assert_eq!(rich_text_styles[0].style_id.get_version(), Some(Version::Random)); // UUIDv4 が生成されていることを確認
    assert_eq!(rich_text_styles[0].rich_text_id, rich_text_records[0].id);

    assert_eq!(image_block_records.len(), 1);
    assert_eq!(image_block_records[0].id.get_version(), Some(Version::Random)); // UUIDv4 が生成されていることを確認
    assert_eq!(image_block_records[0].image_id, expected_image_block_id); // file_path が "test-book" の画像が使用されていることを確認

    assert_eq!(code_block_records.len(), 1);
    assert_eq!(code_block_records[0].id.get_version(), Some(Version::Random)); // UUIDv4 が生成されていることを確認
    assert_eq!(code_block_records[0].title, "サンプルコード");
    assert_eq!(code_block_records[0].code, "console.log(Hello, World!)");
    assert_eq!(code_block_records[0].language, "javascript");

    Ok(())
  }

  mod helper {
    use super::*;
    use common::types::api::response::{BlogPost, BlogPostContent, CodeBlock, H2Block, H3Block, Image, ImageBlock, ParagraphBlock, RichText, Style};
    use uuid::Uuid;

    pub fn create_blog_post_mock(post_id: Uuid) -> Result<BlogPost> {
      let blog_post = BlogPost {
        id: post_id,
        title: "テスト記事".to_string(),
        thumbnail: Image {
          id: Uuid::new_v4(),
          path: "test-coffee".to_string(),
        },
        post_date: "2021-01-01".parse()?,
        last_update_date: "2021-01-02".parse()?,
        contents: vec![
          BlogPostContent::Paragraph(ParagraphBlock {
            id: Uuid::new_v4(),
            text: vec![RichText {
              text: "これはテスト用の文字列です。".to_string(),
              styles: Style { bold: true, inline_code: false },
            }],
            type_field: "paragraph".to_string(),
          }),
          BlogPostContent::H2(H2Block {
            id: Uuid::new_v4(),
            text: "見出しレベル2".to_string(),
            type_field: "h2".to_string(),
          }),
          BlogPostContent::H3(H3Block {
            id: Uuid::new_v4(),
            text: "見出しレベル3".to_string(),
            type_field: "h3".to_string(),
          }),
          BlogPostContent::Image(ImageBlock {
            id: Uuid::new_v4(),
            path: "test-book".to_string(),
            type_field: "image".to_string(),
          }),
          BlogPostContent::Code(CodeBlock {
            id: Uuid::new_v4(),
            type_field: "code_block".to_string(),
            title: "サンプルコード".to_string(),
            code: "console.log(Hello, World!)".to_string(),
            language: "javascript".to_string(),
          }),
        ],
      };

      Ok(blog_post)
    }
  }
}
