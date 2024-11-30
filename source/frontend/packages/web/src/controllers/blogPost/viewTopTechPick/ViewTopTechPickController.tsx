import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { createUUIDv4 } from 'service/src/utils/uuid';
import ViewTopTechPickPresenter from './ViewTopTechPickPresenter';

async function ViewTopTechPickController() {
  const dto: BlogPostDTO = {
    id: createUUIDv4(),
    title: '記事タイトル',
    postDate: '2021-01-01',
    lastUpdateDate: '2021-01-02',
    thumbnail: { path: 'path/to/thumbnail' },
    contents: [
      { id: createUUIDv4(), type: ContentType.H2, text: 'h2見出し1' },
      { id: createUUIDv4(), type: ContentType.H3, text: 'h3見出し1' },
      { id: createUUIDv4(), type: ContentType.Paragraph, text: '段落1' },
    ],
  };

  return <ViewTopTechPickPresenter blogPostDTO={dto} />;
}

export default ViewTopTechPickController;
