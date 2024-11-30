import type { Content } from 'entities/src/blogPost/postContents/content';
import type { ContentToDTOStrategy } from './strategy';
import type { ContentForDTO } from './types';

export class ContentToDTOContext<T extends Content, U extends ContentForDTO> {
  private strategy: ContentToDTOStrategy<T, U>;

  constructor(strategy: ContentToDTOStrategy<T, U>) {
    this.strategy = strategy;
  }

  toDTO(): U {
    return this.strategy.toDTO();
  }
}
