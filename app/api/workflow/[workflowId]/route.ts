import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prismadb } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

//Contact delete route
export async function DELETE(
  req: Request,
  { params }: { params: { workflowId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!params.workflowId) {
    return new NextResponse("Workflow ID is required", { status: 400 });
  }

  try {
    await prismadb.definitions.delete({
      where: {
        id: params.workflowId,
      },
    });

    return NextResponse.json({ message: "Workflow Deleted" }, { status: 200 });
  } catch (error) {
    console.log("[WORKFLOW_DELETE]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
