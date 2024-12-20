// types/Variant.ts
import { z } from 'zod';
import { OptionSchema } from '~/types/Option';

export const VariantSchema = z.object({
  '@id': z.string().nullable().default(null),
  id: z.number(),
  position: z.number(),
  enabled: z.boolean(),
  code: z.string(),
  name: z.string().nullable().default(null),
  inStock: z.boolean(),
  weight: z.number().nullable().default(null),
  width: z.number().nullable().default(null),
  height: z.number().nullable().default(null),
  depth: z.number().nullable().default(null),
  price: z.number().nullable().default(null),
  originalPrice: z.number().nullable().default(null),
  lowestPriceBeforeDiscount: z.number().nullable().default(null),
  isDefault: z.boolean().default(false),
  options: z.array(OptionSchema).default([]),
});

// Génération du type TypeScript à partir du schéma
export type Variant = z.infer<typeof VariantSchema>;
