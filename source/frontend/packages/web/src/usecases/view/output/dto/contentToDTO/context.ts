import type { ContentToDTOStrategy } from '@/usecases/view/output/dto/contentToDTO/strategy';
import type { ContentForDTO } from '@/usecases/view/output/dto/contentToDTO/types';
import type { Content } from 'entities/src/blogPost/postContents/content';

export class ContentToDTOContext<T extends Content, U extends ContentForDTO> {
  private strategy: ContentToDTOStrategy<T, U>;

  constructor(strategy: ContentToDTOStrategy<T, U>) {
    this.strategy = strategy;
  }

  toDTO(): U {
    return this.strategy.toDTO();
  }
}
