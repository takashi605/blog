import { EntityError } from '../error/error';

export class BlogPostDate {
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
