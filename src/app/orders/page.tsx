"use client";

import DeleteButton from "@/components/DeleteButton";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch(`${process.env.NEXTAUTH_URL}/api/orders`).then((res) => res.json()),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`${process.env.NEXTAUTH_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    mutation.mutate({ id, status });
    toast.success("The order status has been changed!");
  };

  const handleDelete = async (id: string) => {
    // console.log(id);

    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/orders/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        toast.success("The order has been deleted!");
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to delete the order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("An unexpected error occurred while deleting the order.");
    }
  };

  if (isLoading || status === "loading") return "Loading...";

  //add handleDelete function for item.id

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <div className="h-12 bg-green-500 text-white px-4 flex items-center justify-center text-sm md:text-base cursor-pointer">
        Your order has been placed Successfully!
      </div>
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType) => (
            <tr
              className={`${item.status !== "delivered" && "bg-red-50"}`}
              key={item.id}
            >
              <td className="hidden md:block py-6 px-1">{item.id}</td>
              <td className="py-6 px-1">
                {item.createdAt.toString().slice(0, 10)}
              </td>
              <td className="py-6 px-1">{item.price}</td>
              <td className="hidden md:block py-6 px-1">
                {item.products[0].title}
              </td>
              {session?.user.isAdmin ? (
                <td>
                  <form
                    className="flex items-center justify-center gap-4"
                    onSubmit={(e) => handleUpdate(e, item.id)}
                  >
                    <input
                      placeholder={item.status}
                      className="p-2  border-1 border-red-100 rounded-md outline-none"
                    />
                    <button className="bg-red-400 p-2 rounded-full">
                      <Image src="/edit.png" alt="" width={20} height={20} />
                    </button>
                  </form>
                </td>
              ) : (
                <td className="py-6 px-1">{item.status}</td>
              )}
              <td>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-400 p-2 rounded-full  "
                >
                  <Image src="/delete.png" alt="" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
