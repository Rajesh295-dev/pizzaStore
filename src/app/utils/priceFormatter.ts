// Function to format the price value
const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}; // Function to format the price value
export default formatPrice;

