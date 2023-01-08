import { format } from "date-fns";
import React from "react";
import { OneMonthDetiailsProp } from "../../data";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

type Props = {
  data: OneMonthDetiailsProp;
};

const TableRow = ({ data }: Props) => {
  console.log(data);
  return (
    <tr className="odd:bg-gray-100">
      <td className="px-4 py-2 flex-1">{data.monthName}</td>
      <td className="px-4 py-2 flex space-x-8 align-middle justify-center ">
        {data.monthName && <EditButton monthName={data.monthName} />}
        {data.monthName && <DeleteButton monthName={data.monthName} />}
      </td>
    </tr>
  );
};

export default TableRow;
