import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { Fragment, useMemo, useRef, useState } from "react";
import { useTourDiaryDetails } from "../../data";
import { convert24To12 } from "../../utils/time";

import { useReactToPrint } from "react-to-print";

type Props = {};

const TR7 = (props: Props) => {
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
        (!detail.distanceOnFoot ? 0 : detail.distanceOnFoot) +
          (!detail.distanceByBus ? 0 : detail.distanceByBus) >=
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
    documentTitle: `${monthName} TR7`,
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
                  <div> H.P.T.R.- 7 </div>
                  <div> TRAVELLING EXPENSES CLAIM FORM </div>
                  <div>1.Establishment- CDPO Chowari Month- {monthName}</div>
                  <div> 2. Name and Designation- Meenakshi,Supervisor </div>
                  <div>
                    3. Basic Pay- BP- 10300+ GP- 3200 Head Qtr.- Dhulara
                  </div>
                  <div>
                    4. Purpose of Journey- List of Tour Programme attached
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
                      <th rowSpan={2} scope="col" className="border-r">
                        Mode of Travel
                      </th>
                      <th rowSpan={2} scope="col" className="border-r ">
                        Rate class <br />
                        of <br />
                        Travel (Km.)
                      </th>
                      <th rowSpan={2} scope="col" className="border-r">
                        Actual <br />
                        Fare
                        <br /> Paid
                      </th>
                      <th rowSpan={2} scope="col" className="border-r">
                        Hotel <br />
                        Charges <br />
                        if any
                      </th>
                      <th colSpan={2} scope="col" className="border-r">
                        Daily
                        <br /> Allowance
                      </th>
                      <th rowSpan={2} scope="col" className="border-r">
                        Amount
                      </th>
                      <th rowSpan={2} scope="col" className="border-r">
                        Total <br />
                        of
                        <br /> Line
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
                      <th className="border-r">
                        No. <br />
                        of
                        <br /> Days
                      </th>
                      <th className="border-r p-1">
                        Rate
                        <br /> admissibl
                      </th>
                    </tr>
                    <tr className="border-b p-1">
                      <td className="border-r p-1">1</td>
                      <td className="border-r p-1">2</td>
                      <td className="border-r p-1">3</td>
                      <td className="border-r p-1">4</td>
                      <td className="border-r p-1">5</td>
                      <td className="border-r p-1">6</td>
                      <td className="border-r p-1">7</td>
                      <td className="border-r p-1">8(on foot)</td>
                      <td className="border-r p-1">9</td>
                      <td className="border-r p-1">10</td>
                      <td className="border-r p-1">11</td>
                      <td className="border-r p-1">12</td>
                    </tr>
                  </thead>
                  <tbody>
                    {thisMontDetails?.data?.map((detail, index) => {
                      const addDaily =
                        (!detail.distanceOnFoot ? 0 : detail.distanceOnFoot) +
                          (!detail.distanceByBus ? 0 : detail.distanceByBus) >=
                        8;

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
                            <td className="border-r p-1">
                              {detail.distanceByBus &&
                                Math.floor(detail.distanceByBus * 2.2).toFixed(
                                  2
                                )}
                            </td>
                            <td className="border-r p-1">
                              {detail.distanceOnFoot &&
                                Math.floor(detail.distanceOnFoot * 1).toFixed(
                                  2
                                )}
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
                                2 *
                                (Math.floor(detail.distanceByBus || 0 * 2.2) +
                                  Math.floor(detail.distanceOnFoot || 0 * 1) +
                                  (addDaily ? 50 : 0))
                              ).toFixed(2)}
                            </td>
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
                            <td className="border-r p-1">
                              {detail.distanceByBus &&
                                Math.floor(detail.distanceByBus * 2.2).toFixed(
                                  2
                                )}
                            </td>
                            <td className="border-r p-1">
                              {detail.distanceOnFoot &&
                                Math.floor(detail.distanceOnFoot * 1).toFixed(
                                  2
                                )}
                            </td>
                          </tr>
                        </Fragment>
                      );
                    })}
                    <tr>
                      <td colSpan={6}>Grand Total</td>
                      <td>{totalFair.totalFairForBus.toFixed(2)}</td>
                      <td>{totalFair.totalFairOnFoot.toFixed(2)}</td>
                      <td> </td>
                      <td> </td>
                      <td>{totalFair.totalDaily.toFixed(2)}</td>
                      <td>
                        {(
                          totalFair.totalFairForBus +
                          totalFair.totalFairOnFoot +
                          totalFair.totalDaily
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TR7;
