export class RichText {
  private text: RichTextPart;

  constructor(text: RichTextPart) {
    this.text = text;
  }

  getText() {
    return this.text.getText();
  }
}

export class RichTextPart {
  private text: string;

  constructor(text: string) {
    this.text = text;
  }

  getText() {
    return this.text;
  }
}
