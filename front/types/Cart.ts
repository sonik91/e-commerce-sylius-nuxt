// types/Cart.ts
import { z } from 'zod';
import { AddressSchema } from '~/types/Address';
import { ImageSchema } from '~/types/Image';
import type { Image } from '~/types/Image';

const DefaultImage = [{} as Image];

export const CartSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      quantity: z.number(),
      productName: z.string(),
      variantName: z.string().nullable().default(null),
      unitPrice: z.number(),
      originalUnitPrice: z.number(),
      discountedUnitPrice: z.number(),
      total: z.number(),
      subtotal: z.number(),
      variant: z.string(),
      images: z.array(ImageSchema).default(DefaultImage),
    })
  ).default([]),
  customer: z.object({email: z.string().email()}).nullable().default(null),
  tokenValue: z.string().nullable().default(null),
  billingAddress: AddressSchema.nullable().default(null),
  shippingAddress: AddressSchema.nullable().default(null),
  state: z.string().default(''),
  currencyCode: z.string().default('EUR'),
  itemsSubtotal: z.number().default(0),
  itemsTotal: z.number().default(0),
  localeCode: z.string().default('fr_FR'),
  number: z.string().nullable().default(null),
  orderPromotionTotal: z.number().default(0),
  paymentState: z.string().default(''),
  payments: z.array(
    z.object({
      '@id': z.string(),
      '@type': z.string(),
      id: z.number(),
      method: z.string(),
    })
  ).default([]),
  shipments: z.array(
    z.object({
      '@id': z.string(),
      '@type': z.string(),
      id: z.number(),
      method: z.string(),
    })
  ).default([]),
  shippingPromotionTotal: z.number().default(0),
  shippingState: z.string().default(''),
  shippingTaxTotal: z.number().default(0),
  shippingTotal: z.number().default(0),
  taxExcludedTotal: z.number().default(0),
  taxIncludedTotal: z.number().default(0),
  taxTotal: z.number().default(0),
  total: z.number().default(0),
});

// Génération du type TypeScript à partir du schéma
export type Cart = z.infer<typeof CartSchema>;
