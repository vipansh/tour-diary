import React, { useState } from "react";
import CustomDataForm from "./CustomDataForm";

import NormalForm from "./NormalForm";
import ToggleForm from "./ToggleForm";

type Props = {
  closeModal: () => void;
};

const Form = ({ closeModal }: Props) => {
  const [showCustomForm, setShowCustomForm] = useState(false);

  return (
    <div
      className="transition-height duration-500 ease-in-out overflow-auto"
      style={{
        transition: "height 1s",
        height: showCustomForm ? "85vh" : "90vh",
      }}
    >
      <ToggleForm
        checked={showCustomForm}
        toggle={() => setShowCustomForm(!showCustomForm)}
      />
      {showCustomForm ? (
        <CustomDataForm closeModal={closeModal} />
      ) : (
        <NormalForm closeModal={closeModal} />
      )}
    </div>
  );
};

export default Form;
