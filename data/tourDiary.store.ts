import { format } from "date-fns";
import create from "zustand";
import { addLocalStorageItem, STORAGE_KEYS } from "../utils/localStorage";
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

const defaultState: TourDiaryDetailsState = {
  details: [
    {
      monthName: "",
      data: defaultDateviseData,
    },
  ],
};

export const useTourDiaryDetails = create<TourDiaryDetailsStore>((set) => ({
  ...defaultState,

  addMonth: (value: string) => {
    console.log("create a new file");

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
  clearTourDiaryDetails: () => set(defaultState),
}));
