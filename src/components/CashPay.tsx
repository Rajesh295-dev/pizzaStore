"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Inputs = {
  customer: string;
  address: string;
  phone: string;
  newOrderId: string;
};

interface CashPayProps {
  setCash: React.Dispatch<React.SetStateAction<boolean>>;
  totalAmount: string;
  orderId: string;
}

const CashPay: React.FC<CashPayProps> = ({
  // Receive orderId as a prop
  setCash,
  totalAmount,
  orderId,
}) => {
  const [inputs, setInputs] = useState<Inputs>({
    customer: "",
    address: "",
    phone: "",
    newOrderId: "",
  });
  const router = useRouter();
  const handleCashPay = async () => {
    try {
      const updatedInputs = {
        customer: inputs.customer,
        address: inputs.address,
        phone: inputs.phone,
        newOrderId: orderId,
      };

      // console.log("updated inputs", updatedInputs);
      setInputs(updatedInputs);

      const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/cashPayment/${updatedInputs.newOrderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cashInputs: updatedInputs,
            method: "cash",
          }),
        }
      );

      if (res.ok) {
        const updatedOrder = await res.json();
        // console.log("Entire API Response:", updatedOrder);
        const updatedIntentId = updatedOrder.intent_id;
        router.push(`/success?payment_intent=${updatedIntentId}`);
      } else {
        console.error("Failed to update order:", res.statusText);
      }

      // Continue with the rest of your logic
    } catch (error) {
      console.error("Error updating order:", error);
    }
    setCash(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));

    const updatedInputs = {
      ...inputs,
      [name]: value,
    };
  };

  return (
    <div className="w-full h-full absolute  top-0 bottom-0 flex items-center justify-center bg-gray-400 bg-opacity-60">
      <div className="  md:w-1/2 bg-white rounded-sm px-8 py-5   md:m-2 flex flex-col items-center justify-center">
        <button
          className="red-300  text-2xl  right-2 self-end"
          onClick={() => setCash(false)}
        >
          {" "}
          <span className="  cursor-pointer ">X</span>
        </button>

        <h1 className="text-2xl">Total Amount ${totalAmount}</h1>

        <div className="flex flex-col w-full mb-4 ">
          <label className="mb-3">Name Surname</label>
          <input
            name="customer"
            value={inputs.customer}
            placeholder="Michael Josep"
            type="text"
            // className="h-10 ring-1 ring-red-200 p-4 rounded-sm"
            className="h-10 outline-none p-4 rounded-sm border border-red-200"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col w-full mb-4">
          <label className="mb-3">Phone Number</label>
          <input
            name="phone"
            value={inputs.phone}
            type="text"
            maxLength={14}
            pattern="[0-9]*"
            placeholder="+1 234 567 89"
            // className="h-10 ring-1 ring-red-200 p-4 rounded-sm"
            className="h-10 outline-none border border-red-200 p-4 rounded-sm "
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col w-full mb-4">
          <label className="mb-3">Address</label>
          <textarea
            name="address"
            value={inputs.address}
            rows={2}
            placeholder="549 Baltimore Pike"
            // type="text"
            className=" outline-none border border-red-200 p-4 rounded-sm placeholder:text-red-200 "
            onChange={handleChange}
          />
        </div>
        <button
          className=" bg-red-500 text-white p-3 rounded-md  cursor-pointer w-1/2 self-end"
          onClick={handleCashPay}
        >
          Order
        </button>
      </div>
    </div>
  );
};

export default CashPay;
