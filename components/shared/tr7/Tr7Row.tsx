import React from "react";
import { convert24To12 } from "../../../utils/time";
import { format } from "date-fns";
import { OneDayDetailsProps } from "../../../data";
import { getEntryTotals } from "../../../utils/tr7Calculations";

type Props = {
  detail: OneDayDetailsProps;
};

const Tr7Row = ({ detail }: Props) => {
  const totals = getEntryTotals(detail);
  const busFareOneWay = totals.totalFairForBus / 2;
  const onFootFareOneWay = totals.totalFairOnFoot / 2;
  const addDaily = totals.totalDaily > 0;
  const lineTotal = totals.totalAmount;

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
