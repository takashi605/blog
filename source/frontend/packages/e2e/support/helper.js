export function createRichTextHelper(page) {
  return {
    async insertText(text) {
      const richTextEditor = page.locator('[contenteditable="true"]');
      await richTextEditor.click();
      await richTextEditor.type(text);
    },

    async selectText(text) {
      const richTextEditor = page.locator('[contenteditable="true"]');
      await richTextEditor.click();
      
      // テキストを全選択してから対象テキストを検索
      await page.keyboard.press('Control+a');
      await page.keyboard.press('Control+f');
      await page.keyboard.type(text);
      await page.keyboard.press('Escape');
      
      // または、より直接的な方法でテキストを選択
      await richTextEditor.selectText(text);
    },

    async selectAndDelete(text) {
      await this.selectText(text);
      await page.keyboard.press('Delete');
    },

    async clickBoldButton() {
      const boldButton = page.getByRole('button', { name: '太字' }).or(
        page.locator('button[data-testid="bold-button"]')
      ).or(
        page.locator('button:has([data-icon="bold"])')
      );
      await boldButton.first().click();
    },

    async clickInlineCodeButton() {
      const inlineCodeButton = page.getByRole('button', { name: 'インラインコード' }).or(
        page.locator('button[data-testid="inline-code-button"]')
      ).or(
        page.locator('button:has([data-icon="code"])')
      );
      await inlineCodeButton.first().click();
    },

    async clickLinkButton() {
      const linkButton = page.getByRole('button', { name: 'リンク' }).or(
        page.locator('button[data-testid="link-button"]')
      ).or(
        page.locator('button:has([data-icon="link"])')
      );
      await linkButton.first().click();
    },

    async clickHeadingButton(level) {
      const headingButton = page.getByRole('button', { name: level }).or(
        page.locator(`button[data-testid="${level}-button"]`)
      ).or(
        page.locator(`button:has-text("${level}")`)
      );
      await headingButton.first().click();
    },

    async clickCodeBlockButton() {
      const codeBlockButton = page.getByRole('button', { name: 'コードブロック' }).or(
        page.getByRole('button', { name: 'code' })
      ).or(
        page.locator('button[data-testid="code-block-button"]')
      );
      await codeBlockButton.first().click();
    }
  };
}