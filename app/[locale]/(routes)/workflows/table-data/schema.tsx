import { z } from "zod";

export const definitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  definitionStatus: z.enum(['active', 'inactive']),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Definition = z.infer<typeof definitionSchema>;