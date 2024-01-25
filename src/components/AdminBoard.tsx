"use client";
import React from "react";
import Link from "next/link";

import { usePathname } from "next/navigation";

const AdminBoard = () => {
  const pathname = usePathname();

  const linkClasses = (href: string) =>
    `rounded-full py-2 px-4 ${
      pathname === href ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
    }`;

  return (
    <div className="flex gap-2 tabs">
      <Link className={linkClasses("/addCategory")} href="/addCategory">
        AddCategory
      </Link>
      <Link className={linkClasses("/addProduct")} href="/addProduct">
        AddProduct
      </Link>
      <Link className={linkClasses("/addUser")} href="/addUser">
        AddUser
      </Link>
    </div>
  );
};

export default AdminBoard;
