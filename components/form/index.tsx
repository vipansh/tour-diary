import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../data";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  STORAGE_KEYS,
} from "../../utils/localStorage";
import EndingPoint from "./EndingPoint";
import FormSubContainer from "./FormSubContainer";
import useFormValidation from "./hook/useFormValidation";

type Props = {
  closeModal: () => void;
};

const Form = ({ closeModal }: Props) => {
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };
  const [data, setData] = useState<OneDayDetailsProps>({});
  const { validateDetails } = useFormValidation();
  const { details, updateDataInsideMonth } = useTourDiaryDetails();
  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const localStorageDatabase = getLocalStorageItem(STORAGE_KEYS.DATABASE);
  const database: { [key: string]: OneDayDetailsProps } = localStorageDatabase
    ? JSON.parse(localStorageDatabase)
    : [];

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
    console.log(value);

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
  console.log({ data });
  return (
    <form autoComplete="false">
      <div className="mx-auto">
        <FormSubContainer title={"Date"}>
          <div className="flex flex-col">
            <label className="leading-loose">Date</label>
            <input
              type="date"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Event title"
              name="date"
              value={data.date || ""}
              onChange={handleDateChange}
            />
          </div>
        </FormSubContainer>
        <FormSubContainer title={"Ending point"}>
          <div className="flex flex-col">
            <label className="leading-loose">Ending Point</label>
            <EndingPoint
              selectedValue={data.endPoint?.name || ""}
              onChange={heandelEndPointName}
            />
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="leading-loose">Start time </label>
              <input
                type="time"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
            <label className="leading-loose">Starting Point</label>
            <input
              type="text"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                placeholder="Event title"
                name="endTime"
                value={data.startingPoint?.endTime || ""}
                onChange={handelStartChanges}
              />
            </div>
          </div>
        </FormSubContainer>

        <FormSubContainer title={"Distance"}>
          <div className="flex flex-row space-x-4">
            <div className="flex flex-col">
              <label className="leading-loose">Distance by bus</label>
              <input
                type="number"
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
                className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
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
            <input
              type="text"
              className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              placeholder="Event title"
              name="note"
              value={data.note || ""}
              onChange={handelChange}
            />
          </div>
        </FormSubContainer>

        {/* ----------------------old code------------------------ */}
        <div className="divide-y divide-gray-200">
          <div className="pt-4 flex items-center space-x-4">
            <button
              onClick={closeModal}
              className="flex justify-center items-center w-full text-gray-900 px-4 py-3 rounded-md focus:outline-none"
            >
              <svg
                className="w-6 h-6 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 flex justify-center items-center w-full text-white px-4 py-3 rounded-md focus:outline-none"
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

export default Form;

const Hr = ({ value }: { value: string }) => {
  return (
    <div className="inline-flex items-center justify-center w-full">
      <hr className="w-64 h-1  bg-gray-200 border-0 rounded " />
      <div className="w-64  px-4  bg-white  font-bold text-center">{value}</div>
      <hr className="w-64 h-1  bg-gray-200 border-0 rounded " />
    </div>
  );
};
