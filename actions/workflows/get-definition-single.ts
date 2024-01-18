import { prismadb } from "@/lib/prisma";

export const getDefinitionSingle = async (definitionId: string) => {
  const data = await prismadb.definitions.findUnique({
    where: {
      id: definitionId,
    },
  });
  return data;
};