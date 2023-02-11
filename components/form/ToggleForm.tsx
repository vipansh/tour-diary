import { Switch } from "@headlessui/react";
import React from "react";
import FormSubContainer from "./FormSubContainer";

type Props = {
  checked: boolean;
  toggle: () => void;
};

const ToggleForm = ({ checked, toggle }: Props) => {
  return (
    <FormSubContainer title={"Add custom data"}>
      <Switch
        checked={checked}
        onChange={toggle}
        className={`${checked ? "bg-teal-700" : "bg-blue-300"}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Add custom data</span>
        <span
          aria-hidden="true"
          className={`${checked ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </FormSubContainer>
  );
};

export default ToggleForm;
