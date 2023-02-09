import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { Fragment, useMemo, useRef, useState } from "react";

import { useReactToPrint } from "react-to-print";
import { useTourDiaryDetails } from "../../../data";
import { convert24To12 } from "../../../utils/time";
import DeleteButton from "../../tabelData/DeleteButton";
import TourDiaryRow from "./TourDiaryRow";

type Props = {};

const TourDiary = ({}: Props) => {
  const [setshowDeleteButton, setsetshowDeleteButton] = useState(false);
  const { details, deleteDateInsideMonth } = useTourDiaryDetails();
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };
  console.log(details);
  const thisMontDetails = details.find(
    (detail) => detail.monthName === monthName
  );

  const calculateTotalFair = () => {
    let totalFairForBus = 0;
    let totalFairOnFoot = 0;
    let totalDaily = 0;
    thisMontDetails?.data?.forEach((detail) => {
      totalFairForBus += detail.distanceByBus
        ? Math.floor(detail.distanceByBus * 2.2)
        : 0;
      totalFairOnFoot += detail.distanceOnFoot ? detail.distanceOnFoot * 1 : 0;
      totalDaily +=
        (!detail.distanceOnFoot ? 0 : +detail.distanceOnFoot) +
          (!detail.distanceByBus ? 0 : +detail.distanceByBus) >=
        8
          ? 1
          : 0;
    });
    return {
      totalFairForBus: 2 * totalFairForBus,
      totalFairOnFoot: 2 * totalFairOnFoot,
      totalDaily: totalDaily * 50,
    };
  };

  const totalFair = useMemo(calculateTotalFair, [thisMontDetails]);

  const ref = React.createRef<HTMLDivElement>();

  const componentRef = useRef<HTMLDivElement>(null);

  const removeDeleteIcon = () => {
    console.log("remove removeDeleteIcon");
    setsetshowDeleteButton(false);
  };
  const addDeleteIcon = () => {
    setsetshowDeleteButton(true);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    documentTitle: `${monthName} TourDiary`,
  });

  return (
    <>
      <div className=" mx-auto">
        <div className="flex flex-col">
          <div>
            <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
              <div className="" ref={componentRef}>
                <div className="m-4">
                  <div
                    style={{
                      fontSize: "0.5rem",
                    }}
                    className=""
                  >
                    <div>
                      Tour Diary in r/o Sh./Smt. Meenakshi Circle Supervisor
                      Dhulara, Project Chowari for the m/o {monthName}
                    </div>
                  </div>
                  <table
                    className="table-auto w-full  border text-start  text-gray-900 font-light   border-r "
                    style={{
                      fontSize: "0.5rem",
                    }}
                  >
                    <thead className="border-b">
                      <tr className="border-b">
                        <th colSpan={2} scope="col" className="border-r">
                          Departure
                        </th>
                        <th colSpan={2} scope="col" className="border-r">
                          Arrival
                        </th>
                        <th rowSpan={2} scope="col" className="border-r ">
                          Mode <br /> of <br /> Journey
                        </th>
                        <th rowSpan={2} scope="col" className="border-r">
                          Distance
                          <br /> in KM
                        </th>
                        <th rowSpan={2} scope="col" className="border-r">
                          Purpose <br /> of Journey
                        </th>
                      </tr>
                      <tr className="border-b ">
                        <th className="border-r p-1">Station</th>
                        <th className="border-r p-1">
                          Date &<br /> Hour
                        </th>
                        <th className="border-r p-1">Station</th>
                        <th className="border-r">
                          Date &<br /> Hour
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {thisMontDetails?.data?.map((detail, index) => {
                        return (
                          <TourDiaryRow
                            key={index}
                            detail={detail}
                            monthName={monthName}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                  <div
                    className="flex justify-between w-3/5 mx-auto mt-12"
                    style={{
                      fontSize: "0.5rem",
                    }}
                  >
                    <div className="flex space-y-3 flex-col justify-start align-top">
                      <div>Approved</div>
                      <div>Child Development Project Officer </div>
                      <div>Chowari, Distt. Chamba,H.P. </div>
                    </div>
                    <div className="flex space-y-6 flex-col justify-start align-top">
                      <div>Meenakshi</div>
                      <div>Circle Supervisor Circle- Dhulara</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDiary;
