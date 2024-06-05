import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "~/Assets/images/login_background.jpg";
import { checkEmail } from "~/services/AuthService";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate()

  const handleSendEmail = async (e) => {
    e.preventDefault();
    const response = await checkEmail(email) 
    console.log(response)
    if(response.success){
      const decodedEmail = decodeURIComponent(email); 
      const queryParams = new URLSearchParams({ email: decodedEmail }).toString();
      navigate(`/change-password?${queryParams}`);
    }
    else{
      setErrorMessage(response.message)
      setEmail('')
      document.querySelector('#email')
    }
  }
  return (
    <div
      className="h-screen font-sans bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto h-full flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <form className="max-w-sm m-4 p-10 bg-white bg-opacity-25 rounded shadow-xl" onSubmit={handleSendEmail}>
              <p className="text-center text-orange-500 md:text-2xl text-lg font-bold pb-4">FORGOT PASSWORD</p>
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
              {errorMessage && (
                <div className="text-red-500 font-medium text-base">{errorMessage}</div>
              )}  
              <Link to='/' className="text-white font-medium">
                Just remember? Back to login page
                </Link>
              <div className="mt-4 items-center flex justify-center">
                <button
                  className="p-4 py-1 text-white font-semibold tracking-wider bg-gray-900 hover:bg-gray-800 rounded"
                  type="submit"
                >
                  Get OTP
                </button>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
