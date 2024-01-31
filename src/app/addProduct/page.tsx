"use client";

import AdminBoard from "@/components/AdminBoard";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Decimal from "decimal.js";
import formatPrice from "../utils/priceFormatter";

// type CategorySelectorProps = {
//   selectedCategory: string;
//   onChange: (value: string) => void;
// };

type Inputs = {
  title: string;
  desc: string;
  price: number;
  catSlug: string;
  isFeatured: Boolean;
};

type Option = {
  title: string;
  additionalPrice: number;
};

// CLOUDINARY_URL_NAME = dx3vungqy;
// CLOUDINARY_URL="https://api.cloudinary.com/v1_1/dx3vungqy/image/upload"

const NEXTAUTH_URL = "https://slicespizzeria.vercel.app";
const AddPage = () => {
  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file!);
    formData.append("upload_preset", "slicesPizzeria");
    const uploadResponse = await fetch(
      `${process.env.CLOUDINARY_URL}`,

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
      const res = await fetch(`${NEXTAUTH_URL}/api/products`, {
        method: "POST",
        body: JSON.stringify({
          img: url,
          ...inputs,
          options,
        }),
      });

      const data = await res.json();

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  // api request to get all the category list
  const [catList, setCatList] = useState(["loading..."]);
  // const [catList, setCatList] = useState<string[]>(["loading..."]);
  useEffect(() => {
    async function getCatSlug() {
      const response = await fetch(`${NEXTAUTH_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const catSlug = await response.json();
      const slugTitles = catSlug.map(
        (category: { slug: string }) => category.slug
      );
      // console.log("hoo", slugTitles);
      setCatList(slugTitles);
      setInputs((prevInputs) => ({
        ...prevInputs,
        catSlug: slugTitles.length > 0 ? slugTitles[0] : "",
      }));
    }
    getCatSlug();
  }, []);

  const [inputs, setInputs] = useState<Inputs>({
    title: "",
    desc: "",
    price: 0,
    catSlug: catList.length > 0 ? catList[0] : "",
    isFeatured: false,
  });

  // console.log("setted inputs", inputs);

  // We craft our BBQ Pizza with a medley of fresh,

  const [option, setOption] = useState<Option>({
    title: "",
    additionalPrice: 0,
  });

  const [options, setOptions] = useState<Option[]>([]);

  const { register, handleSubmit } = useForm();

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
    const { name, value } = e.target;

    // Check if the field is 'price' and use the formatter function
    const updatedValue =
      name === "price" ? Math.floor(parseFloat(value) * 100) / 100 : value;

    setInputs((prev) => {
      return { ...prev, [name]: updatedValue };
    });
  };

  const handleChangeSlug = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleChangeFeatured = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setInputs((prev) => {
      return {
        ...prev,
        // [name]: value,
        [e.target.name]:
          e.target.name === "isFeatured"
            ? e.target.value === "true"
            : e.target.value,
      };
    });
  };

  const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    // Ensure the input only contains valid characters (digits and a single period)
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    // Split the value into integer and decimal parts
    const [integerPart, decimalPart] = sanitizedValue.split(".");

    // Limit the decimal part to two digits
    const limitedDecimalPart = decimalPart ? decimalPart.slice(0, 2) : "";

    // Format the value with two decimal places
    const formattedValue = `${integerPart || "0"}.${limitedDecimalPart}`;

    setOption((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  return (
    <div className="p-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-wrap items-center justify-center text-red-500 overflow-auto">
      <AdminBoard />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-5">
        <h1 className="text-4xl mb-2 mt-5 text-gray-300 font-bold">
          Add New Product
        </h1>

        <div className="w-full flex flex-col  gap-2 ">
          <label
            className="text-sm cursor-pointer flex gap-5 items-center"
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
          <label className="text-sm">Title</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
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
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            placeholder="A timeless favorite with a twist, showcasing a thin crust topped with sweet tomatoes, fresh basil and creamy mozzarella."
            name="desc"
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">Price</label>
          <input
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            type="number"
            placeholder="29"
            name="price"
            value={formatPrice(inputs.price)}
            // value={inputs.price.toNumber()}
            onChange={handleChange}
          />
        </div>
        <div className=" w-full flex flex-col gap-2">
          <label className="text-sm">Category</label>
          <div>
            <select
              name="catSlug"
              value={inputs.catSlug}
              onChange={handleChangeSlug}
              className="ring-1 ring-red-200 p-2 rounded-sm placeholder:text-red-200 outline-none"
            >
              {catList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 ">
          <label className="text-sm">IsFeatured</label>
          <select
            name="isFeatured"
            value={
              inputs.isFeatured === null ? "" : inputs.isFeatured.toString()
            }
            onChange={handleChangeFeatured}
            className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>

        <div className="w-full flex flex-wrap  flex-col gap-2">
          <label className="text-sm">Options</label>
          <div className="flex flex-col md:flex-row gap-5">
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Title"
              name="title"
              onChange={changeOption}
            />
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Additional Price"
              name="additionalPrice"
              // value={option.additionalPrice}
              value={formatPrice(option.additionalPrice)}
              onChange={changeOption}
            />
            <button
              type="button"
              className="bg-gray-500 p-2 text-white    "
              onClick={() => setOptions((prev) => [...prev, option])}
            >
              Add Option
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-2">
            {options.map((opt) => (
              <div
                key={opt.title}
                className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
                onClick={() =>
                  setOptions((prev) =>
                    prev.filter((item) => item.title !== opt.title)
                  )
                }
              >
                <span>{opt.title}</span>
                <span className="text-xs"> (+ ${opt.additionalPrice})</span>
              </div>
            ))}
          </div>
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

export default AddPage;
