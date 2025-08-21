"use client";

// import relevent files
import AdminBoard from "@/components/AdminBoard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
  slug: string;
  title: string;
  desc: string;
  color: string;
};

// type Option = {
//   title: string;
//   additionalPrice: number;
// };
// "https://api.cloudinary.com/v1_1/dx3vungqy/image/upload"

//const NEXTAUTH_URL = "https://slicespizzeria.vercel.app";

const AddCategory = () => {
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "slicesPizzeria");
    const uploadResponse = await fetch(`${process.env.CLOUDINARY_URL}`, {
      method: "POST",
      body: formData,
    });
    const uploadedImageData = await uploadResponse.json();
    return uploadedImageData.url;
  };

  const onSubmit = async () => {
    try {
      const url = await upload();
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`, {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
        }),
      });

      const data = await res.json();

      //try to push in menu page
      router.push(`/menu`);
    } catch (err) {
      console.log(err);
    }
  };

  // api request to get all the category list
  const [catColor, setCatColor] = useState(["loading..."]);
  useEffect(() => {
    async function getCatColor() {
      const response = await fetch(
        `${process.env.NEXTAUTH_URL}/api/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const color = await response.json();
      ///mapping to find only one boject in our case it is color name
      const categoryBgColor = color.map(
        (category: { color: string }) => category.color
      );
      console.log("yoooo", categoryBgColor);
      setCatColor(categoryBgColor);
    }
    getCatColor();
  }, []);

  const [inputs, setInputs] = useState<Inputs>({
    slug: "",
    title: "",
    desc: "",
    color: "",
  });

  const { register, handleSubmit } = useForm();
  const [file, setFile] = useState<File>();

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
    const item = (target.files as FileList)[0];
    setFile(item);
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
      return { ...prev, [name]: value };
    });
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-wrap items-center justify-center text-red-500 overflow-auto">
      <AdminBoard />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap  gap-6">
        <h1 className="text-4xl mb-2 mt-5  text-gray-300 font-bold">
          Add New Category
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
            className="  block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
          <label className="text-sm">Slug</label>
          <input
            className="outline-none border border-red-200 p-4 rounded-sm placeholder:text-red-200 "
            type="text"
            placeholder="Bella Napoli"
            name="slug"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Title</label>
          <input
            className="outline-none border border-red-200 p-4 rounded-sm placeholder:text-red-200 "
            type="text"
            placeholder="Bella Napoli"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="text-sm">Description</label>
          <textarea
            rows={3}
            className="outline-none border border-red-200 p-4 rounded-sm placeholder:text-red-200 "
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Color</label>
          <select
            name="color"
            value={inputs.color}
            onChange={handleChangeSlug}
            className="outline-none border border-red-200 p-4 rounded-sm placeholder:text-red-200 "
          >
            {catColor.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
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

export default AddCategory;
