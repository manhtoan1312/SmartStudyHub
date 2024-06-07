import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropDownUser";
import DarkModeSwitcher from "./DarkModeSwitcher";

const Header = (props) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-[#24303F] dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="absolute right-0 h-full w-full">
                <span
                  className={`relative block h-0.5 w-full rounded-sm bg-black dark:bg-white transform transition duration-300 ease-in-out ${
                    props.sidebarOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                ></span>
                <span
                  className={`relative block h-0.5 w-full rounded-sm bg-black dark:bg-white transform transition duration-300 ease-in-out my-1 ${
                    props.sidebarOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`relative block h-0.5 w-full rounded-sm bg-black dark:bg-white transform transition duration-300 ease-in-out ${
                    props.sidebarOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* Hamburger Toggle BTN */}

          <Link
            onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
            className="block flex-shrink-0 lg:hidden"
            to="/"
          >
            <p>SideBar</p>
          </Link>
        </div>

        <div className="hidden sm:block">
          <div className="relative">
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-gray-600 focus:outline-none text-lg dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-700"
              />
            </button>

            <input
              type="text"
              placeholder="Type to search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-transparent outline-none pl-9 pr-4 text-black focus:outline-none dark:text-white xl:w-125 border-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-4 2xsm:gap-6">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
            {/* Dark Mode Toggler */}

            {/* Notification Menu Area */}
            <DropdownNotification />
            {/* Notification Menu Area */}

            {/* Chat Notification Area */}
            <DropdownMessage />
            {/* Chat Notification Area */}
          </ul>

          {/* User Area */}
          <DropdownUser />
          {/* User Area */}
        </div>
      </div>
    </header>
  );
};

export default Header;
