import React from "react";

const Header = () => {
  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto px-4 py-2 lg:flex lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Keep a Clear Record.
            <span className="sm:block"> Record Your Monthly Progress. </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl sm:leading-relaxed">
            Efficiently Manage Your Work-Related Tours, Document Your Travel
            Histories
          </p>
        </div>
      </div>
    </section>
  );
};

export default Header;
