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
      <Transition appear show={openAddModal} as={Fragment}>
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
                <Dialog.Panel className="w-full max-w-none transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add new date
                  </Dialog.Title>
                  <Form closeModal={closeModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <header aria-label="Page Header">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl"></h1>

              <button
                onClick={() => router.back()}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Go Back
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
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

              <button
                className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
                onClick={() => setOpenAddModal(true)}
              >
                Create New line
              </button>
            </div>
          </div>
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
