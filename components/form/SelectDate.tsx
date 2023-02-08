import React from "react";

type SelectDateProps = {
  handelChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  date: string;
};

const SelectDate = ({ date, handelChange }: SelectDateProps) => {
  return (
    <div className="flex flex-col">
      <label className="leading-loose">Date</label>
      <input
        type="date"
        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
        placeholder="Event title"
        name="date"
        value={date}
        onChange={handelChange}
      />
    </div>
  );
};

export default SelectDate;
