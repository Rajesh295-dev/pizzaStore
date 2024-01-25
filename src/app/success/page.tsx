"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ConfettiExplosion from "react-confetti-explosion";
import React, { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const payment_intent = searchParams.get("payment_intent");
  const router = useRouter();

  // console.log("Search parameters:", searchParams.toString());

  useEffect(() => {
    //conver this payment_intent into string before api request
    const payment_intent_str = String(payment_intent);

    console.log("maile payekoo", payment_intent_str);

    const makeRequest = async () => {
      try {
        await fetch(`http://localhost:3000/api/confirm/${payment_intent_str}`, {
          method: "PUT",
        });
        router.push("/orders");

        // setTimeout(() => {
        //   router.push("/orders");
        // }, 1000);
      } catch (err) {
        console.log(err);
      }
    };
    makeRequest();
  }, [payment_intent, router]);
  return (
    <>
      <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-center text-2xl text-green-700">
        <p className="max-w-[600px]">
          Payment successful. You are being redirected to the orders page.
          Please do not close the page.
        </p>
        <ConfettiExplosion className="absolute m-auto" />
      </div>
    </>
  );
};

export default SuccessPage;
