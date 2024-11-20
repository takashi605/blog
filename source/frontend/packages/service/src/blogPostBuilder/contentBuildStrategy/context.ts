import { type Content } from 'entities/src/blogPost/postContents/content';
import type { ContentInput } from './input';
import type { ContentBuildStrategy } from './strategy';

export class ContentBuildStrategyContext<T extends Content> {
  private strategy: ContentBuildStrategy<T>;

  constructor(input: ContentInput<T>) {
    this.strategy = input.buildStrategy();
  }

  build(): T {
    return this.strategy.build();
  }
}
