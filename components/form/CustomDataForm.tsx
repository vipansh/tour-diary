import React from "react";
import FormSubContainer from "./FormSubContainer";

type Props = {
  closeModal: () => void;
};

const CustomDataForm = ({ closeModal }: Props) => {
  return (
    <form autoComplete="false">
      <div>
        <FormSubContainer title={"Date"}>som date</FormSubContainer>

        {/* ----------------------old code------------------------ */}
        <div className="divide-y divide-gray-200">
          <div className="pt-4 flex items-center space-x-4 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
              className="flex rounded border border-current px-4 py-2 text-sm font-medium text-red-600 transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:text-red-500"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>
            <button
              type="submit"
              className="flex rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500"
              //   onClick={createData}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CustomDataForm;
