import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  const body = await req.json();
  //console.log("🚀 ~ file: route.ts:10 ~ POST ~ body:", body)

  const { firstName, lastName, email, phone, salary, onBoarding, IBAN, address, assigned_to } = body;
 

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
        firstName: firstName, lastName, email, phone, salary, onBoarding, IBAN, address
      },
    });


    return NextResponse.json({ newBoard }, { status: 200 });
  } catch (error) {
    console.log("[NEW_BOARD_POST]", error);
    return new NextResponse("Initial error", { status: 500 });
  }

  // return new NextResponse("Initial error");
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
      assigned_account,
      firstName,
      lastName,
      email,
      position,
      phone,
      salary,
      onBoarding,
      IBAN,
      taxid,
      address,
      insurance

    } = body;

    //console.log(assigned_account, "assigned_account");

    const newContact = await prismadb.employee.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
        position,
        phone,
        salary,
        onBoarding,
        IBAN,
        taxid,
        address,
        insurance
      },
    });



    return NextResponse.json({ newContact }, { status: 200 });
  } catch (error) {
    console.log("UPDATE_EMPLOYEE_PUT]", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}