import { ContentType } from 'entities/src/blogPost/postContents/content';
import { createUUIDv4 } from '../../utils/uuid';
import type { BlogPostDTO } from './blogPostDTO';
import { fetchedDataToEntity } from './blogPostDTOToEntity';

describe('blogPostDTOToEntity', () => {
  it('DTO からエンティティに変換する', () => {
    const id = createUUIDv4();
    const dto: BlogPostDTO = {
      id,
      title: 'title',
      postDate: '2021-01-01',
      lastUpdateDate: '2021-01-02',
      thumbnail: {
        path: 'path/to/thumbnail',
      },
      contents: [
        { id: createUUIDv4(), type: ContentType.H2, text: 'h2 text' },
        { id: createUUIDv4(), type: ContentType.H3, text: 'h3 text' },
      ],
    };
    const entity = fetchedDataToEntity(dto);

    expect(entity).toHaveProperty('id', id);
    expect(entity).toHaveProperty('title', 'title');
    expect(entity).toHaveProperty('thumbnail');
    expect(entity).toHaveProperty('postDate');
    expect(entity).toHaveProperty('lastUpdateDate');
    expect(entity).toHaveProperty('contents');
  });
});
