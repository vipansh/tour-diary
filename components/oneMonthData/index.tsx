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
  console.log({ showTourDiary });
  return (
    <div className="mx-auto shadow-md bg-gray-900 text-white h-full min-h-screen py-8">
      <FormModal openAddModal={openAddModal} closeModal={closeModal} />
      <Navbar
        selectedIndex={showTourDiary ? 0 : 1}
        toggleShow={() => {
          setShowTourDiary(!showTourDiary);
        }}
      />
      <div className="bg-white text-gray-900  w-3/4 mx-auto rounded-lg min-h-screen">
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
