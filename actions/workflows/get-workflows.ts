import { prismadb } from "@/lib/prisma";

export const getWorkflows = async () => {
  const data = await prismadb.definitions.findMany({});
  return data;
};
