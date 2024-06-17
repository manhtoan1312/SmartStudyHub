import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAngleDown,
  faUserCircle,
  faAddressCard,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import MessageBox from "./MessageBox";
import { useAuth } from "~/hooks/AuthContext";

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout: ContextLogout } = useAuth();
  const navigate = useNavigate();
  const trigger = useRef(null);
  const dropdown = useRef(null);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [name, setName] = useState("User");

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  useEffect(() => {
    const updateUserInfo = () => {
      const storedName = localStorage.getItem("User");
      const storedImage = JSON.parse(localStorage.getItem("image"));
      if (storedName) setName(storedName);
      if (storedImage) setImage(storedImage);
    };

    updateUserInfo(); // Update when component mounts

    const handleStorageChange = () => {
      updateUserInfo(); // Update when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleCancel = () => {
    setMessage("");
  };

  const handleLogout = () => {
    setMessage("");
    ContextLogout();
    navigate("/");
  };

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setMessage("Are you sure to log out?");
  };
  return (
    <div>
      {message && (
        <MessageBox
          message={message}
          submit={handleLogout}
          cancel={handleCancel}
        />
      )}
      <div className="sm:relative sm:w-64">
        <Link
          ref={trigger}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex justify-end items-center mr-4 gap-4"
          to="#"
        >
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-black dark:text-white">
              {name}
            </span>
            <span className="block text-sm text-gray-400 dark:text-white ">
              Admin
            </span>
          </span>

          <span className="h-12 w-12 rounded-full">
            <img className="h-12 w-12 rounded-full" src={image} alt="User" />
          </span>

          <FontAwesomeIcon
            icon={faAngleDown}
            className="hidden text-gray-400 dark:text-white sm:block"
          />
        </Link>

        {/* <!-- Dropdown Start --> */}
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
          className={`absolute z-auto  right-0 mt-4 flex flex-col w-full rounded-sm border border-[#E2E8F0] bg-white shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] ${
            dropdownOpen === true ? "block" : "hidden"
          }`}
        >
          <ul className="flex flex-col gap-6 py-8 z-50 sm:px-6 px-2 border-b border-[#E2E8F0] dark:border-[#2E3A47]">
            <li>
              <Link
                to="/dashboard"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#3C50E0] text-gray-600 dark:text-gray-400 lg:text-base"
              >
                <FontAwesomeIcon icon={faAddressCard} className="" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setDropdownOpen(!dropdownOpen)}
                to="/profile"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-[#3C50E0] text-gray-600 dark:text-gray-400 lg:text-base"
              >
                <FontAwesomeIcon icon={faUserCircle} className="" />
                My Profile
              </Link>
            </li>
          </ul>
          <button
            className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-[#3C50E0] text-gray-600 dark:text-gray-400 lg:text-base"
            onClick={handleLogoutClick}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="" />
            Log Out
          </button>
        </div>
        {/* <!-- Dropdown End --> */}
      </div>
    </div>
  );
};

export default DropdownUser;
