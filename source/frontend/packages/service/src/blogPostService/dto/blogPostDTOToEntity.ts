import type { BlogPost } from 'entities/src/blogPost';
import type { BlogPostBuilder } from '../entityBuilder/blogPostBuilder';
import { createBlogPostBuilder } from '../entityBuilder/blogPostBuilder';
import type { BlogPostDTO } from './blogPostDTO';

export function blogPostDTOToEntity(dto: BlogPostDTO): BlogPost {
  const entityBuilder = createBlogPostBuilder()
    .setId(dto.id)
    .setPostTitle(dto.title)
    .setThumbnail(dto.thumbnail.id, dto.thumbnail.path)
    .setPostDate(dto.postDate)
    .setLastUpdateDate(dto.lastUpdateDate);

  contentToEntity(dto, entityBuilder);
  return entityBuilder.build();
}

function contentToEntity(dto: BlogPostDTO, entityBuilder: BlogPostBuilder) {
  dto.contents.forEach((content) => {
    if (content.type === 'h2') {
      entityBuilder.addH2(content.id, content.text);
    } else if (content.type === 'h3') {
      entityBuilder.addH3(content.id, content.text);
    } else if (content.type === 'paragraph') {
      entityBuilder.addParagraph(content.id, content.text);
    } else if (content.type === 'image') {
      entityBuilder.addImage(content.id, content.path);
    } else if (content.type === 'codeBlock') {
      entityBuilder.addCodeBlock(
        content.id,
        content.title,
        content.code,
        content.language,
      );
    }
  });
}
