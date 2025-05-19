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
    inlineCode: false,
  };
  private link?: Link;

  constructor(text: string, styles?: RichTextStyles, link?: Link) {
    this.text = text;
    if (styles) {
      this.styles = styles;
    }
    if (link) {
      this.link = link;
    }
  }

  getText(): string {
    return this.text;
  }

  getStyles(): RichTextStyles {
    return this.styles;
  }

  getLink(): Link | undefined {
    return this.link;
  }
}

type RichTextStyles = {
  bold: boolean;
  inlineCode: boolean;
};

type Link = {
  url: string;
};
