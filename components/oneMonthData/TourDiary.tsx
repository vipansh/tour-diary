import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { useTourDiaryDetails } from "../../data";
import { convert24To12 } from "../../utils/time";

import { useReactToPrint } from "react-to-print";

type Props = {};

const TourDiary = (props: Props) => {
  const { details } = useTourDiaryDetails();
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };

  const thisMontDetails = details.find(
    (detail) => detail.monthName === monthName
  );
  console.log({ thisMontDetails });

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
  console.log({ totalFair });

  const ref = React.createRef<HTMLDivElement>();

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true,
    documentTitle: `${monthName} TourDiary`,
  });

  return (
    <div className="w-10/12 mx-auto">
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <button
              className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              onClick={handlePrint}
            >
              Print this out!
            </button>
            <div className="overflow-hidden" ref={componentRef}>
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
                  className="table-auto min-w-full border text-start  text-gray-900 font-light px-6 py-4  border-r"
                  style={{
                    fontSize: "0.5rem",
                  }}
                >
                  <thead className="border-b">
                    <tr className="border-b p-1">
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
                      const addDaily =
                        (!detail.distanceOnFoot ? 0 : +detail.distanceOnFoot) +
                          (!detail.distanceByBus ? 0 : +detail.distanceByBus) >=
                        8;
                      console.log({
                        addDaily,
                        onFoot: detail.distanceOnFoot,
                        byBus: detail.distanceByBus,
                        total:
                          (!detail.distanceOnFoot ? 0 : detail.distanceOnFoot) +
                          (!detail.distanceByBus ? 0 : detail.distanceByBus),
                      });
                      return (
                        <Fragment key={index}>
                          <tr className="border-b mt-1 ">
                            <td className="border-r p-1">
                              {detail.startingPoint?.name}
                            </td>
                            <td className="border-r p-1">
                              {detail.date &&
                                format(new Date(detail.date), "dd-MM-yyyy")}
                              <br />
                              {convert24To12(detail.startingPoint?.startTime)}
                            </td>
                            <td className="border-r p-1">
                              {detail.endPoint?.name}
                            </td>
                            <td className="border-r p-1">
                              {detail.date &&
                                format(new Date(detail.date), "dd-MM-yyyy")}
                              <br />
                              {convert24To12(detail.startingPoint?.endTime)}
                            </td>

                            <td className="border-r p-1">{"By Bus/On foot"}</td>
                            <td className="border-r p-1">
                              {detail.distanceByBus}/{detail.distanceOnFoot}
                            </td>
                            <td className="border-r p-1">{detail.note}</td>
                          </tr>
                          <tr className="border-b border-gray-400 ">
                            <td className="border-r p-1">
                              {detail.endPoint?.name}
                            </td>
                            <td className="border-r p-1">
                              {detail.date &&
                                format(new Date(detail.date), "dd-MM-yyyy")}
                              <br />
                              {convert24To12(detail.startingPoint?.startTime)}
                            </td>
                            <td className="border-r p-1">
                              {detail.startingPoint?.name}
                            </td>
                            <td className="border-r p-1">
                              {detail.date &&
                                format(new Date(detail.date), "dd-MM-yyyy")}
                              <br />
                              {convert24To12(detail.startingPoint?.endTime)}
                            </td>

                            <td className="border-r p-1">{"By Bus/On foot"}</td>
                            <td className="border-r p-1">
                              {detail.distanceByBus}/{detail.distanceOnFoot}
                            </td>
                            <td className="border-r p-1">{detail.note}</td>
                          </tr>
                        </Fragment>
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
  );
};

export default TourDiary;