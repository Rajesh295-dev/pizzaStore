"use client";

import AdminBoard from "@/components/AdminBoard";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  email: string;
  isAdmin: Boolean;
};

const AddUser = () => {
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "slicesPizzeria");
    const uploadResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dx3vungqy/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImageData = await uploadResponse.json();
    return uploadedImageData.url;
  };

  const onSubmit = async () => {
    try {
      const url = await upload();
      const res = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        body: JSON.stringify({
          image: url,
          ...inputs,
        }),
      });

      const responseData = await res.json();

      console.log("thisssss", responseData);
      reset();
      setFile(null);

      //try to push in menu page
      //router.push(`/${data.id}`);
      //toast.success("User Info has been Updated!");
    } catch (err) {
      console.log(err);
    }
  };

  //api request to get all the users list
  const [updateduser, setUpdatedUser] = useState(["loading..."]);
  useEffect(() => {
    async function getUserInfo() {
      const response = await fetch("http://localhost:3000/api/user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const users = await response.json();
      //   setUpdatedUser(userInformation);
    }
    getUserInfo();
  }, []);

  const [inputs, setInputs] = useState<Inputs>({
    name: "",
    email: "",
    isAdmin: false,
  });

  const { register, handleSubmit, reset } = useForm();
  const [file, setFile] = useState<File | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated" || !session?.user.isAdmin) {
    router.push("/");
  }

  const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const File = (target.files as FileList)[0];
    setFile(File);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const handleChangeSlug = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return {
        ...prev,
        // [name]: value,
        [e.target.name]:
          e.target.name === "isAdmin"
            ? e.target.value === "true"
            : e.target.value,
      };
    });
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-wrap items-center justify-center text-red-500 overflow-auto">
      <AdminBoard />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-6">
        <h1 className="text-4xl mb-2 mt-5 text-gray-300 font-bold">
          Add or Modify User Information
        </h1>
        <div className="w-full flex flex-col gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-4 items-center"
            htmlFor="file"
          >
            <Image src="/upload.png" alt="" width={30} height={20} />
            <span>Upload Image</span>
          </label>
          <input
            type="file"
            {...register("profile")}
            className="  w-1/2 md:w-1/3 text-sm text-gray-800 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            onChange={handleChangeImg}
            id="file"
          />
        </div>
        {file && (
          <div className=" flex flex-col gap-2">
            <label className="text-sm">Selected Image</label>
            <Image
              width={50}
              height={50}
              src={URL.createObjectURL(file)}
              alt="Selected Image"
              className="w-full h-48 object-cover"
            />
          </div>
        )}
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Name</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Email</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="text"
            placeholder="Bella Napoli"
            name="email"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">IsAdmin</label>
          <select
            name="isAdmin"
            value={inputs.isAdmin === null ? "" : inputs.isAdmin.toString()}
            onChange={handleChangeSlug}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddUser;
// 1/2 lb blackened angus burger, Lettuce, Tomato, Onion, Bleu Cheese Crumbles w/Fries
