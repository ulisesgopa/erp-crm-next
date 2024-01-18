import { prismadb } from "@/lib/prisma";

export const getRuntimeDetail = async (runtimeId: string) => {
  const data = await prismadb.runtimes.findUnique({
    where: {
        id: runtimeId,
      },
      include: {
        definitions: {
          select: {
            id: true,
            name: true,
            definitionStatus: true,
            description: true,
            createdAt: true,
            updatedAt: true
          }
        },
        runtimeLogs: {
          select: {
            timestamp: true,
            taskName: true,
            log: true,
            severity: true
          },
        },  
        runtimeTasks: {
          select: {
            id: true,
            name: true,
            next: true,
            previous: true,
            params: true,
            exec: true,
            taskType: true,
            taskStatus: true
          }
        }
      }
    });
  return data;
};