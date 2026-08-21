"use client";

import React, { useState } from "react";
import { useTourDiaryDetails } from "../../data";
import CreateNewMonthModal from "../shared/CreateNewMonthModal";
import TableRow from "./TableRow";
import AiImportModal from "../aiImport/AiImportModal";
import { toast } from "react-toastify";

const TableData = () => {
  const { details, undoLastImport } = useTourDiaryDetails();
  const [isOpen, setIsOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <CreateNewMonthModal isOpen={isOpen} closeModal={closeModal} />
      <AiImportModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      <div className="bg-gray-900 text-white min-h-screen py-8">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-lg border pb-6 border-gray-700 ">
            <div className="flex items-center border-b border-gray-700 justify-between px-6 py-3">
              <h1 className="text-balance text-xl font-semibold leading-tight">Months List</h1>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  className="rounded border border-indigo-300 bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  onClick={() => setIsAiOpen(true)}
                >
                  Paste notes with AI
                </button>
                <button
                  className="rounded border border-gray-500 bg-gray-800 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  onClick={() => {
                    toast.info(
                      undoLastImport()
                        ? "The last AI import was undone."
                        : "There is no AI import to undo.",
                    );
                  }}
                >
                  Undo last AI import
                </button>
                <button
                  className="rounded border border-gray-100 bg-indigo-400 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  onClick={openModal}
                >
                  Add new month
                </button>
              </div>
            </div>
            <div className="px-6 pt-6 overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <tbody>
                  {details.map((data, index) => (
                    <TableRow key={data.monthName || index} data={data} />
                  ))}
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
