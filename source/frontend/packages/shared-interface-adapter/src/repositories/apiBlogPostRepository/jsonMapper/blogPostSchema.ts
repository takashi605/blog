import { ContentType } from 'entities/src/blogPost/postContents/content';
import type { BlogPostDTO } from 'service/src/blogPostService/dto/blogPostDTO';
import { z } from 'zod';

export const blogPostResponseSchema: z.ZodType<BlogPostDTO> = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.object({
    id: z.string(),
    path: z.string(),
  }),
  postDate: z.string(),
  lastUpdateDate: z.string(),
  contents: z.array(blogPostContentSchema()),
});

function blogPostContentSchema() {
  return z.discriminatedUnion('type', [
    z.object({
      type: z.literal(ContentType.H2),
      id: z.string(),
      text: z.string(),
    }),
    z.object({
      type: z.literal(ContentType.H3),
      id: z.string(),
      text: z.string(),
    }),
    z.object({
      type: z.literal(ContentType.Paragraph),
      id: z.string(),
      text: z.array(
        z.object({
          text: z.string(),
          styles: z.optional(
            z.object({
              bold: z.boolean(),
            }),
          ),
        }),
      ),
    }),
    z.object({
      type: z.literal(ContentType.Image),
      id: z.string(),
      path: z.string(),
    }),
    z.object({
      type: z.literal(ContentType.Code),
      id: z.string(),
      title: z.string(),
      code: z.string(),
      language: z.string(),
    }),
  ]);
}
