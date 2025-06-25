use common::types::api::Image;

pub fn assert_image(actual: &Image, expected: &Image) {
  // uuid は適当に生成されるので長さだけチェック
  assert_eq!(actual.id.to_string().len(), 36);
  assert_eq!(actual.path, expected.path);
}
