import { format } from "date-fns";
import create from "zustand";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  removeLocalStorageItem,
  STORAGE_KEYS,
} from "../utils/localStorage";
import {
  OneDayDetailsProps,
  OneMonthDetiailsProp,
  TourDiaryDetailsState,
  TourDiaryDetailsStore,
} from "./tourDiary.types";

const safeNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const isHeadquarters = (value: string | undefined) =>
  ["dhulara", "dulara", "dullara"].includes(
    (value || "").toLocaleLowerCase().replace(/[^a-z]/g, ""),
  );

const timeMinutes = (value: string | undefined) => {
  if (!value || !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const normalizeStoredJourneyDirection = (
  entry: OneDayDetailsProps,
): OneDayDetailsProps => {
  if (entry.isCustom) return entry;
  const startingPoint = entry.startingPoint;
  const endPoint = entry.endPoint;
  if (!startingPoint || !endPoint) return entry;

  const namesAreReversed =
    !isHeadquarters(startingPoint.name) &&
    isHeadquarters(endPoint.name) &&
    !!startingPoint.name;
  const outboundMinutes = timeMinutes(startingPoint.startTime);
  const returnMinutes = timeMinutes(endPoint.startTime);
  const timesAreReversed =
    outboundMinutes !== null &&
    returnMinutes !== null &&
    outboundMinutes >= 12 * 60 &&
    returnMinutes < 12 * 60;
  const shouldSwap = namesAreReversed || timesAreReversed;
  const destinationName = namesAreReversed
    ? startingPoint.name
    : endPoint.name;

  return {
    ...entry,
    startingPoint: {
      ...startingPoint,
      name: "Dhulara",
      startTime: shouldSwap ? endPoint.startTime : startingPoint.startTime,
      endTime: shouldSwap ? endPoint.endTime : startingPoint.endTime,
    },
    endPoint: {
      ...endPoint,
      name: destinationName,
      startTime: shouldSwap ? startingPoint.startTime : endPoint.startTime,
      endTime: shouldSwap ? startingPoint.endTime : endPoint.endTime,
    },
  };
};

const entrySortDate = (entry: OneDayDetailsProps) =>
  entry.date || entry.startingPoint?.starting?.dateTime?.slice(0, 10) || "";

const stableLegacyId = (
  monthName: string,
  entry: OneDayDetailsProps,
  index: number,
) => {
  const identity = `${monthName}-${entrySortDate(entry)}-${index}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `legacy-${identity || index}`;
};

const normalizeEntryValues = (
  monthName: string,
  entry: OneDayDetailsProps,
  index: number,
): OneDayDetailsProps => ({
  ...entry,
  id: entry.id || stableLegacyId(monthName, entry, index),
  date: entry.date || entry.startingPoint?.starting?.dateTime?.slice(0, 10),
  distanceByBus: safeNumber(entry.distanceByBus),
  distanceOnFoot: safeNumber(entry.distanceOnFoot),
  totalDays:
    entry.totalDays === undefined ? undefined : safeNumber(entry.totalDays),
  startingPoint: entry.startingPoint
    ? {
        ...entry.startingPoint,
        distanceByBus:
          entry.startingPoint.distanceByBus === undefined
            ? undefined
            : safeNumber(entry.startingPoint.distanceByBus),
        distanceOnFoot:
          entry.startingPoint.distanceOnFoot === undefined
            ? undefined
            : safeNumber(entry.startingPoint.distanceOnFoot),
      }
    : undefined,
  endPoint: entry.endPoint
    ? {
        ...entry.endPoint,
        distanceByBus:
          entry.endPoint.distanceByBus === undefined
            ? undefined
            : safeNumber(entry.endPoint.distanceByBus),
        distanceOnFoot:
          entry.endPoint.distanceOnFoot === undefined
            ? undefined
            : safeNumber(entry.endPoint.distanceOnFoot),
      }
    : undefined,
});

const normalizeEntry = (
  monthName: string,
  entry: OneDayDetailsProps,
  index: number,
) => normalizeStoredJourneyDirection(normalizeEntryValues(monthName, entry, index));

const normalizeDetails = (value: unknown): OneMonthDetiailsProp[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (month): month is OneMonthDetiailsProp =>
        !!month && typeof month === "object" && typeof month.monthName === "string",
    )
    .map((month) => ({
      monthName: month.monthName,
      data: Array.isArray(month.data)
        ? month.data
            .map((entry, index) => normalizeEntry(month.monthName || "", entry, index))
            .sort((a, b) => entrySortDate(a).localeCompare(entrySortDate(b)))
        : [],
    }));
};

const readDetails = (key = STORAGE_KEYS.MONTH_DATA_LIST) => {
  const stored = getLocalStorageItem(key);
  if (!stored) return [];
  try {
    return normalizeDetails(JSON.parse(stored));
  } catch (_error) {
    return [];
  }
};

const initialDetails = readDetails();
const defaultState: TourDiaryDetailsState = { details: initialDetails };

export const useTourDiaryDetails = create<TourDiaryDetailsStore>((set) => ({
  ...defaultState,

  addMonth: (value: string) => {
    set((state) => {
      const monthName = format(new Date(value), "MMMM-yyyy");
      if (state.details.some((month) => month.monthName === monthName)) {
        return state;
      }
      const details = [...state.details, { monthName, data: [] }];
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  deleteMonth(monthName: string) {
    set((state) => {
      const details = state.details.filter(
        (detail) => detail.monthName !== monthName,
      );
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  updateDataInsideMonth(monthName: string, value: OneDayDetailsProps) {
    set((state) => {
      const normalized = normalizeEntry(monthName, value, Date.now());
      const details = state.details.map((detail) =>
        detail.monthName === monthName
          ? {
              ...detail,
              data: [...(detail.data || []), normalized].sort((a, b) =>
                entrySortDate(a).localeCompare(entrySortDate(b)),
              ),
            }
          : detail,
      );
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  deleteDateInsideMonth(monthName: string, date: string) {
    set((state) => {
      const details = state.details.map((month) =>
        month.monthName === monthName
          ? {
              ...month,
              data: month.data?.filter((entry) => entry.date !== date) || [],
            }
          : month,
      );
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  deleteEntryInsideMonth(monthName: string, entryId: string) {
    set((state) => {
      const details = state.details.map((month) =>
        month.monthName === monthName
          ? {
              ...month,
              data: month.data?.filter((entry) => entry.id !== entryId) || [],
            }
          : month,
      );
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  importReviewedEntries(entries) {
    if (!entries.length) return;
    set((state) => {
      const previous = JSON.stringify(state.details);
      const details = state.details.map((month) => ({
        ...month,
        data: [...(month.data || [])],
      }));

      entries.forEach(({ monthName, value, replaceEntryId }, importIndex) => {
        let month = details.find((item) => item.monthName === monthName);
        if (!month) {
          month = { monthName, data: [] };
          details.push(month);
        }
        const existing = month.data || [];
        const withoutReplacement = replaceEntryId
          ? existing.filter((item) => item.id !== replaceEntryId)
          : existing;
        const normalized = normalizeEntry(monthName, value, importIndex);
        const duplicate = withoutReplacement.some((item) =>
          normalized.isCustom
            ? item.isCustom &&
              item.startingPoint?.starting?.dateTime ===
                normalized.startingPoint?.starting?.dateTime
            : !item.isCustom && item.date === normalized.date,
        );
        if (duplicate) {
          throw new Error(`A journey already exists for ${entrySortDate(normalized)}.`);
        }
        month.data = [...withoutReplacement, normalized].sort((a, b) =>
          entrySortDate(a).localeCompare(entrySortDate(b)),
        );
      });

      details.sort((a, b) =>
        (a.monthName || "").localeCompare(b.monthName || ""),
      );
      addLocalStorageItem(STORAGE_KEYS.AI_IMPORT_BACKUP, previous);
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      return { ...state, details };
    });
  },

  undoLastImport() {
    const backup = getLocalStorageItem(STORAGE_KEYS.AI_IMPORT_BACKUP);
    if (!backup) return false;
    try {
      const details = normalizeDetails(JSON.parse(backup));
      addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, JSON.stringify(details));
      removeLocalStorageItem(STORAGE_KEYS.AI_IMPORT_BACKUP);
      set({ details });
      return true;
    } catch (_error) {
      return false;
    }
  },

  clearTourDiaryDetails: () => {
    addLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST, "[]");
    set({ details: [] });
  },
}));
