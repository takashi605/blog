use chrono::NaiveDate;
use serde::Deserialize;
use uuid::Uuid;

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BlogPost {
  pub id: Uuid,
  pub title: String,
  pub thumbnail: Image,
  pub post_date: NaiveDate,
  pub last_update_date: NaiveDate,
  pub contents: Vec<BlogPostContent>,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Image {
  pub path: String,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Style {
  pub bold: bool,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub enum BlogPostContent {
  H2(H2Block),
  H3(H3Block),
  Paragraph(ParagraphBlock),
  Image(ImageBlock),
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct H2Block {
  pub id: Uuid,
  pub text: String,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct H3Block {
  pub id: Uuid,
  pub text: String,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ParagraphBlock {
  pub id: Uuid,
  pub text: RichText,
  #[serde(rename = "type")]
  pub type_field: String,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RichText {
  pub text: String,
  pub styles: Vec<Style>,
}

#[derive(Deserialize, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ImageBlock {
  pub id: Uuid,
  pub path: String,
  #[serde(rename = "type")]
  pub type_field: String,
}
