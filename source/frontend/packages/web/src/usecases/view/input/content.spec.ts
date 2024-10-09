import {
  createContentByInput,
  type ContentInput,
} from '@/usecases/view/input/content';
import { ContentType } from 'entities/src/postContents/content';

describe('ユースケース: 投稿記事の閲覧', () => {
  it('id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentInput: ContentInput = {
      type: ContentType.H2,
      contentValue: 'h2見出し',
    };
    const content = createContentByInput(1, contentInput);
    expect(content.getValue()).toBe('h2見出し');
    expect(content.getType()).toBe('h2');
    expect(content.getId()).toBe(1);
  });
});
