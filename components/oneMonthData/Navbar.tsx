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

  return (
    <Fragment>
      <header aria-label="Page Header">
        <div className="mx-auto max-w-screen-xl px-4 py-4 sm:py-12 sm:px-6 lg:px-8">
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
                <Tab.List className="flex space-x-4 bg-white border-b border-gray-200 p-2  rounded-lg">
                  {["Switch to Tour diary", "Switch to TR7"].map(
                    (category, index) => (
                      <Tab
                        key={category}
                        className={({}) =>
                          classNames(
                            "focus:outline-none text-gray-400 hover:text-gray-500 p-1   border-b-2 text-sm tracking-wide font-medium border-transparent",
                            selectedIndex === index
                              ? "text-gray-700 border-indigo-500"
                              : ""
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
        </div>
      </header>
    </Fragment>
  );
};

export default Navbar;
