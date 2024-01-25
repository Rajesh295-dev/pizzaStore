// Function to format the price value
const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}; // Function to format the price value
export default formatPrice;

// import Decimal from "decimal.js";
// import formatPrice from "./your-format-price-path"; // Replace with the actual path to your formatPrice file
// // ... other imports

// const YourComponent = () => {
//   const [inputs, setInputs] = useState({
//     // ... other input fields
//     price: new Decimal(0),
//   });

// const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//   const { name, value } = e.target;

//   // Check if the field is 'price' and use the formatter function
//   const updatedValue = name === 'price' ? formatPrice(parseFloat(value)) : value;

//   setInputs((prev) => {
//     return { ...prev, [name]: updatedValue };
//   });
// };

// return (
//   <div className="w-full flex flex-col gap-2">
//     <label className="text-sm">Price</label>
//     <input
//       className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
//       type="number"
//       placeholder="29"
//       name="price"
//       value={inputs.price.toNumber()} // Convert Decimal to number for input value
//       onChange={handleChange}
//     />
//   </div>
// );
