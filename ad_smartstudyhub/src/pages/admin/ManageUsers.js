import React, { useState, useEffect, useRef } from "react";
import { SearchUser, getAllUser } from "~/services/UserService";
import UsersTable from "~/components/UserTable";
import { Link } from "react-router-dom";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pageLength, setPageLength] = useState(0);
  const [pageSize] = useState(10);
  const [key, setKey] = useState("");
  const firstItemRef = useRef(null);

  const fetchData = async (pageNum = 1) => {
    try {
      const response = await getAllUser(pageNum - 1, pageSize);
      if (response.success) {
        setUsers(response.data.data);
        setPageLength(response.data.extendProp.totalUsers);
        setPage(pageNum);
      } else {
        setErrorMessage("Error when getting user list");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    const searchTerm = e.target.value;
    setKey(searchTerm);
    setPage(1);

    try {
      if (searchTerm === "") {
        const result = await getAllUser(0, pageSize);
        if (result.success) {
          setUsers(result.data.data);
          setPageLength(result.data.extendProp.totalUsers);
        } else {
          setErrorMessage("Error when getting user");
        }
      } else {
        const rs = await SearchUser(searchTerm);
        if (rs.success && rs.data.meta?.code) {
          setUsers(rs.data.data);
          setPageLength(rs.data.length);
        } else {
          setErrorMessage(rs?.message ? rs.message : rs.data.meta.message);
        }
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setErrorMessage("Failed to search users.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pageLength / pageSize)) return;
    fetchData(newPage);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-[#2E3A47] dark:bg-[#24303F] sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        List Users
      </h4>
      <div>
        <div className="w-full flex justify-end md:flex-row flex-col items-end">
          <div className="relative w-[300px] md:mx-5 mb-2 flex -z-10">
            <input
              type="text"
              className="pl-10 pr-4 py-2 border rounded-lg w-full dark:bg-gray-700 dark:text-white"
              placeholder="Search id, user name or email..."
              onChange={(e) => handleSearch(e)}
              value={key}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 -mt-0.5">
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
        </div>
      </div>
      {users.length !== 0 ? (
        <>
          <div
            className="overflow-x-auto max-h-[500px] min-h-[200px] mt-5"
          >
            <UsersTable
              users={users}
              firstItemRef={firstItemRef}
              reload={fetchData}
            />
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {Math.ceil(pageLength / pageSize)}
            </span>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= Math.ceil(pageLength / pageSize)}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center">
          <h2 className="text-4xl pl-10">No User Active</h2>
        </div>
      )}
      <Link to="/create/user" className="py-12 flex justify-end pr-16">
        <div className="border-2 border-orange-500 rounded-3xl dark:hover:bg-orange-400 hover:bg-orange-600 hover:border-blue-100">
          <h2 className="hover:text-white dark:text-white p-3 text-gray-700 hover:cursor-pointer">
            Create New User
          </h2>
        </div>
      </Link>
    </div>
  );
}

export default ManageUsers;
