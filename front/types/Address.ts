// types/Address.ts
import { z } from 'zod';

// Définition du schéma Zod
export const AddressSchema = z.object({
  firstName: z.string().nullable().default(null),
  lastName: z.string().nullable().default(null),
  phoneNumber: z.string().nullable().default(null),
  company: z.string().nullable().default(null),
  countryCode: z.string().nullable().default(null),
  provinceCode: z.string().nullable().default(null),
  provinceName: z.string().nullable().default(null),
  street: z.string().nullable().default(null),
  city: z.string().nullable().default(null),
  postcode: z.string().nullable().default(null),
});

// Génération du type TypeScript à partir du schéma
export type Address = z.infer<typeof AddressSchema>;
