import { EntityError } from '../error/error';

export type BlogPostDate = {
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

export class n__BlogPostDate {
  date: Date;

  constructor(dateString: string) {
    if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new EntityError('日付は YYYY-MM-DD 形式で指定してください');
    }
    this.date = new Date(dateString);
  }

  format2DigitString(): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };
    return this.date.toLocaleDateString('ja-JP', options);
  }

  getDate(): Date {
    return this.date;
  }
}
