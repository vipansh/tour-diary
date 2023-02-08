import { differenceInYears, isFuture } from "date-fns";
import { useState, useCallback } from "react";
import { OneDayDetailsProps } from "../../../data";

const useFormValidation = () => {
  const [errors, setErrors] = useState<Object>({});

  const validateDetails = useCallback((state: OneDayDetailsProps): boolean => {
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
      if (!date || date.trim() === "") {
        errors.date = "*date is required";
      }

      if (!startingPoint || startingPoint?.name?.trim() === "") {
        errors.startingPoint.name = "*startingPoint name is required";
      }

      if (!endPoint || endPoint?.name?.trim() === "") {
        errors.endPoint.name = "*endPoint name is required";
      }

      if (!distanceByBus || !Number.isInteger(distanceByBus)) {
        errors.distanceByBus = "*distanceByBus is not a valid number";
      }

      if (!distanceOnFoot || !Number.isInteger(distanceOnFoot)) {
        errors.distanceOnFoot = "*distanceOnFoot is not a valid number";
      }

      if (!note || note.trim() === "") {
        errors.note = "*note is required";
      }
    }

    setErrors(errors);

    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) return false;

    return true;
  }, []);

  const updateError = (error: { [key: string]: string }) => {
    setErrors(error);
  };
  console.log({ errors });
  return {
    errors,
    updateError,
    validateDetails,
  };
};

export default useFormValidation;
