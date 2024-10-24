import {
  createContent,
  type ContentForBlogPostBuilder,
} from '@/usecases/entityBuilder/content';
import { ContentType } from 'entities/src/blogPost/postContents/content';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentInput: ContentForBlogPostBuilder = {
      type: ContentType.H2,
      contentValue: 'h2見出し',
    };
    const content = createContent(1, contentInput);
    expect(content.getValue()).toBe('h2見出し');
    expect(content.getType()).toBe('h2');
    expect(content.getId()).toBe(1);
  });
});
