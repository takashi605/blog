import { createH1 } from "@/entities/postContants/heading";

export type Content = {
  getId: () => number;
  getContent: () => string;
  getContentType: () => string;
};

type ContentParams = { id: number; type: string; value: string };

export const createContent = (params: ContentParams): Content => {
  return createH1(params.id, params.value);
};
