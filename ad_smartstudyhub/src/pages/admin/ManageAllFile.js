import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faEllipsisV,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DeleteFile,
  GetAllFileUploadByUser,
  StatisticalFile,
} from "~/services/FileService";
import Alert from "@mui/material/Alert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Modal } from "@mui/material";
import MessageBox from "~/components/MessageBox";

const getStartOfYear = () => {
  const now = new Date();
  return new Date(now.getFullYear(), 0, 1);
};

const ManageAllFile = () => {
  const [fileList, setFileList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(0);
  const [userId, setUserId] = useState(null);
  const [startDate, setStartDate] = useState(getStartOfYear());
  const [endDate, setEndDate] = useState(new Date());
  const [fileType, setFileType] = useState(null);
  const [fieldSort, setFieldSort] = useState(null);
  const [sortType, setSortType] = useState("ASC");
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [anchorElMap, setAnchorElMap] = useState({});
  const [fileDelete, setFileDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const fileTypeOption = [
    { label: "All", value: "null" },
    { label: "Theme", value: "THEME" },
    { label: "Break Bell", value: "SOUNDDONE" },
    { label: "Working Sound", value: "SOUNDCONCENTRATION" },
    { label: "Avatar", value: "USER" },
    { label: "Cover Image", value: "COVERIMAGE" },
  ];

  const sortTypeList = [
    { label: "None", value: "null" },
    { label: "Descending", value: "DESC" },
    { label: "Ascending", value: "ASC" },
  ];

  const fetchData = async (page) => {
    try {
      const params = {
        page,
        size: 10,
        userId,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        fileType,
        fieldSort,
      };

      if (fieldSort) {
        params.sortType = sortType;
      }

      const response = await GetAllFileUploadByUser(params);

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
    fetchData(0);
  }, [page, userId, startDate, endDate, fileType, fieldSort, sortType]);

  const handleChangeType = (type) => {
    setSortType(type);

    if (type === "null") {
      setFieldSort(null);
    }
  };

  const handleFieldSortChange = (field) => {
    if (field === "null") {
      setSortType(null);
      setFieldSort(null);
    } else {
      setFieldSort(field);
    }
  };

  const handleUserIdSelect = (id) => {
    setUserId(id);
  };

  const handleView = (file) => {
    setSelectedFile(file);
    setModalIsOpen(true);
    setAnchorElMap((prev) => ({ ...prev, [file.id]: null }));
  };

  const handleDelete = (fileId) => {
    setFileDelete(fileId);
    setAnchorElMap((prev) => ({ ...prev, [fileId]: null }));
    setMessage("Do you wanna delete this item?");
  };

  const confirmDelete = async () => {
    try {
      setMessage("");
      const response = await DeleteFile(fileDelete);
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
    setFileType(e.target.value === "null" ? null : e.target.value);
  };

  const handleMenuClick = (e, fileId) => {
    e.stopPropagation();
    setAnchorElMap((prev) => ({ ...prev, [fileId]: e.currentTarget }));
  };

  const handleMenuClose = (fileId) => {
    setAnchorElMap((prev) => ({ ...prev, [fileId]: null }));
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date:
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date:
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
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
              onChange={(e) => {
                handleFieldSortChange(e.target.value);
              }}
              value={fieldSort}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="null">None</option>
              <option value="userId">User Id</option>
              <option value="resourceType">Resource Type</option>
              <option value="createdAt">Create Date</option>
            </select>
            <select
              onChange={(e) => {
                handleChangeType(e.target.value);
              }}
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
      {userId && (
        <div className="py-6">
          <div className="px-6" onClick={() => setUserId(null)}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="items-center justify-center flex mt-[-24px]">
            <h1 className="text-2xl">
              Statistics of uploaded files by user id {userId}
            </h1>
          </div>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200 shadow-sm dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              User ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Resource Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200  dark:bg-gray-800 dark:divide-gray-700">
          {fileList.map((file) => (
            <tr
              className="hover:bg-gray-200 dark:hover:bg-gray-900"
              key={file.id}
              onClick={() => handleUserIdSelect(file.userId)}
            >
              <td className="px-6 py-4 whitespace-nowrap">{file.userId}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {file.resourceType}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{file.type}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(file.createdAt).toLocaleDateString()}
              </td>
              <td
                className="px-6 py-4 whitespace-nowrap flex justify-center cursor-pointer"
                onClick={(e) => handleMenuClick(e, file.id)}
              >
                <FontAwesomeIcon icon={faEllipsisV} className="" />
                <Menu
                  id={`simple-menu-${file.id}`}
                  anchorEl={anchorElMap[file.id] || null}
                  keepMounted
                  open={Boolean(anchorElMap[file.id])}
                  onClose={() => handleMenuClose(file.id)}
                >
                  <MenuItem onClick={() => handleDelete(file.id)}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => handleView(file)}>View</MenuItem>
                </Menu>
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
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div
          className="fixed inset-0 flex items-center justify-center"
          onClick={() => setModalIsOpen(false)}
        >
          <div className="bg-white p-4 max-w-lg w-full mx-auto rounded-lg shadow-lg">
            {selectedFile && (
              <div
                className="items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedFile.resourceType === "image" && (
                  <img
                    src={selectedFile.secureUrl}
                    alt="File"
                    className="w-full"
                  />
                )}
                {selectedFile.resourceType === "video" && (
                  <audio controls className="items-center justify-center">
                    <source src={selectedFile.secureUrl} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAllFile;
