import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "~/Assets/images/login_background.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { login } from "~/services/AuthService";
import { useAuth } from "~/hooks/AuthContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [hide, setHide] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setHide((prevHide) => !prevHide);
  };

  const handleRemember = () => {
    setRemember((pre) => !pre);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      contextLogin(remember,response.image, response.token);
      navigate("/dashboard");
    } else {
      setErrorMessage(response.message);
      setEmail("");
      setPassword("");
      document.querySelector("#email").focus();
    }
  };
  return (
    <div
      className="h-screen font-sans bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto h-full flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form
              className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl"
              onSubmit={handleLogin}
            >
              <p className="text-center text-orange-500 md:text-2xl text-lg font-bold pb-4">
                SMART STUDY HUB
              </p>
              <div className="">
                <label className="block text-sm text-white" htmlFor="email">
                  E-mail
                </label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type="email"
                  id="email"
                  placeholder="Enter your e-mail"
                  aria-label="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mt-2 relative">
                <label className="block text-sm text-white">Password</label>
                <input
                  className="w-full px-5 py-1 text-gray-700 bg-gray-300 rounded focus:outline-none focus:bg-white"
                  type={hide ? "password" : "text"}
                  id="password"
                  placeholder="Enter your password"
                  aria-label="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-7 right-0 flex items-center pr-3 cursor-pointer text-white"
                  onClick={togglePasswordVisibility}
                >
                  {hide ? (
                    <FontAwesomeIcon icon={faEyeSlash} color="gray" />
                  ) : (
                    <FontAwesomeIcon color="gray" icon={faEye} />
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between w-full mt-4">
                <div className="">
                  <input
                    checked={remember}
                    id="remember"
                    type="checkbox"
                    onChange={handleRemember}
                    className="w-4 h-4 text-teal-600 hover:cursor-pointer bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 font-bold text-sm text-500 cursor-pointer hover:text-green-400 text-white "
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  className="inline-block right-0 align-baseline font-bold text-sm text-500 text-white hover:text-red-400"
                  to={"/forgot-password"}
                >
                  Forgot Password?
                </Link>
              </div>
              {errorMessage && (
                <div className="text-red-500 font-medium text-base">{errorMessage}</div>
              )}
              <div className="mt-4 items-center flex justify-center">
                <button
                  className="p-4 py-1 text-white font-light tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
