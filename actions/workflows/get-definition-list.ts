import { prismadb } from "@/lib/prisma";
import { z } from 'zod';

const ResponseSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    definitionStatus: z.enum(['active', 'inactive']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
);

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const getDefinitionList = async () => {
  const data = await prismadb.definitions.findMany({});
  return ResponseSchema.parse(data);
};
