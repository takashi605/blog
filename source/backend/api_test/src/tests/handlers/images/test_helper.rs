use common::types::api::{CreateImageRequest, Image};

pub fn assert_image(actual: &Image, expected: &CreateImageRequest) {
  // uuid は適当に生成されるので長さだけチェック
  assert_eq!(actual.id.to_string().len(), 36);
  assert_eq!(actual.path, expected.path);
}
