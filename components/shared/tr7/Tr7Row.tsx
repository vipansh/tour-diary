import React from "react";
import { convert24To12 } from "../../../utils/time";
import { format } from "date-fns";
import { OneDayDetailsProps } from "../../../data";

type Props = {
  detail: OneDayDetailsProps;
};

const Tr7Row = ({ detail }: Props) => {
  const distanceByBus = Number(detail.distanceByBus || 0);
  const distanceOnFoot = Number(detail.distanceOnFoot || 0);
  const busFareOneWay = Math.floor(distanceByBus * 2.2);
  const onFootFareOneWay = Math.floor(distanceOnFoot * 1);

  const addDaily =
    detail.date && new Date(detail.date) >= new Date("2023-05-22")
      ? distanceOnFoot + distanceByBus >= 30
      : distanceOnFoot + distanceByBus >= 8;

  const lineTotal =
    2 * busFareOneWay + 2 * onFootFareOneWay + (addDaily ? 50 : 0);

  return (
    <tbody className="tr7-entry-group">
      <tr className="tr7-entry-row border-b mt-1 ">
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

        <td className="border-r p-1" style={{ letterSpacing: "-0.1em" }}>
          {"By Bus /On foot"}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus}/{detail.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus && busFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.distanceOnFoot && onFootFareOneWay.toFixed(2)}
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
          {lineTotal.toFixed(2)}
        </td>
      </tr>
      <tr className="tr7-entry-row border-b border-gray-400 ">
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

        <td className="border-r p-1" style={{ letterSpacing: "-0.1em" }}>
          {"By Bus /On foot"}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus}/{detail.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.distanceByBus && busFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.distanceOnFoot && onFootFareOneWay.toFixed(2)}
        </td>
      </tr>
    </tbody>
  );
};

export default Tr7Row;
