import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="h-12 md:h-24 p-4 lg:px-20 xl:px-40 text-gray-800 flex items-center justify-between">
      <Link href="/" className="font-bold text-xl">
        SlicesPizeria
      </Link>
      <p>© All RIGHTS RESERVED</p>
    </div>
  );
}

export default Footer;
