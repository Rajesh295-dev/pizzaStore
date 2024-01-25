"use client";

import Countdown from "react-countdown";

const endingDate = new Date("2024-09-25");

const CountDown = () => {
  return (
    <div>
      <Countdown
        className="font-bold text-5xl text-yellow-300"
        date={endingDate}
      />
    </div>
  );
};

export default CountDown;
