#[derive(Debug, PartialEq)]
pub struct RichTextVO {
  text: Vec<RichTextPartVO>,
}

impl RichTextVO {
  pub fn new(text: Vec<RichTextPartVO>) -> Self {
    Self { text }
  }

  pub fn get_text(&self) -> &[RichTextPartVO] {
    &self.text
  }
}

#[derive(Debug, PartialEq)]
pub struct RichTextPartVO {
  text: String,
  styles: RichTextStylesVO,
  link: Option<LinkVO>,
}

impl RichTextPartVO {
  pub fn new(text: String, styles: Option<RichTextStylesVO>, link: Option<LinkVO>) -> Self {
    Self {
      text,
      styles: styles.unwrap_or_default(),
      link,
    }
  }

  pub fn get_text(&self) -> &str {
    &self.text
  }

  pub fn get_styles(&self) -> &RichTextStylesVO {
    &self.styles
  }

  pub fn get_link(&self) -> Option<&LinkVO> {
    self.link.as_ref()
  }
}

#[derive(Debug, PartialEq, Default)]
pub struct RichTextStylesVO {
  pub bold: bool,
  pub inline_code: bool,
}

#[derive(Debug, PartialEq)]
pub struct LinkVO {
  pub url: String,
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn can_create_rich_text_vo() {
    let parts = vec![
      RichTextPartVO::new("通常のテキスト".to_string(), None, None),
      RichTextPartVO::new(
        "太字のテキスト".to_string(),
        Some(RichTextStylesVO {
          bold: true,
          inline_code: false,
        }),
        None,
      ),
    ];
    let rich_text = RichTextVO::new(parts);

    assert_eq!(rich_text.get_text().len(), 2);
    assert_eq!(rich_text.get_text()[0].get_text(), "通常のテキスト");
    assert_eq!(rich_text.get_text()[1].get_text(), "太字のテキスト");
    assert!(rich_text.get_text()[1].get_styles().bold);
  }

  #[test]
  fn rich_text_part_vo_can_have_link() {
    let link = LinkVO {
      url: "https://example.com".to_string(),
    };
    let part = RichTextPartVO::new("リンクテキスト".to_string(), None, Some(link));

    assert_eq!(part.get_text(), "リンクテキスト");
    assert_eq!(part.get_link().unwrap().url, "https://example.com");
  }

  #[test]
  fn rich_text_part_vo_can_have_inline_code_style() {
    let part = RichTextPartVO::new(
      "console.log()".to_string(),
      Some(RichTextStylesVO {
        bold: false,
        inline_code: true,
      }),
      None,
    );

    assert!(part.get_styles().inline_code);
    assert!(!part.get_styles().bold);
  }
}
