import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBraille, faListCheck, faCalendarDays, faGear } from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef();
  const sidebar = useRef();

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded")
    ? localStorage.getItem("sidebar-expanded")
    : false;
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72 flex-col overflow-y-hidden bg-[#1C2434] dark:bg-[#24303F] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 text-orange-600 text-[28px] font-bold pt-8">
        <NavLink to="/">
          <h2>Smart Study Hub</h2>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-bodydark2 text-white">
              MENU
            </h2>

            <ul className="mb-6 flex flex-col gap-1 text-l text-gray-400 font-medium">
              <li className="py-2 cursor-pointer">
                <Link to={'/dashboard'}>
                  <FontAwesomeIcon icon={faBraille} /> Dashboard
                </Link>
              </li>
              <li className="py-2 cursor-pointer">
                <FontAwesomeIcon icon={faCalendarDays} /> Calendar
              </li>
              <li className="py-2 cursor-pointer">
                <FontAwesomeIcon icon={faListCheck} /> Task
              </li>
              <li className="py-2 cursor-pointer">
                <Link to={'/profile'}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </Link>
              </li>
              <li className="py-2 cursor-pointer">
                <FontAwesomeIcon icon={faGear} /> Setting
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="fixed bottom-0 w-full p-4 bg-gray-800">
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="w-full text-sm text-center uppercase font-semibold text-white rounded-md py-3 px-4 bg-gray-900 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition duration-200 ease-in-out"
        >
          {sidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
