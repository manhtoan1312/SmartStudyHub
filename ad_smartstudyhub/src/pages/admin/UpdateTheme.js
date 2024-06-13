import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CreateOrUpdateFile,
  GetDetailSystemFile,
  uploadFile,
  uploadSystemFile,
} from "~/services/FileService";
import Alert from "@mui/material/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const UpdateTheme = () => {
  const { id } = useParams();
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "THEME",
    status: "DEFAULT",
    url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetDetailSystemFile("THEME", id);
      if (response.success) {
        setFormData({
          name: response.data.nameTheme,
          type: "THEME",
          status: response.data.statusTheme,
          url: response.data.url,
        });
      } else {
        setError(response.message);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, url: imageUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const result = await uploadSystemFile(
          selectedFile,
          "THEME",
          formData.status
        );
        if (result.success) {
          const response = await CreateOrUpdateFile(
            id,
            formData.name,
            formData.type,
            formData.status,
            result.data
          );
          if (response.success) {
            navigate("/files");
          } else {
            setError(response.message);
            setSeverity("error");
          }
        } else {
          setError(result.message);
          setSeverity("error");
        }
      } else {
        const response = await CreateOrUpdateFile(
          id,
          formData.name,
          formData.type,
          formData.status,  
          formData.url
        );
        if (response.success) {
          navigate("/files");
        } else {
          setError(response.message);
          setSeverity("error");
        }
      }
    } catch (err) {
      setError(err.message);
      setSeverity("error");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl bg-white rounded-md shadow-md">
       <Link to={"/files"} className="text-[20px]">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
      <h2 className="text-2xl font-bold mb-4 text-center">Update Theme</h2>
      {severity && (
        <Alert severity={severity} onClose={() => setSeverity("")}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
     
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="name"
            id="floating_name"
            value={formData.name}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="type"
            id="floating_type"
            value={formData.type}
            readOnly
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
          />
          <label
            htmlFor="floating_type"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Type: {formData.type}
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <select
            name="status"
            id="floating_status"
            value={formData.status}
            onChange={handleChange}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            required
          >
            <option value="DEFAULT">DEFAULT</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
          <label
            htmlFor="floating_status"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Status
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image:
          </label>
          <div className="mt-2 flex flex-col items-center">
            <img
              src={formData.url}
              alt="Theme"
              className="w-full h-full object-cover rounded-md border border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white px-8 py-2 mt-4 rounded w-full"
        >
          Update Theme
        </button>
      </form>
      {severity && (
        <div
          className={`mt-4 p-4 rounded-md ${
            severity === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {severity === "success" ? "Update successful!" : "Update failed."}
        </div>
      )}
    </div>
  );
};

export default UpdateTheme;
