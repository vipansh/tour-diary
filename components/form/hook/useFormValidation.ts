import { differenceInYears, isFuture } from "date-fns";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import {
  OneDayDetailsProps,
  OneMonthDetiailsProp,
  TourDiaryDetailsState,
  useTourDiaryDetails,
} from "../../../data";

const useFormValidation = () => {
  const { details } = useTourDiaryDetails();
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };

  const checkDatesExist = (
    state: OneMonthDetiailsProp[],
    monthName: string,
    date: string
  ): boolean => {
    const monthDetail = state.find(
      (detail: OneMonthDetiailsProp) => detail.monthName === monthName
    );
    if (!monthDetail) {
      return false;
    }
    return !!monthDetail?.data?.some(
      (dayDetail: OneDayDetailsProps) => dayDetail.date === date
    );
  };

  const [errors, setErrors] = useState<any>();

  const validateDetails = useCallback(
    (state: OneDayDetailsProps): boolean => {
      const errors: any = {};
      if (state) {
        const {
          date,
          startingPoint,
          endPoint,
          distanceByBus,
          distanceOnFoot,
          note,
        } = state;

        if (!date || checkDatesExist(details, monthName, date)) {
          errors.date = "*date already exist";
        }
        if (!date || date.trim() === "") {
          errors.date = "*date is required";
        }
        if (!startingPoint || startingPoint?.name?.trim() === "") {
          errors.startingPointName = "*startingPoint name is required";
        }

        if (!endPoint || endPoint?.name?.trim() === "") {
          errors.endPointName = "*endPoint name is required";
        }

        if (!note || note.trim() === "") {
          errors.note = "*note is required";
        }
      }

      setErrors(errors);

      const hasErrors = Object.keys(errors).length > 0;
      if (hasErrors) return false;

      return true;
    },
    [details, monthName]
  );

  const updateError = (error: { [key: string]: string }) => {
    setErrors(error);
  };
  return {
    errors,
    updateError,
    validateDetails,
  };
};

export default useFormValidation;
