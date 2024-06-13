import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  DeleteFile,
  DeleteSystemFile,
  GetAllSystemFile,
} from "~/services/FileService";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";

const StatisticSystemFile = () => {
  const [fileList, setFileList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [fileType, setFileType] = useState("THEME");
  const [fieldSort, setFieldSort] = useState("id");
  const [sortType, setSortType] = useState("ASC");
  const [error, setError] = useState(null);
  const [fileDelete, setFileDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const size = 10;
  const navigate = useNavigate();

  const fileTypeOption = [
    { label: "Theme", value: "THEME" },
    { label: "Break Bell", value: "SOUNDDONE" },
    { label: "Working Sound", value: "SOUNDCONCENTRATION" },
  ];

  const sortTypeList = [
    { label: "Descending", value: "DESC" },
    { label: "Ascending", value: "ASC" },
  ];

  const fetchData = async (page) => {
    try {
      const params = {
        page,
        size,
        fileType,
        fieldSort,
        sortType,
      };

      const response = await GetAllSystemFile(params);

      if (response?.success) {
        setFileList(response.data);
        setTotalPage(response.totalPage || 0);
        setError(null);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page, fileType, fieldSort, sortType]);

  const handleChangeType = (type) => {
    setSortType(type);
  };

  const handleFieldSortChange = (field) => {
    setFieldSort(field);
  };

  const handleDelete = (file) => {
    setFileDelete(file);
    setMessage("Do you wanna delete this item?");
  };

  const confirmDelete = async () => {
    try {
      setMessage("");
      const response = await DeleteSystemFile(fileType, fileDelete.id);
      if (response.success) {
        setPage(0);
        fetchData(0);
      } else {
        setError(response.message);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };
  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const handleNavigate = (id) => {
    navigate(`/files/update/${fileType}/${id}`);
  };

  const getTableHeaders = () => {
    if (fileType === "THEME") {
      return (
        <>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
            ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
            Name Theme
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
            Status Theme
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
            Created Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
            Actions
          </th>
        </>
      );
    }
    return (
      <>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          ID
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Name Sound
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Status Sound
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Created Date
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
          Actions
        </th>
      </>
    );
  };

  const getTableRow = (file) => {
    if (fileType === "THEME") {
      return (
        <>
          <td className="px-6 py-4 whitespace-nowrap">{file.id}</td>
          <td className="px-6 py-4 whitespace-nowrap">{file.nameTheme}</td>
          <td className="px-6 py-4 whitespace-nowrap">{file.statusTheme}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            {new Date(file.createdDate).toLocaleDateString()}
          </td>
        </>
      );
    }
    return (
      <>
        <td className="px-6 py-4 whitespace-nowrap">{file.id}</td>
        <td className="px-6 py-4 whitespace-nowrap">{file.nameSound}</td>
        <td className="px-6 py-4 whitespace-nowrap">{file.statusSound}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          {new Date(file.createdDate).toLocaleDateString()}
        </td>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      {message && (
        <MessageBox
          message={message}
          submit={confirmDelete}
          cancel={() => setMessage(null)}
        />
      )}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <div className="flex flex-row justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              File Type:
            </label>
            <select
              onChange={handleFileTypeChange}
              value={fileType}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {fileTypeOption.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort By:
            </label>
            <div className="flex space-x-2">
              <select
                onChange={(e) => handleFieldSortChange(e.target.value)}
                value={fieldSort}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {fileType === "THEME" ? (
                  <>
                    <option value="id">ID</option>
                    <option value="nameTheme">Name Theme</option>
                    <option value="statusTheme">Status Theme</option>
                    <option value="createdDate">Created Date</option>
                  </>
                ) : (
                  <>
                    <option value="id">ID</option>
                    <option value="nameSound">Name Sound</option>
                    <option value="statusSound">Status Sound</option>
                    <option value="createdDate">Created Date</option>
                  </>
                )}
              </select>
              <select
                onChange={(e) => handleChangeType(e.target.value)}
                value={sortType}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {sortTypeList.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <Link
            type="button"
           to='/files/create'
            className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Create new System file
          </Link>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200 shadow-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>{getTableHeaders()}</tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {fileList.map((file) => (
            <tr
              key={file.id}
              className="hover:bg-gray-200 dark:hover:bg-gray-900 cursor-pointer"
              onClick={() => handleNavigate(file.id)}
            >
              {getTableRow(file)}
              <td
                className="px-6 py-4 whitespace-nowrap flex"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                  onClick={() => handleDelete(file)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-700 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          {totalPage === 0 ? "Page 0/0" : `Page ${page + 1}/${totalPage}`}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPage - 1))}
          disabled={page === totalPage - 1 || totalPage === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded-md dark:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StatisticSystemFile;
