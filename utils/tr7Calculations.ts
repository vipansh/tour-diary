import { OneDayDetailsProps } from "../data/tourDiary.types";

export type Tr7Totals = {
  totalFairForBus: number;
  totalFairOnFoot: number;
  totalDaily: number;
  totalAmount: number;
};

export const ZERO_TR7_TOTALS: Tr7Totals = {
  totalFairForBus: 0,
  totalFairOnFoot: 0,
  totalDaily: 0,
  totalAmount: 0,
};

const DAILY_ALLOWANCE_SWITCH_DATE = "2023-05-22";

export const toCalculationNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

export const isDailyAllowanceApplicable = (detail: OneDayDetailsProps) => {
  const totalDistance =
    toCalculationNumber(detail.distanceByBus) +
    toCalculationNumber(detail.distanceOnFoot);
  const minimumDistance =
    detail.date && detail.date >= DAILY_ALLOWANCE_SWITCH_DATE ? 30 : 8;
  return totalDistance >= minimumDistance;
};

export const getEntryTotals = (detail: OneDayDetailsProps): Tr7Totals => {
  if (detail.isCustom) {
    const busDistance = toCalculationNumber(detail.startingPoint?.distanceByBus);
    const onFootDistance = toCalculationNumber(
      detail.startingPoint?.distanceOnFoot,
    );
    const totalDays = toCalculationNumber(detail.totalDays);
    const totalFairForBus = Math.floor(busDistance * 2.5) * 2;
    const totalFairOnFoot = Math.floor(onFootDistance) * 2;
    const totalDaily = totalDays * 160 + 50;
    return {
      totalFairForBus,
      totalFairOnFoot,
      totalDaily,
      totalAmount: totalFairForBus + totalFairOnFoot + totalDaily,
    };
  }

  const busDistance = toCalculationNumber(detail.distanceByBus);
  const onFootDistance = toCalculationNumber(detail.distanceOnFoot);
  const totalFairForBus = Math.floor(busDistance * 2.5) * 2;
  const totalFairOnFoot = Math.floor(onFootDistance) * 2;
  const totalDaily = isDailyAllowanceApplicable(detail) ? 50 : 0;
  return {
    totalFairForBus,
    totalFairOnFoot,
    totalDaily,
    totalAmount: totalFairForBus + totalFairOnFoot + totalDaily,
  };
};

export const addTr7Totals = (
  runningTotal: Tr7Totals,
  totalsToAdd: Tr7Totals,
): Tr7Totals => ({
  totalFairForBus: runningTotal.totalFairForBus + totalsToAdd.totalFairForBus,
  totalFairOnFoot: runningTotal.totalFairOnFoot + totalsToAdd.totalFairOnFoot,
  totalDaily: runningTotal.totalDaily + totalsToAdd.totalDaily,
  totalAmount: runningTotal.totalAmount + totalsToAdd.totalAmount,
});
