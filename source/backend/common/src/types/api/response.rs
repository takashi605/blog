use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BlogPost {
  pub id: Uuid,
  pub title: String,
  pub thumbnail: Image,
  pub post_date: NaiveDate,
  pub last_update_date: NaiveDate,
  pub contents: Vec<BlogPostContent>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Image {
  pub id: Uuid,
  pub path: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Style {
  pub bold: bool,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(untagged, rename_all = "camelCase")]
pub enum BlogPostContent {
  H2(H2Block),
  H3(H3Block),
  Paragraph(ParagraphBlock),
  Image(ImageBlock),
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct H2Block {
  pub id: Uuid,
  pub text: String,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct H3Block {
  pub id: Uuid,
  pub text: String,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ParagraphBlock {
  pub id: Uuid,
  pub text: Vec<RichText>,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RichText {
  pub text: String,
  pub styles: Style,
}

#[derive(Serialize, Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ImageBlock {
  pub id: Uuid,
  pub path: String,
  #[serde(rename = "type")]
  pub type_field: String,
}
