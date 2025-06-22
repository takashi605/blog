// DTOの定義（APIリクエストから受け取るデータ構造）

#[derive(Debug, Clone)]
pub struct RegisterImageDTO {
    pub path: String,
}