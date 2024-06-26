import React, { useEffect, useState } from "react";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AdminUploadFile,
  GetUserDetailById,
  updateUser,
} from "~/services/UserService";
import Alert from "@mui/material/Alert";

const UpdateUserPage = () => {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    role: "CUSTOMER",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
    imageUrl: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [showRoleList, setShowRoleList] = useState(false);
  const navigate = useNavigate();
  const roleList = ["CUSTOMER", "ADMIN", "PREMIUM"];
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectRole = (role) => {
    setUserInfo((prevState) => ({
      ...prevState,
      role: role,
    }));
    setShowRoleList(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const image = await AdminUploadFile(file, "USER", userInfo.id);
      if (image.success) {
        setUserInfo((prevState) => ({
          ...prevState,
          imageUrl: image.data,
        }));
      } else {
        setMessage(image.message);
        setSeverity("Error");
        setTimeout(() => {
          setMessage("");
          setSeverity("");
        }, 4000);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateUser(
      userInfo.id,
      userInfo.userName || null,
      userInfo.firstName,
      userInfo.lastName,
      userInfo.email,
      userInfo.address || null,
      userInfo.phoneNumber || null,
      userInfo.dateOfBirth ? new Date(userInfo.dateOfBirth).getTime() : new Date().getTime(),
      "Viet Nam",
      userInfo.imageUrl,
      userInfo.role
    );
    console.log(response)
    if (response.success) {
      navigate("/dashboard");
    } else {
      setUserInfo({
        userName: "",
        firstName: "",
        lastName: "",
        role: "CUSTOMER",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        imageUrl: "",
        email: "",
      });
      setMessage(response.message);
      setSeverity("error");
      setTimeout(() => {
        setMessage("");
        setSeverity("");
      }, 4000);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await GetUserDetailById(id);
      if (response.success) {
        const user = response.data.data;
        setUserInfo({
          ...user,
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : "",
        });
      } else {
        setMessage(response.message);
        setSeverity("Warning");
        setTimeout(() => {
          setMessage("");
          setSeverity("");
        }, 4000);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="container mx-auto mt-10">
      {severity && (
        <Alert severity={severity} onClose={() => setSeverity("")}>
          {message}
        </Alert>
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-12 pb-8 mb-4 p-12 relative"
      >
        <Link to={"/dashboard"} className="p-8 text-[20px]">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>

        <div className="flex justify-center py-6 ">
          <h1 className="text-4xl text-gray-600 dark:text-white">
            Update User
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={userInfo.firstName}
            onChange={handleChange}
            className="border p-2 dynamic-input dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={userInfo.lastName}
            onChange={handleChange}
            className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            required
            value={userInfo.email}
            onChange={handleChange}
            className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={userInfo.phoneNumber}
            onChange={handleChange}
            className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />

          <input
            type="text"
            placeholder="Address"
            name="address"
            value={userInfo.address}
            onChange={handleChange}
            className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            name="dateOfBirth"
            value={userInfo.dateOfBirth}
            onChange={handleChange}
            className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
          />

          <div className="relative">
            <input
              type="text"
              placeholder="Role"
              name="role"
              value={userInfo.role}
              onFocus={() => setShowRoleList(true)}
              onBlur={() => setTimeout(() => setShowRoleList(false), 200)}
              readOnly
              required
              className="border p-2 dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8"
            />
            {showRoleList && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 shadow-md rounded-xl w-full">
                {roleList.map((role, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSelectRole(role)}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2">
          {userInfo.imageUrl && (
            <img
              src={userInfo.imageUrl}
              alt="Avatar"
              className="mx-8 h-72 w-72 cover-fill"
            />
          )}

          <div className="pt-4 flex flex-row">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="avatar-upload"
            />

            <label
              htmlFor="avatar-upload"
              className="border p-2 dark:bg-gray-800 hover:bg-green-400 dark:hover:bg-green-600 text-gray-600 border-gray-500 dark:border-white dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8 cursor-pointer"
            >
              {userInfo.imageUrl ? "Change Image" : "Upload Image"}
            </label>

            {userInfo.imageUrl && (
              <button
                onClick={() =>
                  setUserInfo((prevState) => ({ ...prevState, imageUrl: "" }))
                }
                className="border p-2 dark:bg-gray-800 text-gray-600 border-gray-500 dark:border-white dark:text-gray-100 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl mx-8 cursor-pointer hover:bg-red-400 dark:hover:bg-red-600"
              >
                Delete Image
              </button>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white px-8 mx-8 py-2 mt-4 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUserPage;
