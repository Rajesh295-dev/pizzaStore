import React from "react";
import Image from "next/image";
import { ProductType } from "@/types/types";
import Link from "next/link";
//import { featuredProducts } from "@/data";

const getData = async () => {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("failed");
  }
  return res.json();
};

const Featured = async () => {
  const featuredProducts: ProductType[] = await getData();
  return (
    <div className=" w-screen overflow-x-scroll text-red-500">
      {/* wrapper */}
      <div className=" w-max flex">
        {/* single items */}
        {featuredProducts.map((item) => (
          <div
            key={item.id}
            className="w-screen h-[60vh] flex flex-col items-center justify-around p-4  hover:bg-gray-800 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:h-[90vh]"
          >
            {/* image container */}
            {item.img && (
              <div className=" relative flex-1 w-full hover:rotate-[60deg] transition-all duration-500">
                <Image src={item.img} alt="" fill className="object-contain" />
              </div>
            )}
            {/* text container */}
            <div className=" flex-1 flex flex-col gap-4 items-center justify-center text-center">
              {item.title === "Hand Tossed Pizza" ? (
                <>
                  <h2 className="text-2xl uppercase p-2">
                    Customize your pizza with your choice of toppings
                  </h2>
                  <Link
                    href={`/product/${item.id} `}
                    className="uppercase bg-red-500 text-white p-2 rounded-md"
                  >
                    Lets make it!
                  </Link>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">
                    {item.title}
                  </h1>
                  {item.desc && <p className="p4 2xl:p-8">{item.desc}</p>}
                  <span className="text-xl font-bold ">${item.price}</span>
                  <Link
                    href={`/product/${item.id} `}
                    className=" bg-red-500 text-white p-2 rounded-md"
                  >
                    Add to Cart
                  </Link>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
