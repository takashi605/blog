import { ContentType } from '../postContents/content';
import type { Heading } from '../postContents/heading';
import {
  ContentBuilder,
  ContentBuildStrategyContext,
  H2Input,
  H3Input,
  ImageInput,
  ParagraphInput,
} from './contentBuilder';

describe('エンティティ: 投稿記事の閲覧', () => {
  it('id およびユースケースへの入力値からコンテントを生成できる', () => {
    const contentBuilder = new ContentBuilder({
      type: ContentType.H3,
      contentValue: 'h3見出し',
    });
    const content = contentBuilder.build(2) as Heading;
    expect(content.getValue()).toBe('h3見出し');
    expect(content.getType()).toBe('h3');
    expect(content.getId()).toBe(2);
  });

  it('h2 を生成するストラテジー', () => {
    const h2Input = new H2Input('h2見出し');
    const strategyContext = new ContentBuildStrategyContext(h2Input);
    const h2 = strategyContext.build(1);
    expect(h2.getValue()).toBe('h2見出し');
  });

  it('h3 を生成するストラテジー', () => {
    const h3Input = new H3Input('h3見出し');
    const strategyContext = new ContentBuildStrategyContext(h3Input);
    const h3 = strategyContext.build(1);
    expect(h3.getValue()).toBe('h3見出し');
  });

  it('paragraph を生成するストラテジー', () => {
    const paragraphInput = new ParagraphInput('テキスト');
    const strategyContext = new ContentBuildStrategyContext(paragraphInput);
    const paragraph = strategyContext.build(1);
    expect(paragraph.getValue()).toBe('テキスト');
  });

  it('image を生成するストラテジー', () => {
    const imageInput = new ImageInput('path/to/image');
    const strategyContext = new ContentBuildStrategyContext(imageInput);
    const image = strategyContext.build(1);
    expect(image.getPath()).toBe('path/to/image');
  });
});
