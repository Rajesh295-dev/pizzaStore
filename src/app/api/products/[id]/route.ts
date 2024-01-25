import { getAuthSession } from "@/app/utils/auth";
import { prisma } from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//fetch single product
export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

//delete single product
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const session = await getAuthSession();
  if (session?.user.isAdmin) {
    try {
      const product = await prisma.product.delete({
        where: {
          id: id,
        },
      });

      return new NextResponse(JSON.stringify("product has been deleted"), {
        status: 200,
      });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  }
  return new NextResponse(JSON.stringify({ message: "You're not a Admin!" }), {
    status: 403,
  });
};
