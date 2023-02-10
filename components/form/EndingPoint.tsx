import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { getLocalStorageItem, STORAGE_KEYS } from "../../utils/localStorage";
import { OneDayDetailsProps } from "../../data";
import { record } from "../../data/oldRecord";
// import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const people: { id: number; name: string }[] = [
  { id: 1, name: "Behi" },
  { id: 2, name: "Balana" },
  { id: 3, name: "Dhulara" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  // { id: 6, name: "Hellen Schmidt" },
];

function convertJSONtoArray(
  json: Record<string, any>
): { id: number; name: string }[] {
  let id = 1;
  const result = [];
  for (const key in json) {
    result.push({ id: id, name: key });
    id++;
  }
  return result;
}

type EndingPointProp = {
  selectedValue: string;
  onChange: (value: string) => void;
};

export default function EndingPoint({
  selectedValue,
  onChange,
}: EndingPointProp) {
  const [query, setQuery] = useState("");
  const localStorageDatabase = getLocalStorageItem(STORAGE_KEYS.DATABASE);
  const database: { [key: string]: OneDayDetailsProps } = localStorageDatabase
    ? { ...record, ...JSON.parse(localStorageDatabase) }
    : { ...record };
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

  return (
    <div className="">
      <Combobox
        value={selectedValue}
        onChange={(e) => {
          //@ts-ignore
          onChange(e.name);
        }}
      >
        <div className="relative mt-1">
          {/* Render a `Fragment` instead of an `input` */}
          <div className="relative w-full cursor-default overflow-hidden px-4 py-2 border focus:ring-gray-500 focus:border-gray-900  border-gray-300 rounded-md focus:outline-none text-gray-600 sm:text-sm">
            <Combobox.Input
              className=" focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
              // displayValue={(person) => person.name}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </Combobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query.length > 0 && (
                <Combobox.Option
                  value={{ id: null, name: query }}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  Create &quot;{query}&quot;
                </Combobox.Option>
              )}

              {filteredPeople.map((person) => (
                <Combobox.Option
                  key={person.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          😀
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
