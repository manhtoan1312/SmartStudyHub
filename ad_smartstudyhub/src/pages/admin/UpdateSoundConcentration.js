import React, { useState, useEffect } from "react";
import {Link, useNavigate, useParams } from "react-router-dom";
import { CreateOrUpdateFile, GetDetailSystemFile, uploadSystemFile } from "~/services/FileService";
import Alert from "@mui/material/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
const UpdateSoundConcentration = () => {
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "SOUNDCONCENTRATION",
    status: "",
    url: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFileDetails = async () => {
      try {
        const response = await GetDetailSystemFile("SOUNDCONCENTRATION",id);
        if (response.success) {
            setFormData({
                name: response.data.nameSound,
                type: "SOUNDCONCENTRATION",
                status: response.data.statusSound,
                url: response.data.url,
              });
        } else {
          setError(response.message);
          setSeverity("error");
        }
      } catch (err) {
        setError(err.message);
        setSeverity("error");
      }
    };

    fetchFileDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.url) {
        URL.revokeObjectURL(formData.url);
      }
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, url: fileUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = formData.url;
      if (selectedFile) {
        const result = await uploadSystemFile(
          selectedFile,
          formData.type,
          formData.status
        );
        if (result.success) {
          fileUrl = result.data;
        } else {
          setError(result.message);
          setSeverity("error");
          return;
        }
      }

      const response = await CreateOrUpdateFile(
        id,
        formData.name,
        formData.type,
        formData.status,
        fileUrl
      );

      if (response.success) {
        navigate("/files");
      } else {
        setError(response.message);
        setSeverity("error");
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
      <h2 className="text-2xl font-bold mb-4 text-center">Update Sound Concentration</h2>
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
            Sound:
          </label>
          <div className="mt-2 flex flex-col items-center">
            {formData.url && (
              <audio key={formData.url} controls className="w-full mt-2">
                <source src={formData.url} />
                Your browser does not support the audio element.
              </audio>
            )}
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-400 dark:hover:bg-orange-500 text-white px-8 py-2 mt-4 rounded w-full"
        >
          Update Sound
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

export default UpdateSoundConcentration;
