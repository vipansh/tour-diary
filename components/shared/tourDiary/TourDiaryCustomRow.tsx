import { format } from "date-fns";
import React, { Fragment, useState } from "react";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../../data";
import { convert24To12 } from "../../../utils/time";
import DeleteButton from "../../tabelData/DeleteButton";
import { SplitDateTime } from "../tr7/Tr7ForCustomValue";

type TourDiaryCustomRowProps = {
  detail: OneDayDetailsProps;
  monthName: string;
};

const TourDiaryCustomRow = ({ detail, monthName }: TourDiaryCustomRowProps) => {
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
        <td className="border-r p-1">{detail.startingPoint?.starting?.name}</td>
        <td className="border-r p-1">
          {detail.startingPoint?.starting?.dateTime && (
            <SplitDateTime
              dateTime={detail.startingPoint?.starting?.dateTime}
            />
          )}
        </td>
        <td className="border-r p-1">{detail.startingPoint?.ending?.name}</td>
        <td className="border-r p-1">
          {detail.startingPoint?.ending?.dateTime && (
            <SplitDateTime dateTime={detail.startingPoint?.ending?.dateTime} />
          )}
        </td>

        <td className="border-r p-1">{"By Bus/On foot"}</td>
        <td className="border-r p-1">
          {detail.startingPoint?.distanceByBus}/
          {detail.startingPoint?.distanceOnFoot}
        </td>
        <td className="border-r p-1 relative">
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
          {detail.endPoint?.distanceByBus}/{detail.endPoint?.distanceOnFoot}
        </td>
        <td className="border-r p-1">{detail.note}</td>
      </tr>
    </Fragment>
  );
};

export default TourDiaryCustomRow;
