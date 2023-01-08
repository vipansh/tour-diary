import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { OneDayDetailsProps, useTourDiaryDetails } from "../../data";
import EndingPoint from "./EndingPoint";

type Props = {
  closeModal: () => void;
};

const Form = ({ closeModal }: Props) => {
  const router = useRouter();
  const { monthName } = router.query as { monthName: string };
  const [data, setData] = useState<OneDayDetailsProps>({});

  const { details, updateDataInsideMonth } = useTourDiaryDetails();
  const handelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
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
    console.log(data, monthName);
    updateDataInsideMonth(monthName, data);
    toast.success(`Data added for date ${data.date}`);
    closeModal();
  };
  console.log({ details });
  return (
    <form autoComplete="false">
      <div className="min-h-screen  py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
            <div className="max-w-md mx-auto">
              <div className="flex items-center space-x-5">
                <div className="h-14 w-14 bg-yellow-200 rounded-full flex flex-shrink-0 justify-center items-center text-yellow-500 text-2xl font-mono">
                  i
                </div>
                <div className="block pl-2 font-semibold text-xl self-start text-gray-700">
                  <h2 className="leading-relaxed">Create an Event</h2>
                  <p className="text-sm text-gray-500 font-normal leading-relaxed">
                    Enter details to add an event
                  </p>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 flex flex-col ">
                  {/* <------------ date ------------> */}
                  <div>
                    <Hr value={"Date"} />
                    <div className="flex flex-col">
                      <label className="leading-loose">Date</label>
                      <input
                        type="date"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Event title"
                        name="date"
                        onChange={handelChange}
                      />
                    </div>
                  </div>
                  {/* <------------ Ending point details  ------------> */}
                  <div>
                    <Hr value={"Ending point"} />
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
                          onChange={handelEndChnages}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <------------ starting point details  ------------> */}
                  <div>
                    <Hr value={"Starting point"} />
                    <div className="flex flex-col">
                      <label className="leading-loose">Starting Point</label>
                      <input
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Event title"
                        name="name"
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
                          onChange={handelStartChanges}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <------------ distance point details  ------------> */}
                  <div>
                    <Hr value={"Distance"} />
                    <div className="flex flex-row space-x-4">
                      <div className="flex flex-col">
                        <label className="leading-loose">Distance by bus</label>
                        <input
                          type="number"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Event title"
                          name="distanceByBus"
                          onChange={handelChange}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="leading-loose">
                          Distance on foot
                        </label>
                        <input
                          type="number"
                          className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                          placeholder="Event title"
                          name="distanceOnFoot"
                          onChange={handelChange}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <------------ Note point details  ------------> */}
                  <div>
                    <Hr value={"Note"} />
                    <div className="flex flex-col">
                      <label className="leading-loose">Note Point</label>
                      <input
                        type="text"
                        className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                        placeholder="Event title"
                        name="note"
                        onChange={handelChange}
                      />
                    </div>
                  </div>
                </div>
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
      <hr className="w-64 h-1 my-8 bg-gray-200 border-0 rounded " />
      <div className="w-64  px-4  bg-white  font-bold">{value}</div>
      <hr className="w-64 h-1 my-8 bg-gray-200 border-0 rounded " />
    </div>
  );
};
