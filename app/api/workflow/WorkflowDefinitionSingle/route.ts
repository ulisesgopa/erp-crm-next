import { authOptions } from '@/lib/auth';
import { prismadb } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { workflowId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.workflowId) {
    return new NextResponse("Definition ID is required", { status: 400 });
  }

  try {
    const definitions = await prismadb.definitions.findUnique({
      where: {
        id: params.workflowId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        definitionStatus: true,
        createdAt: true,
        updatedAt: true,
        uiObject: true
      },
    })

    return NextResponse.json(definitions);
  } catch (error) {
    console.log("[DEFINITIONS_SINGLE_GET]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
