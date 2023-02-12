import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../../data";
import { convert24To12 } from "../../../utils/time";
import DeleteButton from "../../tabelData/DeleteButton";

type TourDiaryRowProps = {
  detail: OneDayDetailsProps;
  monthName: string;
};

const TourDiaryRow = ({ detail, monthName }: TourDiaryRowProps) => {
  const [setshowDeleteButton, setsetshowDeleteButton] = useState(false);
  const { details, deleteDateInsideMonth } = useTourDiaryDetails();

  const removeDeleteIcon = () => {
    setsetshowDeleteButton(false);
  };
  const addDeleteIcon = () => {
    setsetshowDeleteButton(true);
  };

  return (
    <Fragment>
      <tr
        className="border-b mt-1  cursor-pointer "
        onMouseEnter={addDeleteIcon}
        onMouseLeave={removeDeleteIcon}
      >
        <td className="border-r p-1">{detail.startingPoint?.name}</td>
        <td className="border-r p-1">
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.startingPoint?.startTime)}
        </td>
        <td className="border-r p-1">{detail.endPoint?.name}</td>
        <td className="border-r p-1">
          {detail.date && format(new Date(detail.date), "dd-MM-yyyy")}
          <br />
          {convert24To12(detail.startingPoint?.endTime)}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.distanceByBus}/{detail.distanceOnFoot}
        </td>
        <td className="border-r p-1 relative" rowSpan={2}>
          {detail.note}
          {setshowDeleteButton && (
            <div className="absolute h-14 -right-2 -top-0">
              <DeleteButton
                monthName={detail.date as string}
                handelDeleteAction={() => {
                  deleteDateInsideMonth(monthName, detail.date as string);
                }}
              />
            </div>
          )}
        </td>
      </tr>
      <tr
        className="border-b border-gray-400 "
        onMouseEnter={addDeleteIcon}
        onMouseLeave={removeDeleteIcon}
      >
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
      </tr>
    </Fragment>
  );
};

export default TourDiaryRow;
