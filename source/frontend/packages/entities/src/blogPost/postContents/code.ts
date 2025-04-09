import type { ContentBase } from '../postContents/content';
import { ContentType } from '../postContents/content';

export class Code implements ContentBase {
  private id: string;
  private language: string;
  private code: string;
  private title: string;

  constructor(id: string, title: string, code: string, language: string) {
    this.id = id;
    this.language = language;
    this.code = code;
    this.title = title;
  }

  getId() {
    return this.id;
  }
  getType(): ContentType.Code {
    return ContentType.Code;
  }
  getTitle() {
    return this.title;
  }
  getCode() {
    return this.code;
  }
  getLanguage() {
    return this.language;
  }
}
