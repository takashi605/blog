import { ContentBuilder } from '../../blogPost/blogPostBuilder/content';
import { ContentType } from '../../blogPost/postContents/content';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentBuilder = new ContentBuilder({
      type: ContentType.H3,
      contentValue: 'h3見出し',
    });
    const content = contentBuilder.build(2);
    expect(content.getValue()).toBe('h3見出し');
    expect(content.getType()).toBe('h3');
    expect(content.getId()).toBe(2);
  });
});
