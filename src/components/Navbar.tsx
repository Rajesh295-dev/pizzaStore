import React from "react";
import Link from "next/link";
import Menu from "./Menu";

import CartIcon from "./CartIcon";
import Image from "next/image";
import UserLinks from "./UserLinks";
import UserProfileImg from "./UserprofileImg";

function Navbar() {
  const user = false;
  return (
    <div className="h-12 text-gray-800 p-4 flex items-center justify-between border-b-2 border-b-red-500 uppercase md:h-24 lg:px-20 xl:px-40">
      {/* left  links */}
      <div className="hidden md:flex gap-4 flex-1">
        <Link href="/">Homepage</Link>

        <Link href="/menu">Menu</Link>
        <Link href="/">Contact</Link>
      </div>

      {/* Store logo */}
      <div className="text-sm xlg:text-xl md:font-bold flex-1 md:text-center">
        <Link href="/">SlicesPizeria</Link>
      </div>

      {/* mobile menu */}
      <div className=" md:hidden">
        <Menu />
      </div>

      <div className=" hidden lg:flex md:absolute  top-3 r-2 lg:static  items-center gap-2 cursor-pointer  bg-orange-300 px-1 rounded-md">
        <Image src="/phone.png" alt="" width={20} height={20} />
        <span>(410) 304-6840 </span>
      </div>

      {/* right links */}
      <div className="hidden md:flex gap-4 items-center justify-end flex-1 lg:ml-9">
        {/* <div className=" md:absolute xlg:flex top-3 r-2 lg:static  items-center gap-2 cursor-pointer  bg-orange-300 px-1 rounded-md">
          <Image src="/phone.png" alt="" width={20} height={20} />
          <span>(410) 304-6840 </span>
        </div> */}
        <UserLinks />
        <CartIcon />
        <UserProfileImg />
      </div>
    </div>
  );
}

export default Navbar;
