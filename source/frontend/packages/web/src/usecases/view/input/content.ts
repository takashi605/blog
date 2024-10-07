import type { ContentType } from "@/entities/postContants/content";

export type ContentInput = {
  type: ContentType;
  contentValue: string;
};
