import { format } from "date-fns";
import React, { Fragment } from "react";
import { OneDayDetailsProps } from "../../../data";
import { convert24To12 } from "../../../utils/time";

type Props = {
  detail: OneDayDetailsProps;
};

const Tr7ForCustomValue = ({ detail }: Props) => {
  const distanceByBus = Number(detail.startingPoint?.distanceByBus || 0);
  const distanceOnFoot = Number(detail.startingPoint?.distanceOnFoot || 0);
  const totalDays = Number(detail.totalDays || 0);
  const busFareOneWay = Math.floor(distanceByBus * 2.5);
  const onFootFareOneWay = Math.floor(distanceOnFoot * 1);
  const stayDaily = totalDays * 160;
  const lineTotal = 2 * busFareOneWay + 2 * onFootFareOneWay + stayDaily + 50;

  return (
    <tbody className="tr7-entry-group">
      <tr className="tr7-entry-row border-b mt-1 ">
        <td className="border-r p-1">{detail.startingPoint?.starting?.name}</td>
        <td className="border-r p-1" style={{ whiteSpace: "nowrap" }}>
          {detail.startingPoint?.starting?.dateTime && (
            <SplitDateTime
              dateTime={detail.startingPoint?.starting?.dateTime}
            />
          )}
        </td>
        <td className="border-r p-1">{detail.startingPoint?.ending?.name}</td>
        <td className="border-r p-1" style={{ whiteSpace: "nowrap" }}>
          {detail.startingPoint?.ending?.dateTime && (
            <SplitDateTime dateTime={detail.startingPoint?.ending?.dateTime} />
          )}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceByBus}/
          {detail.startingPoint?.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceByBus && busFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceOnFoot && onFootFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">{totalDays} days</td>
        <td className="border-r p-1">160/-</td>
        <td className="border-r p-1">{stayDaily.toFixed(2)}</td>
        <td className="border-r p-1" rowSpan={2}>
          {lineTotal.toFixed(2)}
        </td>
      </tr>
      <tr className="tr7-entry-row border-b border-gray-400 ">
        <td className="border-r p-1">{detail.endPoint?.starting?.name}</td>
        <td className="border-r p-1">
          {detail.endPoint?.starting?.dateTime && (
            <SplitDateTime dateTime={detail.endPoint?.starting?.dateTime} />
          )}
        </td>
        <td className="border-r p-1">{detail.endPoint?.ending?.name}</td>
        <td className="border-r p-1">
          {detail.endPoint?.ending?.dateTime && (
            <SplitDateTime dateTime={detail.endPoint?.ending?.dateTime} />
          )}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceByBus}/
          {detail.startingPoint?.distanceOnFoot}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceByBus && busFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceOnFoot && onFootFareOneWay.toFixed(2)}
        </td>
        <td className="border-r p-1">70%</td>
        <td className="border-r p-1">72/-</td>
        <td className="border-r p-1">50.00</td>
      </tr>
    </tbody>
  );
};

export default Tr7ForCustomValue;

export const SplitDateTime = ({ dateTime }: { dateTime: string }) => {
  return (
    <Fragment>
      {dateTime && format(new Date(dateTime.split("T")[0]), "dd-MM-yyyy")}
      <br />
      {dateTime && convert24To12(dateTime.split("T")[1])}
    </Fragment>
  );
};
