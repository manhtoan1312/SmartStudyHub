import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import backgroundImage from "~/Assets/images/login_background.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { forgotPassword, resendOTP } from "~/services/AuthService";
import ToastMessage from "~/components/ToastMessage";

function ChangePassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hide, setHide] = useState(true);
  const [reHide, setHideRe] = useState(true);
  const [count, setCount] = useState(0);
  const [otpCode, setOtpCode] = useState("");
  const [type, setType] = useState("");
  const [otp, setOtp] = useState(0);
  const [otpTimeExpiration, setOtpTimeExpiration] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const encodedEmail = searchParams.get("email");
    if (encodedEmail) {
      const decodedEmail = decodeURIComponent(encodedEmail);
      setEmail(decodedEmail);
      
    }
  }, [location.search]);

  useEffect(() => {
    if(email){
      sendOTP();
    }
  },[email])
  useEffect(() => {
    if (count > 0) {
      const timer = setInterval(() => {
        setCount((prevCount) => prevCount - 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [count]);

  const sendOTP = async () => {
    if (count === 0) {
      const response = await resendOTP(email);
      if (!response.success) {
        setErrorMessage(response.message);
        setType("ERROR");
      } else {
        setType('SUCCESS')
        setErrorMessage('OTP code was sent, please check in your email')
        setCount("60");
        setOtp(response.data.otpCode);
        setOtpTimeExpiration(response.data.otpTimeExpiration);
        console.log(response.data.otpCode)
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password === rePassword) {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\s).{8,20}$/;
      const isValidPassword = regex.test(password);
      if (isValidPassword) {
        const currentTime = new Date().getTime();
        if (otp === otpCode && otpTimeExpiration > currentTime) {
          const rs = await forgotPassword(email, password, otpCode);
          if (rs.success) {
            setType("SUCCESS");
          } else {
            setType("ERROR");
          }
          setPassword("");
          setRePassword("");
          setOtpCode("");
          setOtp(0)
          setOtpTimeExpiration(0)
          setErrorMessage(rs.message);
        }else{
          setType("ERROR");
          setErrorMessage('Incorrect or expired token.')
        }
      } else {
        setType("ERROR");
        setErrorMessage(
          "Password must be between 8 and 20 characters, include at least 1 letter and 1 number and do not include spaces."
        );
      }
    } else {
      setType("ERROR");
      setErrorMessage("Passwords are not the same");
    }
  };
  const handleClose = () => {
    setErrorMessage("");
  };
  return (
    <div
      className="h-screen font-sans bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {errorMessage && (
        <ToastMessage type={type} message={errorMessage} hide={handleClose} />
      )}
      <div className="container mx-auto h-full flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form
              className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl"
              onSubmit={handleChangePassword}
            >
              <p className="text-center text-orange-500 md:text-2xl text-lg font-bold pb-4">
                CHANGE YOUR PASSWORD
              </p>
              <div className="">
                <label className="block text-sm text-white" htmlFor="otp">
                  Otp Code
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type="number"
                  id="otp"
                  placeholder="Enter otp code"
                  aria-label="otp"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <div className="mt-2 relative">
                <label className="block text-sm text-white">Password</label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type={hide ? "password" : "text"}
                  id="password"
                  placeholder="Enter new password"
                  aria-label="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-7 right-0 flex items-center pr-3 cursor-pointer text-white"
                  onClick={() => setHide((pre) => !pre)}
                >
                  {hide ? (
                    <FontAwesomeIcon icon={faEyeSlash} color="gray" />
                  ) : (
                    <FontAwesomeIcon color="gray" icon={faEye} />
                  )}
                </span>
              </div>
              <div className="mt-2 relative">
                <label className="block text-sm text-white">
                  Re Enter Password
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type={reHide ? "password" : "text"}
                  id="re-password"
                  placeholder="Re-Enter new password"
                  aria-label="re-password"
                  required
                  value={rePassword}
                  onChange={(e) => setRePassword(e.target.value)}
                />
                <span
                  className="absolute top-7 right-0 flex items-center pr-3 cursor-pointer text-white"
                  onClick={() => setHideRe((pre) => !pre)}
                >
                  {reHide ? (
                    <FontAwesomeIcon icon={faEyeSlash} color="gray" />
                  ) : (
                    <FontAwesomeIcon color="gray" icon={faEye} />
                  )}
                </span>
              </div>
              
              <div
                onClick={sendOTP}
                className={` flex pt-2 ${
                  count === 0
                    ? "text-[#0072B2] cursor-pointer"
                    : "text-[#8aabbe] cursor-default"
                }`}
              >
                Haven't received email yet? Send again
                {count === 0 ? "" : `(${count})`}
              </div>
              <Link to="/" className="text-white font-medium">
                Don't wanna change? Go Back
              </Link>
              <div className="mt-4 items-center flex justify-center">
                <button
                  className="p-4 py-1 text-white font-semibold tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                  type="submit"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
