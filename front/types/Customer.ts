// types/Customer.ts

import { z } from 'zod';

export const CustomerSchema = z.object({
  idCustomer: z.number(),
  token: z.string(),  
  shortName: z.string(),
  verified: z.boolean(),
});

// Génération du type TypeScript à partir du schéma
export type Customer = z.infer<typeof CustomerSchema>;
