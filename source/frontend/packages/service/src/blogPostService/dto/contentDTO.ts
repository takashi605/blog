// 既存のエンティティインポートを削除し、直接型定義を使用

export type ContentDTO =
  | H2DTO
  | H3DTO
  | ParagraphDTO
  | ImageContentDTO
  | CodeBlockDTO;

export type H2DTO = {
  id: string;
  text: string;
  type: string;
};
export type H3DTO = {
  id: string;
  text: string;
  type: string;
};

export type ParagraphDTO = {
  id: string;
  text: RichTextDTO;
  type: string;
};

export type ImageContentDTO = {
  id: string;
  type: string;
  path: string;
};

export type RichTextDTO = {
  text: string;
  styles: {
    bold: boolean;
    inlineCode: boolean;
  };
  link?: {
    url: string;
  } | null;
}[];

export type CodeBlockDTO = {
  id: string;
  type: string;
  title: string;
  code: string;
  language: string;
};
