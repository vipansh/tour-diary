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
      <nav
        aria-label="Site Nav"
        className="mx-auto flex max-w-3xl items-center justify-between p-4"
      >
        <button className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <span className="sr-only">Logo</span>
          👋
        </button>

        <ul className="flex items-center gap-2 text-sm font-medium text-gray-50">
          <li className="">
            <button
              className="rounded-lg px-3 py-2"
              onClick={() => router.back()}
            >
              Home
            </button>
          </li>
          <li className="">
            <button className="rounded-lg px-3 py-2" onClick={toggleShow}>
              Switch to tour Diary
            </button>
          </li>{" "}
          <li className="">
            <button className="rounded-lg px-3 py-2" onClick={toggleShow}>
              Switch to TR7
            </button>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default Navbar;
