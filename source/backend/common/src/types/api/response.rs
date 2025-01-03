use chrono::{DateTime, NaiveDate, Utc};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct BlogPost {
  id: Uuid,
  title: String,
  thumbnail: Image,
  post_date: NaiveDate,
  last_update_date: NaiveDate,
  contents: Vec<BlogPostContent>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Image {
  path: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Style {
  bold: bool,
}


#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
enum BlogPostContent {
  H2(H2Block),
  H3(H3Block),
  Paragraph(ParagraphBlock),
  Image(ImageBlock),
}


#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct H2Block {
  id: Uuid,
  text: String,
  #[serde(rename = "type")]
  type_field: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct H3Block {
  id: Uuid,
  text: String,
  #[serde(rename = "type")]
  type_field: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParagraphBlock {
  id: Uuid,
  text: RichText,
  #[serde(rename = "type")]
  type_field: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RichText {
  text: String,
  styles: Vec<Style>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageBlock {
  id: Uuid,
  path: String,
  #[serde(rename = "type")]
  type_field: String,
}
