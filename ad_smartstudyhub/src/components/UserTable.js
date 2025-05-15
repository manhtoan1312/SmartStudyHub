import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faAngleDown,
  faEllipsisV,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import MessageBox from "./MessageBox";
import { useNavigate } from "react-router-dom";
import { markUser } from "~/services/UserService";

const UsersTable = ({ users, firstItemRef, reload }) => {
  const [role, setRole] = useState("ROLE");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const roleList = ["ROLE", "CUSTOMER", "PREMIUM", "GUEST"];

  const filterUsersByRole = (selectedRole) => {
    if (selectedRole === "ROLE") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.role === selectedRole);
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    filterUsersByRole(role);
  }, [role, users]);

  const submitDeleteUser = async () => {
    const result = await markUser(selectedUser.id, "DELETED");
    if (result.success) {
      setTitle("ACTION SUCCESSFUL");
      setDesc("Delete user successfully!!!");
      reload();
    } else {
      setTitle("ACTION FAILED");
      setDesc(result.message);
    }
  };
  const handleBanUser = async () => {
    const result = await markUser(selectedUser.id, "BANNED");
    if (result.success) {
      setTitle("ACTION SUCCESSFUL");
      setDesc("Ban user successfully!!!");

      reload();
    } else {
      setTitle("ACTION FAILED");
      setDesc(result.message);
    }
  };

  const handleRecoverUser = async () => {
    const result = await markUser(selectedUser.id, "ACTIVE");
    if (result.success) {
      setTitle("ACTION SUCCESSFUL");
      setDesc("Recover user successfully!!!");

      reload();
    } else {
      setTitle("ACTION FAILED");
      setDesc(result.message);
    }
  };

  const handleUpdateUser = (user) => {
    if (user.role !== "GUEST") {
      navigate(`/update/user/${user.id}`);
    }
  };

  const openActionModal = (e, user) => {
    e.stopPropagation();
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setDesc("");
    if (title === "ACTION SUCCESSFUL") {
    }
  };

  return (
    <div>
      {desc && (
        <MessageBox
          submit={
            title === "CONFIRM DELETE USER" ? submitDeleteUser : handleCancel
          }
          cancel={handleCancel}
          message={desc}
        />
      )}
      <table className="w-full text-sm text-left z-0 text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3 relative">
              <div
                className="flex justify-center items-center"
                ref={dropdownRef}
              >
                {role}
                <FontAwesomeIcon
                  className="pl-2 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  icon={faAngleDown}
                />
              </div>
              <div
                className={`absolute mt-2 top-9 w-full z-20 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
                  isDropdownOpen ? "block" : "hidden"
                }`}
              >
                <div
                  className=""
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {roleList.map((item) => (
                    <div
                      key={item}
                      className="block font-normal px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                      onClick={() => {
                        setRole(item);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Phone
            </th>
            <th scope="col" className="px-6 py-3">
              Address
            </th>
            <th scope="col" className="px-6 py-3">
              status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user, index) => (
            <tr
              key={index}
              ref={index === 0 ? firstItemRef : null}
              onClick={() => handleUpdateUser(user)}
              className="bg-white border-b hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
            >
              <td
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="flex items-center">
                  <img
                    src={user.imageUrl}
                    alt="Avatar User"
                    className="h-8 w-8 mr-2"
                  />
                  <span>{user.email}</span>
                </div>
              </td>

              <td className="px-6 py-4">{`${user.firstName} ${user.lastName}`}</td>
              <td className="px-6 py-4">
                <div className="h-full w-full flex justify-center items-center">
                  {user.role === "CUSTOMER" && (
                    <button
                      type="button"
                      className="text-white cursor-auto bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                      {user.role}
                    </button>
                  )}
                  {user.role === "PREMIUM" && (
                    <button
                      type="button"
                      className="text-white cursor-auto bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {user.role}
                    </button>
                  )}
                  {user.role === "GUEST" && (
                    <button
                      type="button"
                      className="text-white cursor-auto bg-orange-400 hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-300 font-medium rounded-full text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800"
                    >
                      {user.role}
                    </button>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">{user.phoneNumber}</td>
              <td className="px-6 py-4">{user.address}</td>
              <td className="px-6 py-4">{user.status}</td>
              <td
                className="px-6 py-4"
                onClick={(e) => openActionModal(e, user)}
              >
                <FontAwesomeIcon
                  className="text-xl cursor-pointer"
                  icon={faEllipsisV}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && selectedUser && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="h-6 w-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg font-medium leading-6 text-gray-900"
                      id="modal-title"
                    >
                      Confirm Action
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete or ban this user?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedUser.status !== "DELETED" && (
                  <button
                    onClick={() => {
                      submitDeleteUser();
                      setIsModalOpen(false);
                    }}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Delete
                  </button>
                )}
                {selectedUser.status !== "BANNED" && (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleBanUser();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Ban
                  </button>
                )}
                {selectedUser.status !== "ACTIVE" && (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      handleRecoverUser();
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Recover
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
