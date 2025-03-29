#[derive(PartialEq, Debug)]
pub enum Methods {
  GET,
  POST { body: String },
  PUT { body: String },
}
