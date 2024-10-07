import { createH1, createH2, createH3 } from "@/entities/postContants/heading";
import { createParagraph } from "@/entities/postContants/paragraph";

export const enum ContentType {
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  Paragraph = "paragraph",
}

export type Content = {
  getId: () => number;
  getContent: () => string;
  getContentType: () => string;
};

type ContentParams = { id: number; type: ContentType; value: string };

export const createContent = (params: ContentParams): Content => {
  switch (params.type) {
    case "h1":
      return createH1(params.id, params.value);
    case "h2":
      return createH2(params.id, params.value);
    case "h3":
      return createH3(params.id, params.value);
    case "paragraph":
      return createParagraph(params.id, params.value);
    default:
      throw new Error("不明なコンテントタイプです");
  }
};
