use common::types::api::response::{BlogPost, BlogPostContent, H2Block};

pub fn assert_blog_post_without_uuid(actual: &BlogPost, expected: &BlogPost) {
  // BlogPost の id, title, post_date などを比較
  assert_eq!(actual.id, expected.id);
  assert_eq!(actual.title, expected.title);
  assert_eq!(actual.thumbnail.path, expected.thumbnail.path);
  assert_eq!(actual.post_date, expected.post_date);
  assert_eq!(actual.last_update_date, expected.last_update_date);

  // contents が空だとテストにならないのではじく
  assert!(actual.contents.len() > 0);

  // contents の要素数をチェック
  assert_eq!(actual.contents.len(), expected.contents.len());

  // 各要素ごとに「id だけ無視して他は比較」
  for (i, (actual_block, expected_block)) in actual.contents.iter().zip(&expected.contents).enumerate() {
    match actual_block {
      BlogPostContent::H2(a) => {
        // TODO json にシリアライズするタイミングで H2 or H3型の情報が抜け落ちているので、Heading 型に統一する
        let e = match expected_block {
          BlogPostContent::H2(e) => e,
          BlogPostContent::H3(e) => &H2Block {
            id: e.id,
            text: e.text.clone(),
            type_field: e.type_field.clone(),
          },
          _ => panic!("H2 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H2のテキスト不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "H2のtype_field不一致: contents[{}]", i);
      }
      BlogPostContent::H3(a) => {
        let e = match expected_block {
          BlogPostContent::H3(e) => e,
          _ => panic!("H3 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "H3のテキスト不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "H3のtype_field不一致: contents[{}]", i);
      }
      BlogPostContent::Paragraph(a) => {
        let e = match expected_block {
          BlogPostContent::Paragraph(e) => e,
          _ => panic!("Paragraph 以外の要素が入っています"),
        };
        assert_eq!(a.text, e.text, "Paragraphのテキスト不一致: contents[{}]", i);
      }
      BlogPostContent::Image(a) => {
        let e = match expected_block {
          BlogPostContent::Image(e) => e,
          _ => panic!("Image 以外の要素が入っています"),
        };
        assert_eq!(a.path, e.path, "Imageのpath不一致: contents[{}]", i);
        assert_eq!(a.type_field, e.type_field, "Imageのtype_field不一致: contents[{}]", i);
      }
    }
  }
}
