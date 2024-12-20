// types/Product.ts

import { z } from 'zod';
import { ImageSchema } from '~/types/Image';
import { VariantSchema } from '~/types/Variant';

export const ProductSchema = z.object({
  id: z.number(),
  mainTaxon: z.union([z.array(z.any()), z.string()]).default([]),
  averageRating: z.number(),
  reviews: z.array(z.any()).default([]),
  images: z.array(ImageSchema),
  code: z.string(),
  slug: z.string(),
  options: z.array(z.any()).default([]),
  associations: z.array(z.any()).default([]),
  updatedAt: z.date(),
  name: z.string(),
  shortDescription: z.string(),
  description: z.string(),
  currency: z.string().nullable().default(null),
  url: z.string(),
  variant: z.array(VariantSchema).default([]),
  defaultVariant: VariantSchema.nullable().default(null),
});

// Génération du type TypeScript à partir du schéma
export type Product = z.infer<typeof ProductSchema>;
