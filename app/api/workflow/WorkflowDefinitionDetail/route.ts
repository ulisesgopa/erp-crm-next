import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  try {
    const definitions = await prismadb.definitions.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        Runtimes: {
          select: {
            id: true,
            workflowStatus: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
    })

    return NextResponse.json(definitions);
  } catch (error) {
    console.log("[DEFINITIONS_DETAIL_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
