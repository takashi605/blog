import { EntityError } from '@/error/error';

type BlogPostDate = {
  value: Date;
  getDate: () => Date;
};

export const createBlogPostDate = (dateString: string): BlogPostDate => {
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new EntityError('日付は YYYY-MM-DD 形式で指定してください');
  }
  const value = new Date(dateString);

  return {
    value,
    getDate: () => value,
  };
};
