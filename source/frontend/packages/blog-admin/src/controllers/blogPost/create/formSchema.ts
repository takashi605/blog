import { z } from 'zod';

export const createBlogPostFormSchema = z.object({
  title: z.string(),
  contents: z
    .object({
      type: z.enum(['h2', 'h3', 'paragraph']),
      text: z.string(),
    })
    .array(),
});

export type CreateBlogPostFormData = z.infer<typeof createBlogPostFormSchema>;
