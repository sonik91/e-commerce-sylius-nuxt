// types/Image.ts
import { z } from 'zod';

export const ImageSchema = z.object({
  '@id': z.string().nullable().default(null),
  '@type': z.string().nullable().default(null),
  id: z.number().nullable().default(null),
  type: z.string().nullable().default(null),
  path: z.string().default('/defaultProduct.jpg'),
});

// Génération du type TypeScript à partir du schéma
export type Image = z.infer<typeof ImageSchema>;
