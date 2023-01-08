import React, { useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
type Props = {};

const Header = (props: Props) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  return (
    <div className="flex">
      <MyModal isOpen={isOpen} closeModal={closeModal} />
      <div>
        <h2 className="text-gray-600 font-semibold">Products Oder</h2>
        <span className="text-xs">All products item</span>
      </div>
      <div className="lg:ml-40 ml-10 space-x-8">
        <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
          New Report
        </button>
        <button className="bg-indigo-600 px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer">
          Create
        </button>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>
    </div>
  );
};

export default Header;

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useTourDiaryDetails } from "../../data";
import { format } from "date-fns";

type MyModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

function MyModal({ isOpen, closeModal }: MyModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { details, addMonth } = useTourDiaryDetails();

  const [error, setError] = useState({
    showError: false,
    message: "",
  });

  const notify = () => {
    setError({
      showError: true,
      message: "This field is required",
    });
    toast("Enter the month and year");
  };

  function hasMonth(newMonth: string): boolean {
    // Iterate over the elements in the props array
    for (const prop of details) {
      // Check if the monthName property is defined in the prop object
      // and if the value of monthName is equal to the newMonth string
      console.log(prop, prop.monthName, newMonth);
      if (prop.monthName !== undefined && prop.monthName === newMonth) {
        return true;
      }
    }
    return false;
  }

  const creatNewFile = () => {
    console.log("create a new file");
    const value = (inputRef.current as HTMLInputElement).value;
    if (value) {
      if (details) {
        if (hasMonth(format(new Date(value), "MMMM-yyyy"))) {
          toast.error("Month and year already exist");
          setError({
            showError: true,
            message: `${format(
              new Date(value),
              "MMMM-yyyy"
            )} Month and year already exist`,
          });
          if (inputRef.current) {
            inputRef.current.value = "";
          }
          return;
        }
        addMonth(value);
        toast.success("Month and year sucessufly added");
        closeModal();
      } else {
        addMonth(value);
      }
    } else {
      notify();
      console.log(value);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    <div className="flex justify-between">
                      Create a toud diary for a new month
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer"
                        onClick={closeModal}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <div className="mb-6">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="month-year"
                        >
                          Enter the month/year
                          <input
                            className={
                              "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " +
                              `${error ? " border-red-600" : ""}`
                            }
                            id="month-year"
                            type="month"
                            ref={inputRef}
                            onChange={() => {
                              error.showError &&
                                setError({
                                  showError: false,
                                  message: "",
                                });
                            }}
                          />
                          {error.showError && (
                            <span className=" text-red-500">
                              {error.message}
                            </span>
                          )}
                        </label>
                      </div>
                      We will create a new sheet for this month. However if this
                      month data already exist than you can edit that rather
                      than creating a new one.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={creatNewFile}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
