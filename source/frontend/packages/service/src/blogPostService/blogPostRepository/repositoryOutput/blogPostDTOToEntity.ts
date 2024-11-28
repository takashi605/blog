import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from '../../blogPostEntityBuilder';
import { createBlogPostBuilder } from '../../blogPostEntityBuilder';
import type { BlogPostDTO } from './blogPostDTO';

export function fetchedDataToEntity(dto: BlogPostDTO): BlogPost {
  const entityBuilder = createBlogPostBuilder()
    .setId(dto.id)
    .setPostTitle(dto.title)
    .setThumbnail(dto.thumbnail.path)
    .setPostDate(dto.postDate)
    .setLastUpdateDate(dto.lastUpdateDate);

  fetchedContentToEntity(dto, entityBuilder);
  return entityBuilder.build();
}

function fetchedContentToEntity(
  dto: BlogPostDTO,
  entityBuilder: BlogPostBuilder,
) {
  dto.contents.forEach((content) => {
    if (content.type === 'h2') {
      entityBuilder.addH2(content.id, content.text);
    } else if (content.type === 'h3') {
      entityBuilder.addH3(content.id, content.text);
    } else if (content.type === 'paragraph') {
      entityBuilder.addParagraph(content.id, content.text);
    } else if (content.type === 'image') {
      entityBuilder.addImage(content.id, content.path);
    }
  });
}
