import { prisma } from "@/app/utils/connect";

import { NextRequest, NextResponse } from "next/server";
import { stringify } from "querystring";
import { v4 as uuidv4 } from "uuid";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// generating  idempotencyKey to ensure the payment made and update only one time
//  without mistakenly performing the same operation twice.
const idempotencyKey = uuidv4();
// console.log("generated idempotencyKey value", idempotencyKey);

export async function POST(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  const { orderId } = params;

  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  // Function to generate a unique idempotency key using uuid

  if (order) {
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: Number(order.price) * 100,

        currency: "usd",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
          enabled: true,
        },
      },
      {
        // Pass the idempotency key in the options
        idempotencyKey,
      }
    );
    // console.log("payment Intent", paymentIntent);

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: { intent_id: paymentIntent.id },
    });

    // console.log(updatedOrder);

    return new NextResponse(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
      }
    );
  } else {
    return new NextResponse(
      JSON.stringify({ message: "Order coudn't found!" }),
      {
        status: 404,
      }
    );
  }
}
