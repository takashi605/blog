export class RichText {
  private text: RichTextPart[];

  constructor(text: RichTextPart[]) {
    this.text = text;
  }

  getText(): RichTextPart[] {
    return this.text;
  }
}

export class RichTextPart {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }
}
