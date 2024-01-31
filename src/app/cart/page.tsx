"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useCartStore } from "../utils/store";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Decimal from "decimal.js";
import Delivery from "@/components/Delivery";
import CashPay from "@/components/CashPay";

type paymentMethod = "card" | "cash";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart, updateQuantity } =
    useCartStore();

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const [orderId, setOrderId] = useState<string>("");
  const NEXTAUTH_URL = "https://slicespizzeria.vercel.app";

  const handleCheckout = async (paymentMethod: paymentMethod) => {
    if (!session) {
      router.push("/login");
    } else {
      try {
        const method = paymentMethod === "card" ? "card" : "cash";
        const res = await fetch(`${NEXTAUTH_URL}/api/orders`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            price: totalPrice,
            products,
            status: "Not paid!",
            userEmail: session.user.email,
            method,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          // console.log("new order id", data.id);

          if (data.method === "card") {
            router.push(`pay/${data.id}`);
          } else {
            setOrderId(data.id);
            setCash(true);
          }
        } else {
          // Handle non-successful response
          console.error("Error:", res.statusText);
        }
      } catch (error) {
        // Handle fetch or JSON parsing errors
        console.error("Error during fetch or JSON parsing:", error);
      }

      //   const data = await res.json();

      //   console.log("new order id", data.id);

      //   if (data.method === "card") {
      //     router.push(`pay/${data.id}`);
      //   } else {
      //     setOrderId(data.id);
      //     setCash(true);
      //   }
      //   // router.push(`pay/${data.id}`);
      // } catch (err) {
      //   console.log(err);
      // }
    }
  };

  const [open, setOpen] = useState(false);
  const [cash, setCash] = useState(false);
  const [receivingPreference, setReceivingPreference] = useState("");
  // const [instructions, setInstructions] = useState("");

  const handleReceivingPreferenceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setReceivingPreference(event.target.value);
  };

  const [tipPercentage, setTipPercentage] = useState("0");

  const handleTipPercentageChange = (value: string) => {
    setTipPercentage(value);
  };

  // console.log(" inTipAmount", tipPercentage);

  const [tipAddAmountChange, setTipAddAmountChange] = useState(0);
  const handleTipAddAmountChange = (value: number) => {
    setTipAddAmountChange(value);
    // console.log("Calculated Tip Amount in CartPage:", value);
  };
  // console.log("TipAddAmountChange", tipAddAmountChange);

  const [calculatedTipAmount, setCalculatedTipAmount] = useState(0);

  // Callback to handle the calculated tip amount
  const handleCalculatedTipAmountChange = (value: number) => {
    setCalculatedTipAmount(value);
    // console.log("Calculated Tip Amount in CartPage:", value);
  };
  // console.log("calculatedTipAmount", calculatedTipAmount);

  // Calculate service cost based on subtotal
  const serviceCost = 0.06 * totalPrice;

  // Set delivery cost based on the selected receiving preference
  let deliveryCost = 0;
  if (receivingPreference === "delivery") {
    deliveryCost = 2.5;
  }

  const formattedTipAmount = calculatedTipAmount.toFixed(2);
  const totalCost = new Decimal(totalPrice)
    .plus(new Decimal(serviceCost))
    .plus(new Decimal(formattedTipAmount))
    .plus(new Decimal(deliveryCost));

  const totalAmount = totalCost.toFixed(2);

  return (
    <div className=" h-[calc(100vh - 6rem)] md:h-[calc(100vh - 9rem)] flex flex-col   2xl:flex-row verflow-scroll ">
      {/* products container */}
      <div className=" h-1/2 p-4  flex flex-col md:mr-50   lg:h-full  2xl:w-1/2 lg:px-4 xlg:px-40 2xl:text-xl 2xl:gap-6    ">
        {products.map((item) => (
          <div
            className="  flex flex-row  items-center    2lg:bg-purple-500"
            key={item.id}
          >
            {" "}
            {item.img && (
              <Image
                src={item.img}
                alt=""
                width={150}
                height={150}
                className="md:mr-7 "
              />
            )}
            <div className=" bg-fuchsia-50 flex flex-col gap-3 m-5 md:flex-row items-center justify-between md:px-10 lg:px-20  ">
              <div className=" flex flex-col gap-3 md:flex-row items-center justify-between md:mr-9">
                <span className="  md:ml-5 lg:nr-5">{item.optionTitle}</span>
                <h1 className=" uppercase  text-sm lg:text-xl font-bold items-center justify-between">
                  {item.title}
                </h1>
              </div>

              <div className="flex h-1/4 gap-2  ml-5 items-center overflow-auto mr-5 rounded-md bg-green-500 ">
                {" "}
                <button
                  className="cursor-pointer md:ml-2 text-white p-2 rounded-md "
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity} Items</span>
                <button
                  className="cursor-pointer md:ml-2 text-white p-2 rounded-md"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <h2 className="font-bold  ">${item.price}</h2>
              <button
                className="cursor-pointer md:ml-5  text-white bg-red-500 p-2 rounded-md  "
                onClick={() => removeFromCart(item)}
              >
                <Image src="/delete.png" alt="" width={18} height={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* payment container */}
      {/* md:bg-slate-700 */}
      <div className=" h-1/2 p-4 m-1  bg-fuchsia-50 flex flex-col gap-4 justify-center  lg:h-full  2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6 ">
        <div className=" flex flex-col justify-around  ">
          <h2 className="text-2xl font-bold">
            Select Food Receiving Preference
          </h2>
          {/* Cooking Preference Options */}
          <div className="flex flex-col p-4 gap-3">
            <label>
              <input
                type="radio"
                name="normal"
                value="dine-in"
                checked={receivingPreference === "dine-in"}
                onChange={handleReceivingPreferenceChange}
              />
              <span className="ml-2"> Dine-In</span>
            </label>

            <label>
              <input
                type="radio"
                name="pickup"
                value="pickup"
                checked={receivingPreference === "pickup"}
                onChange={handleReceivingPreferenceChange}
              />
              <span className="ml-2">Pick UP</span>
            </label>

            <label>
              <input
                type="radio"
                name="delivery"
                value="delivery"
                checked={receivingPreference === "delivery"}
                onChange={handleReceivingPreferenceChange}
              />
              <span className="ml-2">Delivery</span>
            </label>
          </div>

          {/* Instructions Input Field */}

          {receivingPreference === "delivery" && (
            <Delivery
              totalPrice={totalPrice} // Pass the total amount as a prop
              tipPercentage={tipPercentage} // Pass the total amount as a prop
              onTipAddAmountChange={handleTipAddAmountChange}
              onTipPercentageChange={handleTipPercentageChange}
              onCalculatedTipAmountChange={handleCalculatedTipAmountChange} // Pass the callback
            />
          )}
        </div>

        <div className=" flex justify-between">
          <span className="">Subtotal ({totalItems} items) </span>
          <span className="">${totalPrice}</span>
        </div>

        <div className=" flex justify-between">
          <span className="">Service Cost </span>
          <span className="">${totalAmount}</span>
          {/* <span className="">$0.00</span> */}
        </div>

        <div className=" flex justify-between">
          <span className="">Delivery Cost </span>
          <span className=" text-green-500">${deliveryCost.toFixed(2)}</span>
          {/* <span className=" text-green-500">FREE</span> */}
        </div>

        {(tipPercentage === "custom" ||
          tipPercentage === "5%" ||
          tipPercentage === "10%" ||
          tipPercentage === "15%" ||
          tipPercentage === "20%") && (
          <div className=" flex justify-between">
            <span className="">Tips </span>
            <span className=" text-green-500">
              ${calculatedTipAmount.toFixed(2)}
            </span>
            <span className=" text-green-500">${formattedTipAmount}</span>
            {/* <span className=" text-green-500">FREE</span> */}
          </div>
        )}

        <hr className=" my-2" />
        <div className=" flex justify-between">
          <span className="">Total(INC. TAX) </span>
          <span className=" font-bold">${totalCost.toFixed(2)}</span>
          {/* <span className=" font-bold">${totalPrice}</span> */}
        </div>

        <div className="">
          {open ? (
            <div className="gap-3 flex flex-col ">
              <button
                className=" bg-blue-500 text-white p-3 rounded-md w-1/3 self-end"
                onClick={() => handleCheckout("card")}
              >
                CARD 💳
              </button>

              <button
                className="bg-green-600 text-white p-3 rounded-md w-1/3 self-end "
                onClick={() => handleCheckout("cash")}
                // onClick={() => setCash(true)}
              >
                CASH 💵
              </button>
            </div>
          ) : (
            <button
              onClick={() => setOpen(true)}
              className=" bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
            >
              CHECKOUT NOW!
            </button>
          )}
        </div>
      </div>
      {cash && (
        <CashPay
          totalAmount={totalAmount}
          setCash={setCash}
          orderId={orderId} // Pass orderId as a prop
        />
      )}
    </div>
  );
};

export default CartPage;
