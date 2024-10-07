import { createH1, createH2, createH3 } from "@/entities/postContants/heading";

export type Content = {
  getId: () => number;
  getContent: () => string;
  getContentType: () => string;
};

type ContentParams = { id: number; type: string; value: string };

export const createContent = (params: ContentParams): Content => {
  switch (params.type) {
    case "h1":
      return createH1(params.id, params.value);
    case "h2":
      return createH2(params.id, params.value);
    case "h3":
      return createH3(params.id, params.value);
    default:
      throw new Error("不明なコンテントタイプです");
  }
};
