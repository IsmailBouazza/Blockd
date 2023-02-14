import React, { useState } from "react";
import { LinkIcon } from "@heroicons/react/24/outline";
import axios from "axios";

function SuggestionBox() {
  const [input, setInput] = useState<string>("");

  return (
    <div className="p-4">
      <div className="flex flex-col items-center justify-center space-y-3 border-2 border-orange-200 dark:border-lightgray rounded-xl w-full p-4 bg-white dark:bg-darkgray">
        <p className="text-xl font-semibold text-center">Make a feedback</p>
        <p className="text-sm font-semibold text-center mt-2">
          Let's us know your thoughts
        </p>
        <div className="md:flex xs:flex-col w-full">
          <div className="flex flex-col p-3 items-start w-full md:w-1/2 space-y-3">
            <div className="w-full">
              <h3 className="text-sm font-semibold pb-1">Name</h3>
              <input
                type="text"
                className="text-sm p-2 w-full rounded-lg outline-none text-black placeholder:text-gray-400 dark:text-white bg-gray-200 dark:bg-lightgray"
                placeholder="Name"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold pb-1">Email</h3>
              <input
                type="text"
                className="text-sm p-2 w-full rounded-lg outline-none text-black placeholder:text-gray-400 dark:text-white bg-gray-200 dark:bg-lightgray"
                placeholder="Email"
              />
            </div>
            {/* <div className="w-full">
              <h3 className="text-sm font-semibold pb-1">Your Idea</h3>
              <input
                type="text"
                className="text-sm p-2 w-full rounded-lg outline-none text-black placeholder:text-gray-400 dark:text-white bg-gray-200 dark:bg-lightgray"
                placeholder="Idea title"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm font-semibold pb-1">Category</h3>
              <div className="w-full">
                <select className="w-full rounded-lg border-none outline-none p-2 text-black placeholder:text-gray-400 dark:text-white bg-gray-200 dark:bg-lightgray">
                  <option className="outline-none p-2">Beta Testing</option>
                </select>
              </div>
            </div> */}
          </div>
          <div className="flex items-start p-3 w-full md:w-1/2">
            <div className="w-full">
              <h3 className="text-sm font-semibold">Feedback</h3>
              <textarea
                id="message"
                maxLength={255}
                value={input}
                onChange={(e: any) => setInput(e.target.value)}
                data-rows="4"
                className="h-28 w-full p-2 text-black dark:text-white outline-none text-l bg-gray-200 dark:bg-lightgray rounded-lg"
                placeholder="Write a feedback in 255 characters or less."
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-6">
          {/* <button className="flex space-x-2 text-sm font-semibold p-2 px-4 rounded-lg bg-gray-200 dark:bg-lightgray">
            <LinkIcon className="w-5 h-5" />
            <p>Attach</p>
          </button> */}
          <button className="text-sm font-semibold p-2 px-4 text-white rounded-lg bg-blockd hover:bg-orange-400">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuggestionBox;
