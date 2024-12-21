import { mockRichTextDTO } from '../../../mockData/mockBlogPostDTO';
import { ContentBuildStrategyContext } from './context';
import { H2Input, H3Input, ImageInput, ParagraphInput } from './input';

describe('エンティティ: 投稿記事の閲覧', () => {
  it('h2 を生成するストラテジー', () => {
    const h2Input = new H2Input('1', 'h2見出し');
    const strategyContext = new ContentBuildStrategyContext(h2Input);
    const h2 = strategyContext.build();

    expect(h2.getId()).toBe('1');
    expect(h2.getValue()).toBe('h2見出し');
    expect(h2.getType()).toBe('h2');
  });

  it('h3 を生成するストラテジー', () => {
    const h3Input = new H3Input('1', 'h3見出し');
    const strategyContext = new ContentBuildStrategyContext(h3Input);
    const h3 = strategyContext.build();

    expect(h3.getId()).toBe('1');
    expect(h3.getValue()).toBe('h3見出し');
    expect(h3.getType()).toBe('h3');
  });

  it('paragraph を生成するストラテジー', () => {
    const paragraphInput = new ParagraphInput('1', mockRichTextDTO());
    const strategyContext = new ContentBuildStrategyContext(paragraphInput);
    const paragraph = strategyContext.build();

    expect(paragraph.getId()).toBe('1');
    expect(paragraph.getValue()).toBeDefined();
    expect(paragraph.getType()).toBe('paragraph');
  });

  it('image を生成するストラテジー', () => {
    const imageInput = new ImageInput('1', 'path/to/image');
    const strategyContext = new ContentBuildStrategyContext(imageInput);
    const image = strategyContext.build();

    expect(image.getId()).toBe('1');
    expect(image.getPath()).toBe('path/to/image');
    expect(image.getType()).toBe('image');
  });
});
