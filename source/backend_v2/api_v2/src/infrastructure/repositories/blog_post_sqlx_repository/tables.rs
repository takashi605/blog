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

// 公開する必要のある型をre-export
pub use blog_posts_table::{BlogPostRecord, BlogPostRecordWithRelations};
pub use code_blocks_table::CodeBlockRecord;
pub use heading_blocks_table::HeadingBlockRecord;
pub use image_blocks_table::{ImageBlockRecord, ImageBlockRecordWithRelations};
pub use images_table::ImageRecord;
pub use paragraph_blocks_table::{
  ParagraphBlockRecord, ParagraphBlockRecordWithRelations, RichTextLinkRecord, RichTextRecord, RichTextRecordWithRelations, RichTextStyleRecord,
  TextStyleRecord,
};
pub use pickup_posts_table::PickUpPostRecord;
pub use popular_posts_table::PopularPostRecord;
pub use post_contents_table::{AnyContentBlockRecord, PostContentRecord, PostContentType};
pub use top_tech_pick_table::TopTechPickRecord;
