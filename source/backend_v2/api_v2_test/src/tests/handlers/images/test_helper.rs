use common::types::api::response::Image;

pub fn assert_image(actual: &Image, expected: &Image) {
  // uuid は適当に生成されるので長さだけチェック
  assert_eq!(actual.id.to_string().len(), 36);
  assert_eq!(actual.path, expected.path);
}

pub fn assert_images(actual: &Vec<Image>, expected: &Vec<Image>) {
  assert_eq!(actual.len(), expected.len());
  for (actual, expected) in actual.iter().zip(expected) {
    assert_image(actual, expected);
  }
}
