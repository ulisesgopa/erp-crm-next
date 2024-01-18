import { prismadb } from "@/lib/prisma";

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
  return data;
};