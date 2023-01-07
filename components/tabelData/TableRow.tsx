import React from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type Props = {};

const TableRow = (props: Props) => {
  return (
    <tr className="odd:bg-gray-100">
      <td className="px-4 py-2">March/2022</td>
      <td className="px-4 py-2 flex space-x-8 ">
        <EditButton />
        <DeleteButton />
      </td>
    </tr>
  );
};

export default TableRow;
