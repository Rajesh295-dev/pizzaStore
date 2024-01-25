//import { pizzas } from "@/data";

import PizzaItem from "@/components/PizzaItem";
import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const getData = async (category: string) => {
  const res = await fetch(
    `http://localhost:3000/api/products?cat=${category}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("failed");
  }
  return res.json();
};

type Props = {
  params: { category: string };
};

const CategoryPage = async ({ params }: Props) => {
  const products: ProductType[] = await getData(params.category);

  return (
    <>
      {/* this container use to render only hand tossed pizza */}
      <div className="  flex items-center justify-center w-full">
        {products.some((product) => product.title === "Hand Tossed Pizza") && (
          <div>
            <h3 className="   text-xl font-bold p-2 flex items-center justify-center">
              Try Our Popular Hand Tossed Pizza
            </h3>
            {products
              .filter((item) => item.title === "Hand Tossed Pizza")
              .map((item) => (
                <PizzaItem key={item.id} item={item} />
              ))}
          </div>
        )}
      </div>

      {/* this condition use to display the heading title for gourmet pizza if its avilable */}
      <div>
        {products.some(
          (product) =>
            product.title !== "Hand Tossed Pizza" && product.catSlug === "pizza"
        ) && (
          <h3 className=" text-xl font-bold p-2 m-3 flex items-center justify-center">
            Try Our Popular Gourmet Pizza
          </h3>
        )}
      </div>
      {/*  this condition render all the items except hand tossed pizza */}
      <div className=" flex flex-wrap text-red-500">
        {products
          .filter((item) => item.title !== "Hand Tossed Pizza")
          .map((item) => (
            <PizzaItem key={item.id} item={item} />
          ))}
      </div>
    </>
  );
};

export default CategoryPage;
