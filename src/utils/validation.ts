import { z } from "zod";

export const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const partnerNameSchema = z.string().trim().min(1).max(80);

export const preferenceSchema = z.object({
  title: z.string().trim().min(1),
  value: z.string().trim().min(1),
  category: z.string().trim().min(1)
});
