import { ContentType } from '../postContents/content';
import { ContentBuilder, H2BuildStrategy } from './contentBuilder';

describe('エンティティ: 投稿記事の閲覧', () => {
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

  it('h2 を生成するストラテジー', () => {
    const h2BuildStrategy = new H2BuildStrategy('h2見出し');
    const h2 = h2BuildStrategy.build(1);
    expect(h2.getValue()).toBe('h2見出し');
  });
});
