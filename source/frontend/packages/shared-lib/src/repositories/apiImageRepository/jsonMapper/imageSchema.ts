import type { ImageDTO } from 'service/src/imageService/dto/imageDTO';
import { z } from 'zod';

export const imageSchema: z.ZodType<ImageDTO> = z.object({
  id: z.string(),
  path: z.string(),
});
