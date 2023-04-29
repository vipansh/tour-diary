import { format } from "date-fns";
import React, { Fragment } from "react";
import { OneDayDetailsProps } from "../../../data";
import { convert24To12 } from "../../../utils/time";

type Props = {
  detail: OneDayDetailsProps;
};

const Tr7ForCustomValue = ({ detail }: Props) => {
  return (
    <Fragment>
      <tr className="border-b mt-1 ">
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
          {detail.startingPoint?.distanceByBus &&
            Math.floor(detail.startingPoint?.distanceByBus * 2.2).toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceOnFoot &&
            Math.floor(detail.startingPoint?.distanceOnFoot * 1).toFixed(2)}
        </td>
        <td className="border-r p-1">{detail.totalDays} days</td>
        <td className="border-r p-1">160/-</td>
        <td className="border-r p-1">
          {detail?.totalDays && Math.floor(160 * detail?.totalDays).toFixed(2)}
        </td>
        <td className="border-r p-1" rowSpan={2}>
          {(
            2 * Math.floor((detail.startingPoint?.distanceByBus || 0) * 2.2) +
            Math.floor((detail.startingPoint?.distanceOnFoot || 0) * 1) +
            (detail?.totalDays ? detail?.totalDays * 160 : 0) +
            50
          ).toFixed(2)}
        </td>
      </tr>
      <tr className="border-b border-gray-400 ">
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
          {detail.startingPoint?.distanceByBus &&
            Math.floor(detail.startingPoint?.distanceByBus * 2.2).toFixed(2)}
        </td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceOnFoot &&
            Math.floor(detail.startingPoint?.distanceOnFoot * 1).toFixed(2)}
        </td>
        <td className="border-r p-1">70%</td>
        <td className="border-r p-1">72/-</td>
        <td className="border-r p-1">50.00</td>
      </tr>
    </Fragment>
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
