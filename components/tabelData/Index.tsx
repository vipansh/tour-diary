import React from "react";
import TableRow from "./TableRow";

type Props = {};

const TabelData = (props: Props) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
      <table className="table-auto w-full">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-2">Month</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 flex justify-content">
          <TableRow />
          <TableRow />
        </tbody>
      </table>
    </div>
  );
};

export default TabelData;
