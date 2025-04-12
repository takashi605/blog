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
  private styles: RichTextStyles = {
    bold: false,
  };

  constructor(text: string, styles?: RichTextStyles) {
    this.text = text;
    if (styles) {
      this.styles = styles;
    }
  }

  getText(): string {
    return this.text;
  }

  getStyles(): RichTextStyles {
    return this.styles;
  }
}

type RichTextStyles = {
  bold?: boolean;
  inline?: boolean;
};
