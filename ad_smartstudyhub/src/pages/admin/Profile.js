import { Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import uploadFile from "~/services/FileService";

const { useState, useEffect } = require("react");
const { getUserInfor, updateInformation } = require("~/services/UserService");

const Profile = () => {
  const [infor, setInfor] = useState(null);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await getUserInfor();
      if (response.success) {
        console.log(response.data);
        setInfor(response.data);
        localStorage.setItem('image', JSON.stringify(response.data.imageUrl))
      } else {
        setSeverity("error");
        setMessage(response.message);
        setTimeout(() => {
          setMessage("");
          setSeverity("");
        }, 4000);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateInformation(
      infor?.phoneNumber,
      infor?.firstName,
      infor?.lastName,
      infor?.address,
      infor?.dateOfBirth,
      "VietNam",
      infor?.imageUrl,
      infor?.isTwoFactor
    );
    if (response.success) {
        localStorage.setItem('image', JSON.stringify(infor.imageUrl))
        localStorage.setItem('User', `${infor?.firstName} ${infor?.lastName}`)
      navigate("/dashboard");
      setInfor(response.data);
      setMessage("Information updated successfully!");
      setSeverity("success");
    } else {
      setMessage(response.message);
      setSeverity("error");
    }
    setTimeout(() => {
      setMessage("");
      setSeverity("");
    }, 4000);
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadFile(file, "USER");
      if (imageUrl.success) {
        console.log(imageUrl)
        setInfor((prevState) => ({
          ...prevState,
          imageUrl: imageUrl.data,
        }));
      } else {
        setMessage(imageUrl.message);
        setSeverity("error");
        setTimeout(() => {
          setMessage("");
          setSeverity("");
        }, 4000);
      }
    }
  };

  const handleDeleteImage = async () => {
    setInfor((prevState) => ({
      ...prevState,
      imageUrl:
        "https://res.cloudinary.com/dnj5purhu/image/upload/v1701175788/SmartStudyHub/USER/default-avatar_c2ruot.png",
    }));
  };

  return (
    <div className="container mx-auto mt-10 bg-white dark:bg-gray-800">
      {severity && (
        <Alert severity={severity} onClose={() => setSeverity("")}>
          {message}
        </Alert>
      )}
      {infor?.imageUrl && (
        <div className="p-10">
          <div className="flex justify-center items-center mb-5">
            <h1 className="text-4xl text-gray-600 dark:text-white">
              ADMIN PROFILE
            </h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center items-center flex-col">
              <img
                className="h-40 w-40 rounded-[80px]"
                src={infor?.imageUrl}
                alt="avatar"
              />
              <div className="flex-row pt-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChangeImage}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  {infor.imageUrl ? "Change Image" : "Upload Image"}
                </label>
                <button
                  onClick={handleDeleteImage}
                  type="button"
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Delete Image
                </button>
              </div>
              <div className="flex justify-center flex-col items-center pt-8 dark:text-white">
                <h2 className="dark:text-white">{infor?.email}</h2>
                <input
                  type="text"
                  name="firstName"
                  value={infor?.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="input- my-2 rounded-lg dark:text-gray-600"
                />
                <input
                  type="text"
                  name="lastName"
                  value={infor?.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="input- my-2 rounded-lg dark:text-gray-600"
                />

                <input
                  type="text"
                  name="phoneNumber"
                  value={infor?.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="input-field my-2 rounded-lg dark:text-gray-600"
                />
                <input
                  type="text"
                  name="address"
                  value={infor?.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="input- my-2 rounded-lg dark:text-gray-600"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
