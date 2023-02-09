import { useRouter } from "next/router";
import React, { useMemo, useRef } from "react";
import { useTourDiaryDetails } from "../../data";

import { useReactToPrint } from "react-to-print";
import TourDiary from "../shared/tourDiary/TourDiary";

type Props = {
  openModal: () => void;
};

const TourDiaryContainer = ({ openModal }: Props) => {
  const { details } = useTourDiaryDetails();
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
              <div className="flex justify-between space-x-3">
                <button
                  className="group flex items-center justify-between rounded-lg border border-indigo-600 bg-indigo-600 px-5 py-1 text-white hover:bg-indigo-800"
                  onClick={handlePrint}
                >
                  Print Tour Diary out!
                  <span className="ml-4 flex-shrink-0 rounded-full border border-current bg-white p-1 text-indigo-600 group-active:text-indigo-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z"
                      />
                    </svg>
                  </span>
                </button>
                <button
                  className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                  type="button"
                  onClick={openModal}
                >
                  Create New line
                </button>
              </div>
              <div className="" ref={componentRef}>
                <TourDiary />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TourDiaryContainer;
