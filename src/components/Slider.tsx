"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const data = [
  {
    id: 1,

    title: "Slices into Happiness: Where Every Bite is a Delight!",
    image: "/firstSlide.png",
  },

  {
    id: 2,
    title: "always fresh 👨🏻‍🍳 always healthy 🥬 ",
    image: "/slide2.png",
  },

  {
    id: 3,
    title: "the best pizza to share with your family",
    image: "/slide3.png",
  },
];

function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev == data.length - 1 ? 0 : prev + 1)),
      6000
    );
    return () => clearInterval(interval);
  }, []);
  return (
    <div className=" flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row">
      {/* text container */}

      <div className="flex-1 flex items-center justify-center flex-col gap-8 text-red-500 font-bold bg-gray-800 ">
        <h1 className="text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
          {data[currentSlide].title}
        </h1>
        <Link href={"/menu"}>
          <button className="bg-red-500 text-white py-4 px-8 mb-10 ">
            Order now
          </button>
        </Link>
      </div>
      {/* image container */}
      <div className="w-full flex-1 relative ">
        <Image
          src={data[currentSlide].image}
          alt=""
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}

export default Slider;
