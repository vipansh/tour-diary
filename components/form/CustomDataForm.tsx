import React, { useState } from "react";
import { toast } from "react-toastify";
import { OneDayDetailsProps } from "../../data";
import { specialJourneyRecord } from "../../data/oldRecord";
import { getLocalStorageItem, STORAGE_KEYS } from "../../utils/localStorage";
import EndingPoint, { convertJSONtoArray } from "./EndingPoint";
import FormSubContainer from "./FormSubContainer";

type Props = {
  closeModal: () => void;
};

const CustomDataForm = ({ closeModal }: Props) => {
  // specialJourneyRecord
  const [query, setQuery] = useState("");
  const [data, setData] = useState<OneDayDetailsProps>({});

  const localStorageDatabase = getLocalStorageItem(
    STORAGE_KEYS.ADVANCE_DATABASE
  );
  const database: { [key: string]: OneDayDetailsProps } = localStorageDatabase
    ? { ...specialJourneyRecord, ...JSON.parse(localStorageDatabase) }
    : { ...specialJourneyRecord };

  const listOfEndPoints = convertJSONtoArray(database);

  const filteredPeople =
    query === ""
      ? listOfEndPoints
      : listOfEndPoints.filter((person) =>
          person.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  console.log(filteredPeople);

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
  console.log({ data });
  return (
    <form autoComplete="false">
      <div>
        <div className="border-2  sm:rounded-md  m-4 p-4 rounded-md flex-1 ">
          <h3 className="text-center text-lg">Starting journey </h3>
          <FormSubContainer title={"Ending point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Ending point name </label>
              <EndingPoint
                selectedValue={data.startingPoint?.endPoint || ""}
                onChange={heandelEndPointName}
                listOfEndPoints={listOfEndPoints}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Ending date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Ending point date and time"
                name="startTime"
                value={
                  data.startingPoint?.date
                    ? `${data.startingPoint?.date}T${data.startingPoint?.startTime}`
                    : ""
                }
                type="datetime-local"
                my-date-format="DD/MM/YYYY hh:mm"
                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Starting point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Starting point name </label>
              <input
                type="time"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                value={data.startingPoint?.startingPoint || ""}
                //   onChange={handelStartChanges}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Starting date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                value={`${data.startingPoint?.date}  ${data.startingPoint?.endTime}`}

                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Distance"}>
            <input
              type="number"
              placeholder="Distance by bus"
              value={data.distanceByBus}
            />
            <input
              type="number"
              placeholder="Distance on foot"
              value={data.distanceOnFoot}
            />
          </FormSubContainer>
        </div>

        <FormSubContainer title={"Number of days"}>
          <input type="number" placeholder="Number of days" />
        </FormSubContainer>

        <div className="border-2  sm:rounded-md  m-4 p-4 rounded-md flex-1 ">
          <h3 className="text-center text-lg">Back to Office journey </h3>
          <FormSubContainer title={"Starting point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Starting point name </label>
              <input
                type="time"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Starting date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Ending point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Ending point name </label>
              <input
                type="time"
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Ending date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                //   value={data.startingPoint?.startTime || ""}
                //   onChange={handelStartChanges}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Distance"}>
            <input type="number" placeholder="Distance by bus" />
            <input type="number" placeholder="Distance on foot" />
          </FormSubContainer>
        </div>

        {/* ----------------------old code------------------------ */}
        <div className="divide-y divide-gray-200">
          <div className="pt-4 flex items-center space-x-4 justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                closeModal();
              }}
              className="flex rounded border border-current px-4 py-2 text-sm font-medium text-red-600 transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:text-red-500"
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
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>
            <button
              type="submit"
              className="flex rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500"
              //   onClick={createData}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CustomDataForm;
