import React, { useState } from "react";
import FormModal from "../form/FormModal";
import Navbar from "./Navbar";
import TourDiary from "./TourDiaryContainer";
import TR7 from "./TR7";

type Props = {};

const OneMonthData = (props: Props) => {
  const [showTourDiary, setShowTourDiary] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const openModal = () => {
    setOpenAddModal(true);
  };

  const closeModal = () => {
    setOpenAddModal(false);
  };

  return (
    <div className="mx-auto shadow-md bg-gray-900 text-white ">
      <FormModal openAddModal={openAddModal} closeModal={closeModal} />
      <Navbar
        selectedIndex={showTourDiary ? 0 : 1}
        toggleShow={() => {
          setShowTourDiary(!showTourDiary);
        }}
      />
      <div className="bg-white text-gray-900 rounded-lg min-h-screen mx-auto flex max-w-7xl  p-1 pt-4 ">
        {showTourDiary ? (
          <TourDiary openModal={openModal} />
        ) : (
          <TR7 openModal={openModal} />
        )}
      </div>
    </div>
  );
};

export default OneMonthData;
