import { prisma } from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// fectching categories
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany();
    return new NextResponse(JSON.stringify(categories), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// adding products
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const category = await prisma.category.create({
      data: body,
    });
    return new NextResponse(JSON.stringify(category), { status: 201 });
  } catch (err) {
    console.log("yooooo", err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
