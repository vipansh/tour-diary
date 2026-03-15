import { useRouter } from "next/router";
import React, { useMemo, useRef } from "react";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../data";

import { useReactToPrint } from "react-to-print";
import Tr7Row from "../shared/tr7/Tr7Row";
import Tr7ForCustomValue from "../shared/tr7/Tr7ForCustomValue";

type Props = {
  openModal: () => void;
};

type Totals = {
  totalFairForBus: number;
  totalFairOnFoot: number;
  totalDaily: number;
  totalAmount: number;
};

const FIRST_PAGE_ROW_LIMIT = 8;
const NEXT_PAGE_ROW_LIMIT = 11;
const DAILY_ALLOWANCE_SWITCH_DATE = "2023-05-22";
const ZERO_TOTALS: Totals = {
  totalFairForBus: 0,
  totalFairOnFoot: 0,
  totalDaily: 0,
  totalAmount: 0,
};

const toNumber = (value: unknown) => {
  const parsedValue = Number(value ?? 0);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const isDailyAllowanceApplicable = (detail: OneDayDetailsProps) => {
  const totalDistance =
    toNumber(detail.distanceByBus) + toNumber(detail.distanceOnFoot);
  const minimumDistance =
    detail.date &&
    new Date(detail.date) >= new Date(DAILY_ALLOWANCE_SWITCH_DATE)
      ? 30
      : 8;

  return totalDistance >= minimumDistance;
};

const getEntryTotals = (detail: OneDayDetailsProps): Totals => {
  if (detail.isCustom) {
    const busDistance = toNumber(detail.startingPoint?.distanceByBus);
    const onFootDistance = toNumber(detail.startingPoint?.distanceOnFoot);
    const totalDays = toNumber(detail.totalDays);

    const busFareOneWay = Math.floor(busDistance * 2.5);
    const onFootFareOneWay = Math.floor(onFootDistance * 1);
    const totalFairForBus = busFareOneWay * 2;
    const totalFairOnFoot = onFootFareOneWay * 2;
    const totalDaily = totalDays * 160 + 50;

    return {
      totalFairForBus,
      totalFairOnFoot,
      totalDaily,
      totalAmount: totalFairForBus + totalFairOnFoot + totalDaily,
    };
  }

  const busDistance = toNumber(detail.distanceByBus);
  const onFootDistance = toNumber(detail.distanceOnFoot);
  const busFareOneWay = Math.floor(busDistance * 2.5);
  const onFootFareOneWay = Math.floor(onFootDistance * 1);
  const totalFairForBus = busFareOneWay * 2;
  const totalFairOnFoot = onFootFareOneWay * 2;
  const totalDaily = isDailyAllowanceApplicable(detail) ? 50 : 0;

  return {
    totalFairForBus,
    totalFairOnFoot,
    totalDaily,
    totalAmount: totalFairForBus + totalFairOnFoot + totalDaily,
  };
};

const addTotals = (runningTotal: Totals, totalsToAdd: Totals): Totals => {
  return {
    totalFairForBus: runningTotal.totalFairForBus + totalsToAdd.totalFairForBus,
    totalFairOnFoot: runningTotal.totalFairOnFoot + totalsToAdd.totalFairOnFoot,
    totalDaily: runningTotal.totalDaily + totalsToAdd.totalDaily,
    totalAmount: runningTotal.totalAmount + totalsToAdd.totalAmount,
  };
};

const paginateRows = (rows: OneDayDetailsProps[]) => {
  if (!rows.length) {
    return [[]];
  }

  const paginatedRows: OneDayDetailsProps[][] = [
    rows.slice(0, FIRST_PAGE_ROW_LIMIT),
  ];

  for (
    let startIndex = FIRST_PAGE_ROW_LIMIT;
    startIndex < rows.length;
    startIndex += NEXT_PAGE_ROW_LIMIT
  ) {
    paginatedRows.push(
      rows.slice(startIndex, startIndex + NEXT_PAGE_ROW_LIMIT),
    );
  }

  return paginatedRows;
};

type Tr7TableProps = {
  rowsOnPage: OneDayDetailsProps[];
  pageIndex: number;
  currentPageTotal: Totals;
  totalFair: Totals;
  showPageTotal: boolean;
  showGrandTotal: boolean;
};

const Tr7Table = ({
  rowsOnPage,
  pageIndex,
  currentPageTotal,
  totalFair,
  showPageTotal,
  showGrandTotal,
}: Tr7TableProps) => {
  return (
    <table className="tr7-print-table table-auto m-3 min-w-full border text-start  text-gray-900  px-6 py-4  border-r  font-bold">
      <thead className="border-b">
        <tr className="border-b p-1">
          <th colSpan={2} scope="col" className="border-r">
            Departure
          </th>
          <th colSpan={2} scope="col" className="border-r">
            Arrival
          </th>
          <th rowSpan={2} scope="col" className="border-r">
            Mode <br /> of <br /> Travel
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
            <br /> admissible
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
        <tr className="border-b p-1">
          <td className="border-r p-2"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
          <td className="border-r p-1"></td>
        </tr>
      </thead>
      {rowsOnPage.map((detail, rowIndex) => {
        const rowKey = `row-${pageIndex}-${rowIndex}`;
        if (detail.isCustom) {
          return <Tr7ForCustomValue key={rowKey} detail={detail} />;
        }
        return <Tr7Row key={rowKey} detail={detail} />;
      })}
      <tfoot>
        {showPageTotal && (
          <tr className="border-t-2">
            <td colSpan={6}>Page {pageIndex + 1} Total</td>
            <td>{currentPageTotal.totalFairForBus.toFixed(2)}</td>
            <td>{currentPageTotal.totalFairOnFoot.toFixed(2)}</td>
            <td></td>
            <td></td>
            <td>{currentPageTotal.totalDaily.toFixed(2)}</td>
            <td>{currentPageTotal.totalAmount.toFixed(2)}</td>
          </tr>
        )}
        {showGrandTotal && (
          <tr className="border-t-2 font-extrabold">
            <td colSpan={6}>Grand Total</td>
            <td>{totalFair.totalFairForBus.toFixed(2)}</td>
            <td>{totalFair.totalFairOnFoot.toFixed(2)}</td>
            <td></td>
            <td></td>
            <td>{totalFair.totalDaily.toFixed(2)}</td>
            <td>{totalFair.totalAmount.toFixed(2)}</td>
          </tr>
        )}
      </tfoot>
    </table>
  );
};

const Tr7Heading = ({ monthName }: { monthName: string }) => {
  return (
    <div className="text-center">
      <div> H.P.T.R.- 7 </div>
      <div> TRAVELLING EXPENSES CLAIM FORM </div>
      <div>1.Establishment- CDPO Chowari Month- {monthName}</div>
      <div>2.Name and Designation- Kumari Meenakshi,Supervisor </div>
      <div>3.Basic Pay- BP- 37,800/- Head Qtr.- Dhulara</div>
      <div>4.Purpose of Journey- List of Tour Programme attached</div>
    </div>
  );
};

const TR7 = ({ openModal }: Props) => {
  const { details } = useTourDiaryDetails();
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };

  const thisMontDetails = details.find(
    (detail) => detail.monthName === monthName,
  );

  const allRows = useMemo(
    () => thisMontDetails?.data || [],
    [thisMontDetails?.data],
  );
  const printPaginatedRows = useMemo(() => paginateRows(allRows), [allRows]);
  const printPageTotals = useMemo(
    () =>
      printPaginatedRows.map((rowsOnPage) =>
        rowsOnPage.reduce(
          (runningTotal, detail) =>
            addTotals(runningTotal, getEntryTotals(detail)),
          ZERO_TOTALS,
        ),
      ),
    [printPaginatedRows],
  );
  const totalFair = useMemo(
    () =>
      printPageTotals.reduce(
        (runningTotal, onePageTotal) => addTotals(runningTotal, onePageTotal),
        ZERO_TOTALS,
      ),
    [printPageTotals],
  );

  const tr7componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => tr7componentRef.current,
    copyStyles: true,
    documentTitle: `${monthName} TR7`,
    pageStyle: `
    @page {
      margin: 80px 10px 10px 5px !important;
    }
    .tr7-print-only {
      display: none;
    }
    @media print {
      .tr7-screen-only {
        display: none !important;
      }

      .tr7-print-only {
        display: block !important;
      }

      .tr7-print-page {
        break-after: page;
        page-break-after: always;
      }

      .tr7-print-page:last-child {
        break-after: auto;
        page-break-after: auto;
      }

      .tr7-entry-group {
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .tr7-print-table thead {
        display: table-header-group;
      }
    }
  `,
  });

  return (
    <div className="p-2  border-t border-gray-100  w-full flex flex-col space-x-4 ">
      <div className="flex justify-between space-x-3">
        <button
          className="group flex items-center justify-between rounded-lg border border-indigo-600 bg-indigo-600 px-5 py-1 text-white hover:bg-indigo-800"
          onClick={handlePrint}
        >
          Print TR7 out!
          <span className="ml-4 flex-shrink-0 rounded-full border border-current bg-white p-1 text-indigo-600 group-active:text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
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

      <div className="overflow-hidden font-bold" ref={tr7componentRef}>
        <div className="tr7-screen-only">
          <div className="mx-3 font-bold text-xs">
            <Tr7Heading monthName={monthName} />
            <div className="my-10 font-bold" style={{ fontSize: "13px" }}>
              <Tr7Table
                rowsOnPage={allRows}
                pageIndex={0}
                currentPageTotal={ZERO_TOTALS}
                totalFair={totalFair}
                showPageTotal={false}
                showGrandTotal={true}
              />
            </div>
          </div>
        </div>

        <div className="tr7-print-only" style={{ display: "none" }}>
          {printPaginatedRows.map((rowsOnPage, pageIndex) => {
            const isFirstPage = pageIndex === 0;
            const isLastPage = pageIndex === printPaginatedRows.length - 1;
            const currentPageTotal = printPageTotals[pageIndex] || ZERO_TOTALS;

            return (
              <div key={`print-page-${pageIndex}`} className="tr7-print-page">
                <div className="mx-3 font-bold text-xs">
                  {isFirstPage && <Tr7Heading monthName={monthName} />}
                  <div
                    className={isFirstPage ? "my-10 font-bold" : "my-4 font-bold"}
                    style={{ fontSize: "13px" }}
                  >
                    <Tr7Table
                      rowsOnPage={rowsOnPage}
                      pageIndex={pageIndex}
                      currentPageTotal={currentPageTotal}
                      totalFair={totalFair}
                      showPageTotal={true}
                      showGrandTotal={isLastPage}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TR7;
