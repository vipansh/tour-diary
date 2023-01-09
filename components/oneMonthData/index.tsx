import React, { useState } from "react";
import Navbar from "./Navbar";
import TourDiary from "./TourDiary";
import TR7 from "./TR7";

type Props = {};

const OneMonthData = (props: Props) => {
  const [showTourDiary, setShowTourDiary] = useState(false);
  return (
    <div className="w-10/12 mx-auto">
      <Navbar
        selectedIndex={showTourDiary ? 0 : 1}
        toggleShow={() => {
          setShowTourDiary(!showTourDiary);
        }}
      />
      {showTourDiary ? <TourDiary /> : <TR7 />}
    </div>
  );
};

export default OneMonthData;
