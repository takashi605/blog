import type { ContentType } from '@/entities/postContants/content';

export type ContentInput = {
  type: ContentType;
  contentValue: string;
};

export const createContentByInput = (id: number, input: ContentInput) => {
  return {
    getId: () => id,
    getContent: () => input.contentValue,
    getContentType: () => input.type,
  };
};
