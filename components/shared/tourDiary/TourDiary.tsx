import { useRouter } from "next/router";
import React, { useState } from "react";

import { useTourDiaryDetails } from "../../../data";
import TourDiaryCustomRow from "./TourDiaryCustomRow";
import TourDiaryRow from "./TourDiaryRow";

type Props = {};

const TourDiary = ({}: Props) => {
  const { details } = useTourDiaryDetails();
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };


  const thisMontDetails = details.find(
    (detail) => detail.monthName === monthName
  );

  return (
    <div className="min-w-full">
      <div className="m-1 font-bold text-xs">
        <div className="my-3 pl-10">
          Tour Diary in r/o Sh./Smt. Meenakshi Circle Supervisor Dhulara,
          Project Chowari for the m/o {monthName}
        </div>
        <table
          className="table-auto w-full  border text-start  text-gray-900  border-r  font-bold mt-4"
          style={{
            fontSize: "0.6rem",
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
              if (detail.isCustom)
                return (
                  <TourDiaryCustomRow
                    key={index}
                    detail={detail}
                    monthName={monthName}
                  />
                );
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
          className="flex justify-between w-3/5 mx-auto mt-12 font-bold"
          style={{
            fontSize: "0.6rem",
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
  );
};

export default TourDiary;
