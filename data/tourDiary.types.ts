export type OneDayDetailsProps = {
  date?: string; //"2022-06-15",
  startingPoint?: {
    date?: string;
    name?: string; //"New York City";
    startTime?: string; // "8?:00 AM";
    endTime?: string; // "10?:00 AM";
  };
  endPoint?: {
    date?: string;
    name?: string; //"New York City";
    startTime?: string; // "8?:00 AM";
    endTime?: string; // "10?:00 AM";
  };
  distanceByBus?: number; //3000,
  distanceOnFoot?: number; //10,
  note?: string;
  isCustom?: string;
};

export type OneDayDetailsSpecialProps = {
  startPoint: {
    date?: string;
    startingPoint?: string;
    endPoint?: string;
    distance?: string;
    distanceByBus?: number; //3000,
    distanceOnFoot?: number; //10,
    note?: string;
  };
  endPoint: {
    date?: string;
    startingPoint?: string;
    endPoint?: string;
    distance?: string;
    distanceByBus?: number; //3000,
    distanceOnFoot?: number; //10,
    note?: string;
  };
  totalDays?: string;
};

export type OneMonthDetiailsProp = {
  monthName?: string;
  data?: OneDayDetailsProps[] | [];
};

export type TourDiaryDetailsState = {
  details: OneMonthDetiailsProp[];
};

export interface TourDiaryDetailsStore extends TourDiaryDetailsState {
  // addMonth: (value: string) => void;
  addMonth: (value: string) => void;
  clearTourDiaryDetails: () => void;
  deleteMonth(monthName: string): void;
  updateDataInsideMonth(monthName: string, value: OneDayDetailsProps): void;
  deleteDateInsideMonth(monthName: string, date: string): void;
}
