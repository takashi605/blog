#[derive(Debug, Clone, Copy, PartialEq)]
pub enum ContentType {
    H2,
    H3,
    Paragraph,
    Image,
    CodeBlock,
}