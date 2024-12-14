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
  private styles: RichTextStyles;

  constructor(text: string, styles?: RichTextStyles) {
    this.text = text;
    this.styles = styles || {};
  }
}

type RichTextStyles = {
  bold?: boolean;
}
