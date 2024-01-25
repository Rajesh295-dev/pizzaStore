import formatPrice from "@/app/utils/priceFormatter";
import Decimal from "decimal.js";
import { useEffect, useState } from "react";

type AddressInfo = {
  name: string;
  contactNumber: string;
  street: string;
  unitNumber: string;
  city: string;
  state: string;
  zipCode: string;
};

interface DeliveryProps {
  totalPrice: number;
  tipPercentage: string;
  onTipPercentageChange: (value: string) => void;
  onCalculatedTipAmountChange: (value: number) => void;
  onTipAddAmountChange: (value: number) => void;
}

{
  /* to access the tipPercentage value from 
 the Delivery component within parent component,
 we can pass it as a prop from ParentPage to Delivery component. 
 then use a callback function
 to update the tipPercentage value in the ParentPage component. */
}

const Delivery: React.FC<DeliveryProps> = ({
  // Add the new props
  totalPrice,
  tipPercentage,
  onTipPercentageChange,
  onCalculatedTipAmountChange,
  onTipAddAmountChange,

  // onAddAmountChange, // Add the new prop
}) => {
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    name: "",
    contactNumber: "",
    street: "",
    unitNumber: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [addAmount, setAddAmount] = useState<number>(0);

  const handleaddAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = event.target.value;
    // Parse the input value as a number or set it to 0 if it's not a valid number
    const newValue = isNaN(parseFloat(inputValue)) ? 0 : parseFloat(inputValue);
    // Update state with the parsed value
    setAddAmount(newValue);
    onTipPercentageChange("custom");
    onTipAddAmountChange(newValue); // Invoke the handler
  };

  useEffect(() => {
    const calculateTipAmount = () => {
      if (tipPercentage === "custom") {
        // console.log("Custom Tip Amount:", addAmount);
        onCalculatedTipAmountChange(addAmount);
        // Use the custom amount entered by the user
      } else if (tipPercentage !== "0") {
        // Calculate tip based on percentage
        const percentage = parseFloat(tipPercentage.replace("%", ""));
        const tipAmount = (percentage / 100) * totalPrice;
        const percentToNumber = parseFloat(tipAmount.toFixed(2));
        // console.log("Percentage Tip Amount:", percentToNumber);
        onTipAddAmountChange(percentToNumber);
        onCalculatedTipAmountChange(percentToNumber);
      } else {
        // Default to 0 when no tip is selected
        onTipAddAmountChange(0);
        onCalculatedTipAmountChange(0);
      }
    };

    calculateTipAmount();
  }, [
    totalPrice,
    tipPercentage,
    addAmount,
    onCalculatedTipAmountChange,
    onTipAddAmountChange,
  ]);

  const handleAddressInfoChange = (
    fieldName: keyof AddressInfo,
    value: string
  ) => {
    setAddressInfo((prevAddressInfo) => ({
      ...prevAddressInfo,
      [fieldName]: value,
    }));
  };

  const [instructions, setInstructions] = useState("");

  const handleInstructionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInstructions(event.target.value);
  };

  const handleTipPercentageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onTipPercentageChange(event.target.value);
    if (tipPercentage !== "0") {
      setAddAmount(0);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-col gap-2">
          <label className="text-xl text-green-600 ">
            Enter Delivery Address Info
          </label>

          {/* Fields */}
          {[
            "Name",
            "Contact Number",
            "Street",
            "Unit Number",
            "City",
            "State",
            "ZIP Code",
          ].map((label) => (
            <label key={label}>
              <span className="block text-gray-600">{label}</span>
              <input
                type="text"
                className="w-full ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
                value={addressInfo[label as keyof AddressInfo]}
                onChange={(e) =>
                  handleAddressInfoChange(
                    label as keyof AddressInfo,
                    e.target.value
                  )
                }
                placeholder={`Enter your ${label}`}
              />
            </label>
          ))}
        </div>

        <label className="text-xl text-green-600 w-full flex flex-col gap-2">
          Add Special Delivery Instruction
          <input
            type="text"
            className="  ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
            value={instructions}
            onChange={handleInstructionsChange}
            placeholder="e.g., contactless, call upon Arrival.."
          />
        </label>

        {/* Tips Selection Section */}
        <div className="flex flex-col p-4 gap-3">
          <label>
            <input
              type="radio"
              name="tip"
              value="5%"
              checked={tipPercentage === "5%"}
              onChange={handleTipPercentageChange}
            />
            <span className="ml-2">5% Tip</span>
          </label>

          <label>
            <input
              type="radio"
              name="tip"
              value="10%"
              checked={tipPercentage === "10%"}
              onChange={handleTipPercentageChange}
            />
            <span className="ml-2">10% Tip</span>
          </label>

          <label>
            <input
              type="radio"
              name="tip"
              value="15%"
              checked={tipPercentage === "15%"}
              onChange={handleTipPercentageChange}
            />
            <span className="ml-2">15% Tip</span>
          </label>

          <label>
            <input
              type="radio"
              name="tip"
              value="20%"
              checked={tipPercentage === "20%"}
              onChange={handleTipPercentageChange}
            />
            <span className="ml-2">20% Tip</span>
          </label>

          <div className="w-1/3 flex flex-col gap-2 ">
            <span className="ml-2  text-green-600">Enter Different Amount</span>
            <input
              className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
              type="text"
              placeholder="Enter amount"
              name="addamount"
              value={formatPrice(addAmount)}
              onChange={handleaddAmountChange}
            />
          </div>

          <label>
            <input
              type="radio"
              name="tip"
              value="0"
              checked={tipPercentage === "0"}
              onChange={handleTipPercentageChange}
            />
            <span className="ml-2  text-green-600">
              Tip In Cash Upon Arrival
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
