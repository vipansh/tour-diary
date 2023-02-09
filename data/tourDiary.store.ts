import { format } from "date-fns";
import create from "zustand";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  STORAGE_KEYS,
} from "../utils/localStorage";
// import storage from "shared/utils/storage";

import {
  TourDiaryDetailsStore,
  TourDiaryDetailsState,
  OneDayDetailsProps,
  OneMonthDetiailsProp,
} from "./tourDiary.types";

const defaultDateviseData: OneDayDetailsProps[] = [
  {
    date: "", //"2022-06-15",
    startingPoint: {
      name: "", //"New York City";
      startTime: "", // "8:00 AM";
      endTime: "", // "10:00 AM";
    },
    endPoint: {
      name: "", //"New York City";
      startTime: "", // "8:00 AM";
      endTime: "", // "10:00 AM";
    },
    distanceByBus: 12, //3000,
    distanceOnFoot: 1, //10,}
    note: "",
  },
];

const localStorageData = getLocalStorageItem(STORAGE_KEYS.MONTH_DATA_LIST);
const defaultState: TourDiaryDetailsState = {
  details: JSON.parse(localStorageData || "[]"),
};

export const useTourDiaryDetails = create<TourDiaryDetailsStore>((set) => ({
  ...defaultState,

  addMonth: (value: string) => {
    set((state) => {
      const newState: OneMonthDetiailsProp[] = [
        ...state.details,
        {
          monthName: format(new Date(value), "MMMM-yyyy"),
          data: [],
        },
      ];
      addLocalStorageItem(
        STORAGE_KEYS.MONTH_DATA_LIST,
        JSON.stringify(newState)
      );
      return {
        ...state,
        details: newState,
      };
    });
  },

  deleteMonth(monthName: string) {
    set((state) => {
      const newDetails = state.details.filter(
        (detail) => detail.monthName !== monthName
      );
      addLocalStorageItem(
        STORAGE_KEYS.MONTH_DATA_LIST,
        JSON.stringify(newDetails)
      );
      return {
        ...state,
        details: newDetails,
      };
    });
  },

  updateDataInsideMonth(monthName: string, value: OneDayDetailsProps) {
    set((state) => {
      const newDetails = state.details.map((detail) => {
        if (detail.monthName === monthName) {
          return {
            ...detail,
            data: detail.data ? [...detail.data, value] : [value],
          };
        }
        return detail;
      });
      const newValue = {
        ...state,
        details: newDetails,
      };
      addLocalStorageItem(
        STORAGE_KEYS.MONTH_DATA_LIST,
        JSON.stringify(newDetails)
      );
      return newValue;
    });
  },
  deleteDateInsideMonth(monthName: string, date: string) {
    set((state) => {
      const newDetails = state.details.map(
        (monthDetail: OneMonthDetiailsProp) => {
          if (monthDetail.monthName === monthName) {
            return {
              ...monthDetail,
              data: monthDetail?.data?.filter(
                (dayDetail: OneDayDetailsProps) => dayDetail.date !== date
              ),
            };
          }
          return monthDetail;
        }
      );

      addLocalStorageItem(
        STORAGE_KEYS.MONTH_DATA_LIST,
        JSON.stringify(newDetails)
      );
      return {
        ...state,
        details: newDetails,
      };
    });
  },
  clearTourDiaryDetails: () => set(defaultState),
}));
