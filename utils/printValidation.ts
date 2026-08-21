import { OneDayDetailsProps } from "../data/tourDiary.types";

const DATE = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_TIME =
  /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])T([01]\d|2[0-3]):[0-5]\d$/;

const validDistance = (value: unknown) => {
  const parsed = Number(value);
  return value !== "" && value !== null && value !== undefined && Number.isFinite(parsed) && parsed >= 0;
};

export const validateEntriesForPrint = (entries: OneDayDetailsProps[]) => {
  const issues: string[] = [];
  entries.forEach((entry, index) => {
    const label = `Journey ${index + 1}`;
    if (!entry.note?.trim()) issues.push(`${label} has no purpose.`);

    if (entry.isCustom) {
      const dateTimes = [
        entry.startingPoint?.starting?.dateTime,
        entry.startingPoint?.ending?.dateTime,
        entry.endPoint?.starting?.dateTime,
        entry.endPoint?.ending?.dateTime,
      ];
      if (dateTimes.some((value) => !value || !DATE_TIME.test(value))) {
        issues.push(`${label} has an invalid overnight journey date or time.`);
      }
      if (
        !entry.startingPoint?.starting?.name?.trim() ||
        !entry.startingPoint?.ending?.name?.trim() ||
        !entry.endPoint?.starting?.name?.trim() ||
        !entry.endPoint?.ending?.name?.trim()
      ) {
        issues.push(`${label} has a missing station.`);
      }
      if (!entry.totalDays || entry.totalDays <= 0) {
        issues.push(`${label} has an invalid number of days.`);
      }
      if (
        !validDistance(entry.startingPoint?.distanceByBus) ||
        !validDistance(entry.startingPoint?.distanceOnFoot)
      ) {
        issues.push(`${label} has an invalid distance.`);
      }
      return;
    }

    if (!entry.date || !DATE.test(entry.date)) {
      issues.push(`${label} has an invalid date.`);
    }
    if (!entry.startingPoint?.name?.trim() || !entry.endPoint?.name?.trim()) {
      issues.push(`${label} has a missing station.`);
    }
    const times = [
      entry.startingPoint?.startTime,
      entry.startingPoint?.endTime,
      entry.endPoint?.startTime,
      entry.endPoint?.endTime,
    ];
    if (times.some((value) => !value || !TIME.test(value))) {
      issues.push(`${label} has an invalid journey time.`);
    }
    if (!validDistance(entry.distanceByBus) || !validDistance(entry.distanceOnFoot)) {
      issues.push(`${label} has an invalid distance.`);
    }
  });
  return issues;
};
