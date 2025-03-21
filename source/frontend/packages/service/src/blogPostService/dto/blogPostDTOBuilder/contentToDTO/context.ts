import type { Content } from 'entities/src/blogPost/postContents/content';
import type { ContentDTO } from '../../contentDTO';
import type { ContentToDTOStrategy } from './strategy';

export class ContentToDTOContext<T extends Content, U extends ContentDTO> {
  private strategy: ContentToDTOStrategy<T, U>;

  constructor(strategy: ContentToDTOStrategy<T, U>) {
    this.strategy = strategy;
  }

  toDTO(): U {
    return this.strategy.toDTO();
  }
}
