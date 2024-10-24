import {
  ContentBuilder,
  createContent,
  type ContentForBlogPostBuilder,
} from '@/usecases/entityBuilder/content';
import { ContentType } from 'entities/src/blogPost/postContents/content';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('【旧】id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentInput: ContentForBlogPostBuilder = {
      type: ContentType.H2,
      contentValue: 'h2見出し',
    };
    const content = createContent(1, contentInput);
    expect(content.getValue()).toBe('h2見出し');
    expect(content.getType()).toBe('h2');
    expect(content.getId()).toBe(1);
  });

  it('id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentBuilder = new ContentBuilder({
      type: ContentType.H3,
      contentValue: 'h3見出し',
    });
    const content = contentBuilder.createContent(2);
    expect(content.getValue()).toBe('h3見出し');
    expect(content.getType()).toBe('h3');
    expect(content.getId()).toBe(2);
  });
});
