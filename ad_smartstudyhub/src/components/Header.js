import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropDownUser";
import DarkModeSwitcher from "./DarkModeSwitcher";

const Header = (props) => {

  return (
    <header className="sticky top-0 z-50 flex w-full bg-white drop-shadow-1 dark:bg-[#24303F] dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-end px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* Hamburger Toggle BTN */}
          <button
            aria-controls="sidebar"
            onClick={() => props.setSidebarOpen(!props.sidebarOpen)}
            className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
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

        <div className="flex items-center gap-3 2xsm:gap-7">
          <ul className="flex items-center gap-4 2xsm:gap-6">
            {/* Dark Mode Toggler */}
            <DarkModeSwitcher />
            {/* Dark Mode Toggler */}

            {/* Notification Menu Area */}
            <DropdownNotification />
            {/* Notification Menu Area */}
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
