import React from "react";

interface FormSubContainerProps {
  children: React.ReactNode;
  title: string;
  discription?: string;
}

const FormSubContainer: React.FC<FormSubContainerProps> = ({
  children,
  title,
  discription,
}) => {
  return (
    <div className="border-2  sm:rounded-md  m-4 p-4 rounded-md flex-1 ">
      <div className="md:grid md:grid-cols-3 md:gap-6 ">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600">{discription}</p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">{children}</div>
      </div>
    </div>
  );
};

export default FormSubContainer;
