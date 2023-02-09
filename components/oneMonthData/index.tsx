import React, { useState } from "react";
import Navbar from "./Navbar";
import TourDiary from "./TourDiary";
import TR7 from "./TR7";

type Props = {};

const OneMonthData = (props: Props) => {
  const [showTourDiary, setShowTourDiary] = useState(false);
  return (
    <div className="mx-auto shadow-md bg-gray-900 text-white h-screen py-8">
      <Navbar
        selectedIndex={showTourDiary ? 0 : 1}
        toggleShow={() => {
          setShowTourDiary(!showTourDiary);
        }}
      />
      <div className="bg-white text-gray-900  h-screen">
        {showTourDiary ? <TourDiary /> : <TR7 />}
      </div>
    </div>
  );
};

export default OneMonthData;
