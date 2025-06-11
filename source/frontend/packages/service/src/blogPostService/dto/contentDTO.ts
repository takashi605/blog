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
  type: 'h2';
};
export type H3DTO = {
  id: string;
  text: string;
  type: 'h3';
};

export type ParagraphDTO = {
  id: string;
  text: RichTextDTO;
  type: 'paragraph';
};

export type ImageContentDTO = {
  id: string;
  type: 'image';
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
  type: 'codeBlock';
  title: string;
  code: string;
  language: string;
};
