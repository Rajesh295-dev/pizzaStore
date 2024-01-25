// import React from "react";
"client side";
import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
// import CountDown from "./CountDown";
const CountDown = dynamic(() => import("./CountDown"), {
  ssr: false,
});
import Link from "next/link";

function Offer() {
  return (
    <div className=" bg-black h-screen flex flex-col md:flex-row md:justify-between md:bg-[url('/offerBg.png')] md:h-[70vh]">
      {/* text container */}
      <div className=" flex-1 flex flex-col items-center justify-center text-center gap-8  p-6 ">
        <div>
          <h1 className=" text-white text-5xl font-bold uppercase xl:text-6xl 2xl:text-3xl">
            {" "}
            Delicious Burger & French Fry
          </h1>
          <p className=" text-white xl:text-xl">
            {" "}
            Savor the perfect pairing of succulent burgers and golden fries – a
            delightful duo that transforms any meal into a taste sensation.
          </p>
        </div>
        <div>
          {" "}
          <CountDown />{" "}
        </div>

        <Link href={"/menu"} className=" bg-red-500 text-white p-2 rounded-md">
          Order Now
        </Link>
      </div>
      {/* image */}
      <div className="flex-1 w-full relative md:h-full">
        <Image src="/newOffer.png" alt="" fill className="object-contain" />
      </div>
    </div>
  );
}

export default Offer;
