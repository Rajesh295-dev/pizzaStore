import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PizzaItemProps = {
  item: ProductType;
};

const PizzaItem: React.FC<PizzaItemProps> = ({ item }) => (
  <Link
    //it render tailwind style based on the items
    className={
      item.title === "Hand Tossed Pizza"
        ? "w-full h-[50vh] border-2 border-red-500 p-3 md:m-3 flex flex-col justify-between group even:bg-fuchsia-50"
        : "gap-5 w-full h-[70vh] border-t-2 border-r-2 border-b-2 border-red-500 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group even:bg-fuchsia-50"
    }
    href={`/product/${item.id} `}
  >
    {/* image container */}
    {item.img && (
      <div className="relative h-[80%]">
        <Image src={item.img} alt="" fill className="object-contain" />
      </div>
    )}

    <div className="flex items-center justify-between font-bold">
      {item.title === "Hand Tossed Pizza" ? (
        <>
          <h2 className="text-xl uppercase p-2 text-red-500">
            Customize your pizza with your choice of toppings
          </h2>
          <button className="uppercase mt-5 text-lg md:text-xl bg-green-500 text-white p-2 rounded-md">
            Lets make it!
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl uppercase p-2">{item.title}</h1>
          <h2 className="group-hover:hidden text-xl">${item.price}</h2>
          <button className="hidden group-hover:block uppercase bg-red-500 text-white p-2 rounded-md">
            Add to Cart
          </button>
        </>
      )}
    </div>
  </Link>
);

export default PizzaItem;
