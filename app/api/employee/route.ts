import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  console.log("🚀 ~ file: route.ts:10 ~ POST ~ body:", body)

  const { firstName, lastName, email, phone, salary, onBoarding, IBAN , address , assigned_to } = body;

  const salarynew = +salary

  if (!session) {
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  if (!firstName) {
    return new NextResponse("Missing first name", { status: 400 });
  }

  if (!email) {
    return new NextResponse("Missing  email", { status: 400 });
  }

  try {
    

    const newBoard = await prismadb.employee.create({
      data: {
        userID: assigned_to,
        firstName:firstName, lastName, email, phone, salary:salarynew, onBoarding, IBAN , address
      },
    });

  
    return NextResponse.json({ newBoard }, { status: 200 });
  } catch (error) {
    console.log("[NEW_BOARD_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }

 // return new NextResponse("Initial error");
}
