import playwrightHelper from '../support/playwrightHelper.js';

export default class PostsManageSection {
  getLocator() {
    const page = playwrightHelper.getPage();
    return page.locator('[data-testid="posts-manage-section"]');
  }

  getPostCards() {
    const section = this.getLocator();
    return section.locator('[data-testid="post-card"]');
  }

  getPostTitles() {
    const postCards = this.getPostCards();
    return postCards.locator('h3');
  }

  getPostDates() {
    const postCards = this.getPostCards();
    return postCards.locator('[data-testid="post-date"]');
  }

  getThumbnailImages() {
    const postCards = this.getPostCards();
    return postCards.locator('img[alt="サムネイル画像"]');
  }

  getEditButtons() {
    const postCards = this.getPostCards();
    return postCards.getByRole('button', { name: '編集' });
  }
}