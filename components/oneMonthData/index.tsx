import React from "react";
import Navbar from "./Navbar";
import TR7 from "./TR7";

type Props = {};

const OneMonthData = (props: Props) => {
  return (
    <div className="w-10/12 mx-auto">
      <Navbar />
      <TR7 />
    </div>
  );
};

export default OneMonthData;
