import { prisma } from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// fectching users
export const GET = async () => {
  try {
    const users = await prisma.user.findMany();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// adding user
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: body,
    });
    return new NextResponse(JSON.stringify(user), { status: 201 });
  } catch (err) {
    console.log("yooooo", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
