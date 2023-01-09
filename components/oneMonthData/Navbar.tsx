import { Dialog, Tab, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import React, { Fragment, useState } from "react";
import Form from "../form";

type Props = {
  selectedIndex: number;
  toggleShow: () => void;
};

function classNames(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = ({ selectedIndex, toggleShow }: Props) => {
  const router = useRouter();
  const [openAddModal, setOpenAddModal] = useState(false);

  const closeModal = () => {
    setOpenAddModal(false);
  };

  return (
    <Fragment>
      <Transition.Root show={openAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenAddModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-screen-md">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="flex justify-center">
                      <Form closeModal={closeModal} />
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="flex justify-between pt-8">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Back
          </button>
        </div>
        <div className="flex justify-end space-x-16 ">
          <button
            onClick={() => setOpenAddModal(true)}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            Add new Line
          </button>
          <button className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2">
            Switch to TR7
          </button>

          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
              {["Switch to TR7", "Switch to Tour diary"].map(
                (category, index) => (
                  <Tab
                    key={category}
                    className={({}) =>
                      classNames(
                        "w-full rounded-lg  text-sm font-medium  text-blue-700",
                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                        selectedIndex === index
                          ? "bg-white shadow text-blue-300"
                          : "text-blue-700 hover:bg-white/[0.12] hover:text-white"
                      )
                    }
                    onClick={toggleShow}
                  >
                    {category}
                  </Tab>
                )
              )}
            </Tab.List>
          </Tab.Group>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
