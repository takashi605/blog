import type { Content, ContentType } from '@/entities/postContants/content';

export type ContentInput = {
  type: ContentType;
  contentValue: string;
};

export const createContentByInput = (
  id: number,
  input: ContentInput,
): Content => {
  return {
    getId: () => id,
    getValue: () => input.contentValue,
    getType: () => input.type,
  };
};
