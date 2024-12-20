// types/Option.ts
import { z } from 'zod';

export const OptionSchema = z.object({
  code: z.string(),
  name: z.string(),
  value: z.any().default([]),
});

// Génération du type TypeScript à partir du schéma
export type Option = z.infer<typeof OptionSchema>;
