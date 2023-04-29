"use client";
import React, { useEffect, useState } from "react";
import { useTourDiaryDetails } from "../../data";
import CreateNewMonthModal from "../shared/CreateNewMonthModal";
import TableRow from "./TableRow";

type Props = {};

const TableData = (props: Props) => {
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
      <div className="bg-gray-900 text-white min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg border pb-6 border-gray-700 ">
            <div className="flex items-center border-b border-gray-700 justify-between px-6 py-3">
              <p className="text-xl font-semibold leading-tight">Months List</p>
              <button
                className="bg-indigo-400 text-white px-3 py-2.5 rounded border border-gray-100 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 ring-indigo-700 flex items-center justify-center cursor-pointer"
                onClick={openModal}
              >
                Add new month
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

export default TableData;
