// types/Image.ts
import { z } from 'zod';

export const TaxonSchema = z.object({
  children: z.array(z.lazy(() => TaxonSchema)).nullable().default([]),
  code: z.string().nullable().default(null),
  description: z.string().nullable().default(null),
  id: z.number().nullable().default(null),
  images : z.array(z.any()).default([]),
  name: z.string().nullable().default(null),
  slug: z.string().nullable().default(null),
  isLeaf: z.boolean().default(false)
});

// Génération du type TypeScript à partir du schéma
export type Taxon = z.infer<typeof TaxonSchema>;
