"use client";

import React, { useEffect, useState } from "react";
import { useTourDiaryDetails } from "../../data";
import CreateNewMonthModal from "../shared/CreateNewMonthModal";
import TableRow from "./TableRow";

type Props = {};

const TabelData = (props: Props) => {
  const { details } = useTourDiaryDetails();
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <CreateNewMonthModal isOpen={isOpen} closeModal={closeModal} />
      <div className="shadow-md bg-gray-900 text-white h-screen py-8">
        <div className="w-full max-w-2xl px-4 mx-auto">
          <div className="rounded-lg border pb-6 border-gray-200 dark:border-gray-700 ">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700  justify-between px-6 py-3">
              <p className="focus:outline-none text-sm lg:text-xl font-semibold leading-tight text-gray-800 dark:text-white ">
                Months List
              </p>
              <button
                className="focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:bg-indigo-50 dark:focus:bg-indigo-500 flex cursor-pointer items-center justify-center px-3 py-2.5 border rounded border-gray-100 dark:border-gray-800 "
                onClick={openModal}
              >
                <p className="focus:outline-none text-xs md:text-sm leading-none text-gray-600 dark:text-gray-200 ">
                  Add new month
                </p>
              </button>
            </div>
            <div className="px-6 pt-6 overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <tbody>
                  {details.map((data, index) => {
                    return <TableRow key={index} data={data} />;
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabelData;
