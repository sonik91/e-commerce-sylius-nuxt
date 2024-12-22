// types/Customer.ts

import { z } from 'zod';

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

export const CustomerSchema = z.object({
  idCustomer: z.number().nullable().default(null),
  token: z.string().nullable().default(null),
  user: z.object({
    // Regex pour valider le format "YYYY-MM-DD HH:mm:ss"
    birthday: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,{ message: "Invalid date format. Expected format: YYYY-MM-DD HH:mm:ss" }).nullable().default(null),
    defaultAddress: z.number().nullable().default(null),
    email: z.string().email(),
    phoneNumber: z.string().regex(phoneRegex, 'Invalid phone number!').nullable().default(null),
    firstName: z.string().nullable().default(null),
    lastName: z.string().nullable().default(null),
    fullName: z.string().default(''),
    gender: z.string().nullable().default(null),
    subscribedToNewsletter: z.boolean().default(false)
  }).nullable().default(null)
  
});

// Génération du type TypeScript à partir du schéma
export type Customer = z.infer<typeof CustomerSchema>;
