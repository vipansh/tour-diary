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
    <tr className="focus:outline-none">
      <td className="pt-6">
        <div className="flex items-center">
          <div className="pl-3">
            <div className="flex items-center text-sm leading-none">
              <p className="font-semibold text-gray-800 dark:text-white ">
                {data.monthName}
              </p>
            </div>
          </div>
        </div>
      </td>
      <td className="pl-16 pt-6">
        <div className="flex space-x-2 justify-end">
          {data.monthName && <EditButton monthName={data.monthName} />}
          {data.monthName && <DeleteButton monthName={data.monthName} />}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
