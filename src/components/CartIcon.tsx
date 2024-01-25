"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/utils/store";
import { useSession } from "next-auth/react";

function CartIcon() {
  const { data: session, status } = useSession();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  const { totalItems } = useCartStore();

  return (
    //detemine if its admin or customer
    // <Link href={session?.user.isAdmin ? "/addCategory" : "/cart"}>
    <Link href={session?.user ? "/cart" : ""}>
      <div className=" flex items-center gap-4">
        <div className="relative w-8 h-8 md:w-5 md:h-5">
          <Image
            src="/cart.png "
            alt=""
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>

        {session?.user.isAdmin ? (
          <Link
            href={"/addCategory"}
            className="p-1 bg-red-500 text-white rounded-md"
          >
            {" "}
            AdminBoard
          </Link>
        ) : (
          <span>Cart ({totalItems})</span>
        )}
      </div>
    </Link>
  );
}

export default CartIcon;
