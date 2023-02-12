import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../data";
import { specialJourneyRecord } from "../../data/oldRecord";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  STORAGE_KEYS,
} from "../../utils/localStorage";
import EndingPoint, { convertJSONtoArray } from "./EndingPoint";
import FormSubContainer from "./FormSubContainer";

type Props = {
  closeModal: () => void;
};

const CustomDataForm = ({ closeModal }: Props) => {
  // specialJourneyRecord
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };
  const [query, setQuery] = useState("");
  const [data, setData] = useState<OneDayDetailsProps>({
    isCustom: true,
  });

  const localStorageDatabase = getLocalStorageItem(
    STORAGE_KEYS.ADVANCE_DATABASE
  );
  const { updateDataInsideMonth } = useTourDiaryDetails();

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

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(event.target.value);

    const [month, year] = monthName.split("-");
    const monthNum = new Date(`${month} 01, ${year}`).getMonth();
    const yearNum = new Date(`${month} 01, ${year}`).getFullYear();
    if (date.getFullYear() == yearNum && date.getMonth() == monthNum) {
      //   handelChange(event);
    } else {
      toast.info("Can't change month");
    }
  };

  const createData = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
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
    console.log(data);
  };

  function updateNestedValue(obj: any, path: string[], value: any): any {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      if (!(path[i] in current)) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    console.log(obj);
    return obj;
  }

  const handleChange = (path: any[], value: any) => {
    setData((data) => {
      const newValue = JSON.parse(
        JSON.stringify(updateNestedValue(data, path, value))
      );
      return newValue;
    });
  };
  console.log({ data: data.startingPoint?.ending?.dateTime });
  return (
    <form autoComplete="false">
      <div>
        <div className="border-2  sm:rounded-md  m-4 p-4 rounded-md flex-1 ">
          {/* ------------ starting journy details ------------- */}
          <h3 className="text-center text-lg">Starting journey </h3>
          <FormSubContainer title={"Ending point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Ending point name </label>
              <EndingPoint
                selectedValue={data.startingPoint?.ending?.name || ""}
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
                value={data.startingPoint?.ending?.dateTime}
                type="datetime-local"
                my-date-format="DD/MM/YYYY hh:mm"
                onChange={(e) => {
                  handleChange(
                    ["startingPoint", "ending", "dateTime"],
                    e.target.value
                  );
                }}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Starting point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Starting point name </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                value={data.startingPoint?.starting?.name || ""}
                onChange={(e) => {
                  handleChange(
                    ["startingPoint", "starting", "name"],
                    e.target.value
                  );
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Starting date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                value={data.startingPoint?.starting?.dateTime}
                onChange={(e) => {
                  handleChange(
                    ["startingPoint", "starting", "dateTime"],
                    e.target.value
                  );
                }}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Distance"}>
            <input
              type="number"
              placeholder="Distance by bus"
              value={data.startingPoint?.distanceByBus}
              onChange={(e) => {
                handleChange(
                  ["startingPoint", "distanceByBus"],
                  e.target.value
                );
              }}
            />
            <input
              type="number"
              placeholder="Distance on foot"
              value={data.startingPoint?.distanceOnFoot}
              onChange={(e) => {
                handleChange(
                  ["startingPoint", "distanceOnFoot"],
                  e.target.value
                );
              }}
            />
          </FormSubContainer>
        </div>

        <FormSubContainer title={"Number of days"}>
          <input
            type="number"
            placeholder="Number of days"
            value={data.totalDays}
            onChange={(e) => {
              handleChange(["totalDays"], e.target.value);
            }}
          />
        </FormSubContainer>
        {/* --------------reverse journy details ------------------------- */}
        <div className="border-2  sm:rounded-md  m-4 p-4 rounded-md flex-1 ">
          <h3 className="text-center text-lg">Back to Office journey </h3>
          <FormSubContainer title={"Starting point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Starting point name </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                value={data.endPoint?.starting?.name || ""}
                onChange={(e) => {
                  handleChange(
                    ["endPoint", "starting", "name"],
                    e.target.value
                  );
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Starting date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                value={data.endPoint?.starting?.dateTime || ""}
                onChange={(e) => {
                  handleChange(
                    ["endPoint", "starting", "dateTime"],
                    e.target.value
                  );
                }}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Ending point detail"}>
            <div className="flex flex-col">
              <label className="leading-loose">Ending point name </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                value={data.endPoint?.ending?.name || ""}
                onChange={(e) => {
                  handleChange(["endPoint", "ending", "name"], e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="leading-loose">Ending date and time </label>
              <input
                className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600`}
                placeholder="Event title"
                name="startTime"
                type="datetime-local"
                value={data.endPoint?.ending?.dateTime || ""}
                onChange={(e) => {
                  handleChange(
                    ["endPoint", "ending", "dateTime"],
                    e.target.value
                  );
                }}
              />
            </div>
          </FormSubContainer>
          <FormSubContainer title={"Distance"}>
            <input
              type="number"
              placeholder="Distance by bus"
              value={data.endPoint?.distanceByBus || ""}
              onChange={(e) => {
                handleChange(["endPoint", "distanceByBus"], e.target.value);
              }}
            />
            <input
              type="number"
              placeholder="Distance on foot"
              value={data.endPoint?.distanceOnFoot || ""}
              onChange={(e) => {
                handleChange(["endPoint", "distanceOnFoot"], e.target.value);
              }}
            />
          </FormSubContainer>
        </div>

        <FormSubContainer title={"Purpose of journey"}>
          <textarea
            placeholder="Note"
            value={data.note || ""}
            onChange={(e) => {
              handleChange(["note"], e.target.value);
            }}
            rows={3}
            className={`px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600 `}
            name="note"
          />
        </FormSubContainer>

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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>{" "}
              Cancel
            </button>
            <button
              type="submit"
              className="flex rounded bg-indigo-600 px-12 py-3 text-sm font-medium text-white transition hover:rotate-2 hover:scale-110 focus:outline-none focus:ring active:bg-indigo-500"
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

export default CustomDataForm;
