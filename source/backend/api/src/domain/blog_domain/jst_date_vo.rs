use chrono::{DateTime, Datelike, FixedOffset, NaiveDate, NaiveDateTime, NaiveTime, TimeZone, Timelike, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{Database, Decode, Encode, Type};

use crate::domain::blog_domain::errors::blog_domain_error::BlogDomainError;

/// JST（日本標準時）オフセット定数（+09:00）
const JST_OFFSET_SECONDS: i32 = 9 * 3600;

/// 日本標準時（JST）の日付を表す値オブジェクト
///
/// このVOは内部的に`NaiveDate`を保持し、常にJSTタイムゾーンの日付として扱います。
/// データベースとの変換時も、JSTの日付として解釈・保存されます。
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(transparent)]
pub struct JstDate {
  date: NaiveDate,
}

impl JstDate {
  /// 年月日からJSTの日付を作成する
  ///
  /// # Arguments
  ///
  /// * `year` - 年（西暦）
  /// * `month` - 月（1-12）
  /// * `day` - 日（1-31）
  ///
  /// # Errors
  ///
  /// 無効な日付（例：2月30日）の場合は`BlogDomainError::InvalidDate`を返す
  pub fn new(year: i32, month: u32, day: u32) -> Result<Self, BlogDomainError> {
    NaiveDate::from_ymd_opt(year, month, day).map(|date| Self { date }).ok_or_else(|| BlogDomainError::InvalidDate {
      detail: format!("無効な日付: {}/{}/{}", year, month, day),
    })
  }

  /// `NaiveDate`からJSTの日付を作成する
  ///
  /// 引数の`NaiveDate`はJSTの日付として解釈されます。
  pub fn from_naive_date(date: NaiveDate) -> Self {
    Self { date }
  }

  /// 現在のJST日付を取得する
  pub fn today() -> Self {
    let jst = FixedOffset::east_opt(JST_OFFSET_SECONDS).unwrap();
    let now_jst = Utc::now().with_timezone(&jst);
    Self { date: now_jst.date_naive() }
  }

  /// 内部の`NaiveDate`を取得する
  pub fn to_naive_date(&self) -> NaiveDate {
    self.date
  }

  /// UTCの`DateTime`からJSTの日付に変換する
  ///
  /// UTC時刻をJSTに変換し、その日付部分を取得します。
  pub fn from_utc_datetime(datetime: DateTime<Utc>) -> Self {
    let jst = FixedOffset::east_opt(JST_OFFSET_SECONDS).unwrap();
    let jst_datetime = datetime.with_timezone(&jst);
    Self {
      date: jst_datetime.date_naive(),
    }
  }

  /// JSTの0:00:00をUTCの`DateTime`に変換する
  ///
  /// この日付のJST 0:00:00に相当するUTC時刻を返します。
  pub fn to_utc_datetime(&self) -> DateTime<Utc> {
    let jst = FixedOffset::east_opt(JST_OFFSET_SECONDS).unwrap();
    let naive_datetime = NaiveDateTime::new(self.date, NaiveTime::from_hms_opt(0, 0, 0).unwrap());
    jst.from_local_datetime(&naive_datetime).unwrap().with_timezone(&Utc)
  }

  /// 年を取得する
  pub fn year(&self) -> i32 {
    self.date.year()
  }

  /// 月を取得する（1-12）
  pub fn month(&self) -> u32 {
    self.date.month()
  }

  /// 日を取得する（1-31）
  pub fn day(&self) -> u32 {
    self.date.day()
  }
}

// SQLx Type実装
impl<DB: Database> Type<DB> for JstDate
where
  NaiveDate: Type<DB>,
{
  fn type_info() -> DB::TypeInfo {
    NaiveDate::type_info()
  }

  fn compatible(ty: &DB::TypeInfo) -> bool {
    NaiveDate::compatible(ty)
  }
}

// SQLx Encode実装
impl<'q, DB: Database> Encode<'q, DB> for JstDate
where
  NaiveDate: Encode<'q, DB>,
{
  fn encode_by_ref(&self, buf: &mut <DB as sqlx::Database>::ArgumentBuffer<'q>) -> Result<sqlx::encode::IsNull, sqlx::error::BoxDynError> {
    self.date.encode_by_ref(buf)
  }
}

// SQLx Decode実装
impl<'r, DB: Database> Decode<'r, DB> for JstDate
where
  NaiveDate: Decode<'r, DB>,
{
  fn decode(value: <DB as sqlx::Database>::ValueRef<'r>) -> Result<Self, sqlx::error::BoxDynError> {
    let date = NaiveDate::decode(value)?;
    Ok(Self { date })
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::{Duration, NaiveDate};

  #[test]
  fn test_new_valid_date() {
    let result = JstDate::new(2024, 1, 15);
    assert!(result.is_ok());
    let jst_date = result.unwrap();
    assert_eq!(jst_date.year(), 2024);
    assert_eq!(jst_date.month(), 1);
    assert_eq!(jst_date.day(), 15);
  }

  #[test]
  fn test_new_invalid_date() {
    // 2月30日は存在しない
    let result = JstDate::new(2024, 2, 30);
    assert!(result.is_err());
    let err = result.unwrap_err();
    assert!(matches!(err, BlogDomainError::InvalidDate { .. }));
  }

  #[test]
  fn test_from_naive_date() {
    let naive_date = NaiveDate::from_ymd_opt(2024, 3, 20).unwrap();
    let jst_date = JstDate::from_naive_date(naive_date);
    assert_eq!(jst_date.to_naive_date(), naive_date);
  }

  #[test]
  fn test_today() {
    // today()が正常に動作することを確認（具体的な日付は環境依存）
    let today = JstDate::today();
    let now_utc = Utc::now();
    let jst = FixedOffset::east_opt(JST_OFFSET_SECONDS).unwrap();
    let now_jst = now_utc.with_timezone(&jst);

    // 日付が一致することを確認（境界付近では日付がずれる可能性があるため、1日の余裕を見る）
    let expected_date = now_jst.date_naive();
    let actual_date = today.to_naive_date();
    let diff = actual_date.signed_duration_since(expected_date).num_days().abs();
    assert!(diff <= 1, "日付の差が1日以内であること");
  }

  #[test]
  fn test_utc_jst_boundary() {
    // UTC 15:00 = JST 翌日 0:00 のケース
    let utc_datetime = DateTime::parse_from_rfc3339("2024-01-15T15:00:00Z").unwrap().with_timezone(&Utc);
    let jst_date = JstDate::from_utc_datetime(utc_datetime);

    // JSTでは翌日になるはず
    assert_eq!(jst_date.year(), 2024);
    assert_eq!(jst_date.month(), 1);
    assert_eq!(jst_date.day(), 16); // UTC 15日 -> JST 16日
  }

  #[test]
  fn test_to_utc_datetime() {
    // JST 2024-01-16 00:00:00 = UTC 2024-01-15 15:00:00
    let jst_date = JstDate::new(2024, 1, 16).unwrap();
    let utc_datetime = jst_date.to_utc_datetime();

    assert_eq!(utc_datetime.year(), 2024);
    assert_eq!(utc_datetime.month(), 1);
    assert_eq!(utc_datetime.day(), 15); // JST 16日 -> UTC 15日
    assert_eq!(utc_datetime.hour(), 15); // JST 0時 -> UTC 15時
    assert_eq!(utc_datetime.minute(), 0);
    assert_eq!(utc_datetime.second(), 0);
  }

  #[test]
  fn test_serialization() {
    let jst_date = JstDate::new(2024, 3, 15).unwrap();

    // JSON シリアライズ
    let json = serde_json::to_string(&jst_date).unwrap();
    assert_eq!(json, r#""2024-03-15""#);

    // JSON デシリアライズ
    let deserialized: JstDate = serde_json::from_str(&json).unwrap();
    assert_eq!(deserialized, jst_date);
  }

  #[test]
  fn test_ordering() {
    let date1 = JstDate::new(2024, 1, 15).unwrap();
    let date2 = JstDate::new(2024, 1, 16).unwrap();
    let date3 = JstDate::new(2024, 1, 15).unwrap();

    assert!(date1 < date2);
    assert!(date2 > date1);
    assert_eq!(date1, date3);
  }

  #[test]
  fn test_clone() {
    let original = JstDate::new(2024, 5, 20).unwrap();
    let cloned = original.clone();
    assert_eq!(original, cloned);
  }

  #[test]
  fn test_debug_format() {
    let jst_date = JstDate::new(2024, 12, 25).unwrap();
    let debug_str = format!("{:?}", jst_date);
    assert!(debug_str.contains("JstDate"));
    assert!(debug_str.contains("2024-12-25"));
  }

  #[test]
  fn test_edge_cases() {
    // 年末
    let year_end = JstDate::new(2024, 12, 31).unwrap();
    assert_eq!(year_end.year(), 2024);
    assert_eq!(year_end.month(), 12);
    assert_eq!(year_end.day(), 31);

    // うるう年
    let leap_day = JstDate::new(2024, 2, 29).unwrap();
    assert_eq!(leap_day.day(), 29);

    // 非うるう年の2月29日はエラー
    let non_leap = JstDate::new(2023, 2, 29);
    assert!(non_leap.is_err());
  }

  #[test]
  fn test_date_arithmetic() {
    let date = JstDate::new(2024, 3, 15).unwrap();
    let naive_date = date.to_naive_date();

    // 1日後
    let next_day = naive_date + Duration::days(1);
    let next_jst_date = JstDate::from_naive_date(next_day);
    assert_eq!(next_jst_date.day(), 16);

    // 1ヶ月後（chronoのadd_monthsを使用する場合）
    let next_month =
      naive_date.with_month(naive_date.month() + 1).unwrap_or_else(|| naive_date.with_month(1).unwrap().with_year(naive_date.year() + 1).unwrap());
    let next_month_jst = JstDate::from_naive_date(next_month);
    assert_eq!(next_month_jst.month(), 4);
  }
}
