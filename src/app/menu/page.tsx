//import { menu } from "@/data";
import { MenuType } from "@/types/types";
import Link from "next/link";
import React from "react";

const getData = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("failed");
  }
  return res.json();
};

const MenuPage = async () => {
  const menu: MenuType = await getData();
  console.log(menu);
  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center overflow-auto">
      {menu.map((category) => (
        <Link
          href={`/menu/${category.slug}`}
          key={category.id}
          className="w-full h-1/3 bg-cover p-8 md:h-1/2"
          style={{ backgroundImage: `url(${category.img})` }}
        >
          <div className={`text-${category.color} w-1/2`}>
            <h1 className="uppercase font-bold text-3xl">{category.title}</h1>
            <p className="hidden md:flex text-sm my-8">{category.desc}</p>

            <button
              className={`hidden 2xl:block bg-${category.color} 
               py-2 px-4 rounded-md text-${
                 category.color === "black" ? "white" : "red-500"
               }`}
            >
              Explore
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPage;
