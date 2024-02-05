import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  const userId = session?.user.id;

  const {
    name, 
    description, 
    definitionStatus,
    userWfDefinitionId
  } = body;
  
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!name) {
    return new NextResponse("Missing definition name", { status: 400 });
  }

  if (!description) {
    return new NextResponse("Missing definition description", { status: 400 });
  }

  try {

    const newDefinition = await prismadb.definitions.create({
      data: {
        name,
        description,
        definitionStatus,
        userWfDefinitionId: userId as string
      },
    });

    return NextResponse.json({ newDefinition }, { status: 200 });
  } catch (error) {
    console.log("[NEW_DEFINITION_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }

}

//Update route
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }
  try {
    const body = await req.json();
    const userId = session.user.id;

    if (!body) {
      return new NextResponse("No form data", { status: 400 });
    }

    const {
      id,
      name,
      description,
      definitionStatus,
      userWfDefinitionId
    } = body;

    const updateDefinition = await prismadb.definitions.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        definitionStatus,
        userWfDefinitionId: userId as string
      },
    });

    return NextResponse.json({ updateDefinition }, { status: 200 });
  } catch (error) {
    console.log("UPDATE_DEFINITION_PUT]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}