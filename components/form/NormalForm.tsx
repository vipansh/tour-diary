import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../data";
import { record } from "../../data/oldRecord";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  STORAGE_KEYS,
} from "../../utils/localStorage";
import EndingPoint, { convertJSONtoArray } from "./EndingPoint";
import FormSubContainer from "./FormSubContainer";
import useFormValidation from "./hook/useFormValidation";
import ToggleForm from "./ToggleForm";

type Props = {
  closeModal: () => void;
};

function getDateRange(monthYear: string): { min: string; max: string } {
  const [month, year] = monthYear.split("-");
  const monthIndex = new Date(Date.parse(`${month} 1, ${year}`)).getMonth();
  const maxDate = new Date(Number(year), monthIndex + 1, 0)
    .toISOString()
    .split("T")[0];
  const minDate = `${year}-${("0" + (monthIndex + 1)).slice(-2)}-01`;
  return { min: minDate, max: maxDate };
}

const NormalForm = ({ closeModal }: Props) => {
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };

  const { min, max } = getDateRange(monthName);
  const [data, setData] = useState<OneDayDetailsProps>({});
  const { errors, validateDetails } = useFormValidation();
  const { details, updateDataInsideMonth } = useTourDiaryDetails();
  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const localStorageDatabase = getLocalStorageItem(STORAGE_KEYS.DATABASE);
  const database: { [key: string]: OneDayDetailsProps } = localStorageDatabase
    ? { ...record, ...JSON.parse(localStorageDatabase) }
    : { ...record };
  const listOfEndPoints = convertJSONtoArray(database);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);

    const [month, year] = monthName.split("-");
    const monthNum = new Date(`${month} 01, ${year}`).getMonth();
    const yearNum = new Date(`${month} 01, ${year}`).getFullYear();
    if (date.getFullYear() == yearNum && date.getMonth() == monthNum) {
      handelChange(event);
    } else {
      toast.info("Can't change month");
    }
  };

  const handelStartChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      startingPoint: {
        ...data.startingPoint,
        [event.target.name]: event.target.value,
      },
    });
  };
  const handelEndChnages = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "endTime") {
    }
    setData({
      ...data,
      endPoint: {
        ...data.endPoint,
        [event.target.name]: event.target.value,
      },
    });
  };

  const heandelEndPointName = (value: string) => {
    if (database[value]) {
      const prefilledValues = database[value];
      prefilledValues.date = data.date;
      setData(prefilledValues);
      toast.success("Data autofilled");
      return;
    }
    setData({
      ...data,
      endPoint: {
        ...data.endPoint,
        name: value,
      },
    });
  };
  const createData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (validateDetails(data)) {
      updateDataInsideMonth(monthName, data);
      toast.success(`Data added for date ${data.date}`);
      {
        data?.endPoint?.name &&
          addLocalStorageItem(
            STORAGE_KEYS.DATABASE,
            JSON.stringify({ ...database, [data.endPoint.name]: data })
          );
      }
      closeModal();
    } else {
      toast.error(`Enter a valid data`);
    }
  };

  return (
    <form autoComplete="false">
      <div>
        <FormSubContainer title={"Date"}>
          <div className="flex flex-col">
            <input
              type="date"
              min={min}
              max={max}
              className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                !!errors?.date ? "border-red-700 border-2" : ""
              }`}
              placeholder="Event title"
              name="date"
              value={data.date || ""}
              onChange={handleDateChange}
            />
            <div className="text-xs text-red-700 ml-2">{errors?.date}</div>
          </div>
        </FormSubContainer>
        <div className="flex flex-col md:flex-row flex-1">
          <FormSubContainer title={"Ending point"}>
            <div className="flex flex-col">
              <EndingPoint
                selectedValue={data.endPoint?.name || ""}
                onChange={heandelEndPointName}
                listOfEndPoints={listOfEndPoints}
              />
            </div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col">
                <label className="leading-loose">Start time </label>
                <input
                  type="time"
                  className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                    !!errors?.endPointStartTime ? "border-red-700 border-2" : ""
                  }`}
                  placeholder="Event title"
                  name="startTime"
                  value={data.endPoint?.startTime || ""}
                  onChange={handelEndChnages}
                />
              </div>
              <div className="flex flex-col">
                <label className="leading-loose">End time </label>
                <input
                  type="time"
                  className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                    !!errors?.endPointEndTime ? "border-red-700 border-2" : ""
                  }`}
                  placeholder="Event title"
                  name="endTime"
                  value={data.endPoint?.endTime || ""}
                  onChange={handelEndChnages}
                />
              </div>
            </div>
          </FormSubContainer>

          <FormSubContainer title={"Starting point"}>
            <div className="flex flex-col">
              <input
                type="text"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                  !!errors?.startingPointName ? "border-red-700 border-2" : ""
                }`}
                placeholder="Event title"
                name="name"
                value={data.startingPoint?.name || ""}
                onChange={handelStartChanges}
              />
            </div>
            <div className="flex flex-row space-x-4">
              <div className="flex flex-col">
                <label className="leading-loose">Start time </label>
                <input
                  type="time"
                  className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                    !!errors?.startingPointStartTime
                      ? "border-red-700 border-2"
                      : ""
                  }`}
                  placeholder="Event title"
                  name="startTime"
                  value={data.startingPoint?.startTime || ""}
                  onChange={handelStartChanges}
                />
              </div>
              <div className="flex flex-col">
                <label className="leading-loose">End time </label>
                <input
                  type="time"
                  className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                    !!errors?.startingPointEndTime
                      ? "border-red-700 border-2"
                      : ""
                  }`}
                  placeholder="Event title"
                  name="endTime"
                  value={data.startingPoint?.endTime || ""}
                  onChange={handelStartChanges}
                />
              </div>
            </div>
          </FormSubContainer>
        </div>
        <FormSubContainer title={"Distance"}>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="leading-loose">Distance by bus</label>
              <input
                type="number"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                  !!errors?.distanceByBus ? "border-red-700 border-2" : ""
                }`}
                placeholder="Event title"
                name="distanceByBus"
                value={data.distanceByBus || ""}
                onChange={handelChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Distance on foot</label>
              <input
                type="number"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                  !!errors?.distanceOnFoot ? "border-red-700 border-2" : ""
                }`}
                placeholder="Event title"
                name="distanceOnFoot"
                value={data.distanceOnFoot || ""}
                onChange={handelChange}
              />
            </div>
          </div>
        </FormSubContainer>
        <FormSubContainer title={"Note"}>
          <div className="flex flex-col">
            <label className="leading-loose">Note Point</label>
            <textarea
              rows={3}
              className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 ${
                !!errors?.note ? "border-red-700 border-2" : ""
              }`}
              placeholder="Event title"
              name="note"
              value={data.note || ""}
              onChange={(e) => {
                setData({ ...data, [e.target.name]: e.target.value });
              }}
            />
            <div className="text-xs text-red-700 ml-2">{errors?.note}</div>
          </div>
        </FormSubContainer>

        {/* ----------------------old code------------------------ */}
        <div className="divide-y divide-gray-200">
          <div className="pt-4 flex items-center space-x-4 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
              className="flex rounded border border-current px-4 py-2 text-sm font-medium text-red-600 transition "
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>
            <button
              type="submit"
              className="flex rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition "
              onClick={createData}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NormalForm;
