"use client";

import { useCartStore } from "@/app/utils/store";
import { ProductType } from "@/types/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Decimal from "decimal.js";

const Price = ({ product }: { product: ProductType }) => {
  const [total, setTotal] = useState<number>(product.price);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const [validSizeOptions, setValidSizeOptions] = useState<
    ProductType["options"] | null
  >(null);

  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    let sizePrice = 0;
    if (selectedSize !== null) {
      const selectedSizeOption = validSizeOptions?.[selectedSize];
      if (selectedSizeOption) {
        sizePrice = +selectedSizeOption.additionalPrice || 0;
      }
    }

    // console.log("sizePrice:", sizePrice);

    let toppingsPrice = 0;
    selectedToppings.forEach((toppingIndex) => {
      const topping = product.options?.find(
        (option, index) => index === toppingIndex
      );

      if (topping) {
        const additionalPrice = +topping.additionalPrice || 0;
        // console.log("additionalPrice of selected topping:", additionalPrice);

        // handle the condtion on the base of additionalPrice

        let toppingPrice = 0;
        if (additionalPrice > 0) {
          if (sizePrice === 0) {
            toppingPrice += additionalPrice;
          } else if (sizePrice === 3) {
            toppingPrice += 1.0 + additionalPrice;
          } else if (sizePrice === 6) {
            toppingPrice += 2.0 + additionalPrice;
          }
        }

        toppingsPrice += isNaN(additionalPrice) ? 0 : toppingPrice;
      }
    });

    //console.log("ToppingsPrice:", toppingsPrice);

    if (product && product.price && quantity !== undefined) {
      const totalPrice = new Decimal(product.price)
        .plus(new Decimal(sizePrice))
        .plus(new Decimal(toppingsPrice))
        .times(new Decimal(quantity));

      setTotal(totalPrice.toNumber());
    } else {
      setTotal(0);
    }
  }, [quantity, selectedSize, selectedToppings, product, validSizeOptions]);

  // handle pizza size selection
  const handleSizeSelection = (index: number) => {
    const validPizzaSizes = ["small 12inch", "medium 16inch", "large 18inch"];
    // console.log("Selected Index:", index);

    const filteredSizeOptions = product.options?.filter((option) =>
      validPizzaSizes.some(
        (validSize) => option.title.toLowerCase() === validSize.toLowerCase()
      )
    );

    //console.log("Valid Size Options:", filteredSizeOptions);

    if (filteredSizeOptions && filteredSizeOptions.length > 0) {
      const selectedSizeOption = filteredSizeOptions.find(
        (option, sizeIndex) => sizeIndex === index
      );

      //console.log("Selected Size Option:", selectedSizeOption);

      if (selectedSizeOption) {
        const sizeAdditionalPrice = +selectedSizeOption.additionalPrice;
        console.log("Selected Size Title:", selectedSizeOption.title);
        console.log("Selected Size Additional Price:", sizeAdditionalPrice);

        setValidSizeOptions(filteredSizeOptions);

        setSelectedSize(index);
      } else {
        console.log("Invalid size index selected");
      }
    } else {
      console.log("No valid size options found");
    }
  };

  // handle toppings selection
  const handleToppingSelection = (index: number) => {
    setSelectedToppings((prev) => {
      // Toggle selection
      const newSelection = [...prev];

      const indexInSelection = newSelection.indexOf(index);
      if (indexInSelection === -1) {
        newSelection.push(index);
      } else {
        newSelection.splice(indexInSelection, 1);
      }
      return newSelection;
    });
  };

  const handleCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      img: product.img,

      price: total,
      ...(selectedSize !== null && {
        optionTitle: product.options?.[selectedSize]?.title,
      }),
      quantity: quantity,
      cookingPreference: cookingPreference,
      instructions: instructions,
    });
    toast.success("Items has been added to the Cart!");
  };

  const [cookingPreference, setCookingPreference] = useState("normal");
  const [instructions, setInstructions] = useState("");

  const handleCookingPreferenceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCookingPreference(event.target.value);
  };

  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructions(event.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total}</h2>

      {product.catSlug === "pizza" && (
        <h2 className="text-2xl font-bold">Select The Pizza Size</h2>
      )}

      <div className="flex flex-wrap gap-4">
        {/* Check if catSlug is  Pizza and render all the available sizes */}
        {product.catSlug === "pizza" &&
          product.options
            ?.filter(
              (option) =>
                option.title.toLowerCase() === "small 12inch" ||
                option.title.toLowerCase() === "medium 16inch" ||
                option.title.toLowerCase() === "large 18inch"
            )
            .map((option, index) => {
              // console.log(option.title);
              // console.log(option.additionalPrice);
              return (
                <button
                  key={option.title}
                  className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
                  style={{
                    background:
                      selectedSize === index ? "rgb(132 204 22)" : "white",
                    color:
                      selectedSize === index ? "white" : "rgb(248 113 113)",
                  }}
                  onClick={() => handleSizeSelection(index)}
                >
                  {option.title}
                </button>
              );
            })}
      </div>

      <h2 className="text-2xl font-bold">
        {product.title !== "Hand Tossed Pizza" ? "" : "Select Your Toppings"}
      </h2>

      {/* <h2 className="text-2xl font-bold">Select Your Toppings</h2> */}
      {/* options container */}
      {/* this logic filters to ignores all the pizzas in the form additional toppings */}
      <div className=" flex flex-wrap gap-4">
        {product.options?.length &&
          product.options
            ?.filter(
              (option) =>
                option.title.toLowerCase() !== "small 12inch" &&
                option.title.toLowerCase() !== "medium 16inch" &&
                option.title.toLowerCase() !== "large 18inch"
            )
            .map((option, index) => (
              <button
                key={option.title}
                className="min-w-[6rem] p-2 ring-1 ring-green-400 rounded-md"
                style={{
                  background: selectedToppings.includes(index)
                    ? "rgb(248 113 113)"
                    : "white",
                  color: selectedToppings.includes(index)
                    ? "white"
                    : "rgb(248 113 113)",
                }}
                onClick={() => handleToppingSelection(index)}
              >
                {option.title}
              </button>
            ))}
      </div>

      <div className=" flex flex-col justify-around  ">
        <h2 className="text-2xl font-bold">Select Your Cooking Preference</h2>
        {/* Cooking Preference Options */}
        <div className="flex flex-col p-4 gap-3">
          <label>
            <input
              type="radio"
              name="normal"
              value="normal"
              checked={cookingPreference === "normal"}
              onChange={handleCookingPreferenceChange}
            />
            <span className="ml-2">Normal Cook</span>
          </label>

          <label>
            <input
              type="radio"
              name="light"
              value="light"
              checked={cookingPreference === "light"}
              onChange={handleCookingPreferenceChange}
            />
            <span className="ml-2">Light Cook</span>
          </label>

          <label>
            <input
              type="radio"
              name="wellDone"
              value="wellDone"
              checked={cookingPreference === "wellDone"}
              onChange={handleCookingPreferenceChange}
            />
            <span className="ml-2">Well Done</span>
          </label>
        </div>

        {/* Instructions Input Field */}

        <div className="w-full flex flex-col gap-2">
          <label className="text-xl text-green-600">
            Add Special Instructions{" "}
          </label>
          <input
            type="text"
            className="border border-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            value={instructions}
            onChange={handleInstructionsChange}
            placeholder="add any instruction..."
          />
        </div>

        {/* You can use 'cookingPreference' and 'instructions' in your logic as needed */}
      </div>

      {/* quantity container */}

      <div className=" flex justify-between items-center mb-4">
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500 ">
          <span>Quantity</span>
          <div className="flex gap-4 items-center overflow-auto">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        <button
          className=" uppercase w-56 p-3 bg-red-500 text-white  ring-1 ring-red-500 "
          onClick={handleCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
