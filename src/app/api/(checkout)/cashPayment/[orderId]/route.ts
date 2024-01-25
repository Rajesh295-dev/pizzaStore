import { prisma } from "@/app/utils/connect";
import { NextRequest, NextResponse } from "next/server";

type Inputs = {
  customer: string;
  phone: string;
  address: string;
};

export async function POST(request: NextRequest) {
  try {
    console.log(
      "Received request:",
      request.body ? JSON.stringify(request.body) : null
    );
    // console.log("Request headers:", request.headers);

    const body = await request.text();
    const { cashInputs, method } = JSON.parse(body);

    if (!cashInputs || !method) {
      console.error("Invalid request parameters:", cashInputs, method);
      return new NextResponse(
        JSON.stringify({ message: "Invalid request parameters" }),
        {
          status: 400,
        }
      );
    }

    const { customer, address, phone, newOrderId } = cashInputs;

    if (!newOrderId || !customer || !phone) {
      console.error("Incomplete cashInputs:", newOrderId, customer, phone);
      return new NextResponse(
        JSON.stringify({ message: "Incomplete cashInputs" }),
        {
          status: 400,
        }
      );
    }

    // Use these values in your code...
    // console.log("Payment endpoint received value", customer, phone, newOrderId);

    // Extract the initial letter from the full name
    const initials = customer
      .split(" ")
      .map((word: string) => word.charAt(0))
      .join("");

    // Remove non-numeric characters from the phone number
    const numericPhone = phone.replace(/[^\d]/g, "");

    // Create the customIntentId by combining initials and phone number
    const currentDate = new Date();
    const timestamp = currentDate.getTime(); // Using timestamp, adjust as needed
    console.log("yo ho timeStamp", timestamp);
    // Create the customIntentId by combining initials, phone number, and timestamp
    const customIntentId = `${initials}${numericPhone}${timestamp}`;
    console.log("Custom ID:", customIntentId);

    //Check if the order exists
    const existingOrder = await prisma.order.findUnique({
      where: {
        id: newOrderId,
      },
    });

    if (existingOrder) {
      // Update the order with the customIntentId
      const updatedOrder = await prisma.order.update({
        where: {
          id: newOrderId,
        },
        data: { intent_id: customIntentId },
      });

      // console.log("Order has been updated!", updatedOrder);

      // Respond with a success message
      return new NextResponse(
        JSON.stringify({
          message: "Order has been updated!",
          intent_id: customIntentId,
        }),
        { status: 200 }
      );
    } else {
      console.error("Order not found:", newOrderId);
      // Respond with an error message
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    // Respond with a generic error message
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    );
  }
}
