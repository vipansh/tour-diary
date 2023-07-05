import React, { Fragment } from "react";
import { convert24To12 } from "../../../utils/time";
import { format } from "date-fns";
import { OneDayDetailsProps } from "../../../data";

type Props = {
  detail: OneDayDetailsProps;
};

const Tr7Row = ({ detail }: Props) => {
  const addDaily =
    (!detail.distanceOnFoot ? 0 : +detail.distanceOnFoot) +
      (!detail.distanceByBus ? 0 : +detail.distanceByBus) >=
    8;
  console.log({ detail });
  return (
    <Fragment>
      <tr className="border-b mt-1 ">
        <td className="border-r p-1">{detail.startingPoint?.name}</td>
        <td className="border-r p-1" style={{ whiteSpace: "nowrap" }}>
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.startingPoint?.startTime)}
        </td>
        <td className="border-r p-1">{detail.endPoint?.name}</td>
        <td className="border-r p-1" style={{ whiteSpace: "nowrap" }}>
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.startingPoint?.endTime)}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.distanceByBus}/{detail.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus &&
            Math.floor(detail.distanceByBus * 2.2).toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.distanceOnFoot &&
            Math.floor(detail.distanceOnFoot * 1).toFixed(2)}
        </td>
        <td rowSpan={2} className="border-r p-1">
          {addDaily ? "  70%" : "-"}
        </td>
        <td rowSpan={2} className="border-r p-1">
          {addDaily ? "72/-" : "-"}
        </td>
        <td rowSpan={2} className="border-r p-1">
          {addDaily ? "50.00" : "-"}
        </td>
        <td rowSpan={2} className="border-r p-1">
          {(
            2 * Math.floor((detail.distanceByBus || 0) * 2.2) +
            Math.floor((detail.distanceOnFoot || 0) * 2) +
            (addDaily ? 50 : 0)
          ).toFixed(2)}
        </td>
      </tr>
      <tr className="border-b border-gray-400 ">
        <td className="border-r p-1">{detail.endPoint?.name}</td>
        <td className="border-r p-1">
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.endPoint?.startTime)}
        </td>
        <td className="border-r p-1">{detail.startingPoint?.name}</td>
        <td className="border-r p-1">
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.endPoint?.endTime)}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.distanceByBus}/{detail.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus &&
            Math.floor(detail.distanceByBus * 2.2).toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.distanceOnFoot &&
            Math.floor(detail.distanceOnFoot * 1).toFixed(2)}
        </td>
      </tr>
    </Fragment>
  );
};

export default Tr7Row;
