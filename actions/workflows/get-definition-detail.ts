import { prismadb } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from 'zod';

const ResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  definitionStatus: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  runtimes: z.array(
    z.object({
      id: z.string(),
      workflowStatus: z.enum(['pending', 'completed']),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
  ),
});

export type ResponseSchemaType = z.infer<typeof ResponseSchema>;

export const getDefinitionDetail = async (definitionId: string) => {
  const data = await prismadb.definitions.findUnique({
    where: {
      id: definitionId,
    },
    select: {
        id: true,
        name: true,
        description: true,
        definitionStatus: true,
        createdAt: true,
        updatedAt: true,
        runtimes: {
          select: {
            id: true,
            workflowStatus: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },    
  });
  return ResponseSchema.parse(data);
};