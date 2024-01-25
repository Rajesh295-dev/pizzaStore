import { getAuthSession } from "@/app/utils/auth";
import { prisma } from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// fectching orders
export const GET = async (req: NextRequest) => {
  const session = await getAuthSession();
  if (session) {
    try {
      if (session.user.isAdmin) {
        const orders = await prisma.order.findMany();
        return new NextResponse(JSON.stringify(orders), { status: 200 });
      }
      const orders = await prisma.order.findMany({
        where: {
          userEmail: session.user.email!,
        },
      });
      
      return new NextResponse(JSON.stringify(orders), { status: 200 });
    } catch (err) {
      
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "you're not authenticated!" }),
      { status: 401 }
    );
  }
};

//create order

export const POST = async (req: NextRequest) => {
  const session = await getAuthSession();
  if (session) {
    try {
      const body = await req.json();
      if (session.user) {
        const order = await prisma.order.create({ data: body });
        return new NextResponse(JSON.stringify(order), { status: 201 });
      }
    } catch (err) {
      
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  } else {
    return new NextResponse(
      JSON.stringify({ message: "you're not authenticated!" }),
      { status: 401 }
    );
  }
};
