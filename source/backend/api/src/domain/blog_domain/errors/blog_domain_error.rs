use std::fmt;

/// ブログドメイン関連のエラー
#[derive(Debug, Clone, PartialEq)]
pub enum BlogDomainError {
  /// 未公開記事の閲覧を試行した場合のエラー
  UnpublishedPostAccess {
    /// 記事のタイトル
    post_title: String,
  },
}

impl fmt::Display for BlogDomainError {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      BlogDomainError::UnpublishedPostAccess { post_title } => {
        write!(f, "未公開記事「{}」にアクセスすることはできません", post_title)
      }
    }
  }
}

impl std::error::Error for BlogDomainError {}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn unpublished_post_access_error_displays_correct_message() {
    let error = BlogDomainError::UnpublishedPostAccess {
      post_title: "テスト記事".to_string(),
    };

    assert_eq!(error.to_string(), "未公開記事「テスト記事」にアクセスすることはできません");
  }

  #[test]
  fn unpublished_post_access_error_is_debug_formatted() {
    let error = BlogDomainError::UnpublishedPostAccess {
      post_title: "デバッグテスト".to_string(),
    };

    let debug_output = format!("{:?}", error);
    assert!(debug_output.contains("UnpublishedPostAccess"));
    assert!(debug_output.contains("デバッグテスト"));
  }

  #[test]
  fn unpublished_post_access_error_supports_equality() {
    let error1 = BlogDomainError::UnpublishedPostAccess {
      post_title: "同じタイトル".to_string(),
    };
    let error2 = BlogDomainError::UnpublishedPostAccess {
      post_title: "同じタイトル".to_string(),
    };
    let error3 = BlogDomainError::UnpublishedPostAccess {
      post_title: "異なるタイトル".to_string(),
    };

    assert_eq!(error1, error2);
    assert_ne!(error1, error3);
  }
}
