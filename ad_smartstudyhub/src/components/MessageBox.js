import { useState } from "react";
export default function MessageBox({ message, submit, cancel }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleCancel = () => {
    setIsVisible(false);
    cancel();
  };

  const handleSubmit = () => {
    setIsVisible(false);
    submit();
  };
  return (
    <>
      {isVisible && (
        <div  className="absolute top-0 bottom-0 left-0 right-0 h-screen w-screen items-center justify-center">
          <div className="absolute bg-gray-400 opacity-30 top-0 bottom-0 left-0 right-0" onClick={handleCancel}></div>
          <div className=" bg-white rounded-xl justify-center flex flex-col items-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] ">
            <div className=" flex items-center justify-center mt-[-20px] px-20">
              <h2 className="text-white text-xl p-4 flex items-center justify-center bg-orange-500 w-[300px] rounded-2xl font-bold">
                Smart Study Hub Announce
              </h2>
            </div>
            <h2 className="mt-[30px] mb-[10px] text-[38px] mx-10 text-black font-extralight">
              {message}
            </h2>
            <div className="flex justify-between pb-10 pt-4">
              <button
                type="button"
                className="text-orange-400 w-32 py-2.5 mr-20 text-lg hover:text-white border border-orange-400 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-orange-300 dark:text-orange-300 dark:hover:text-white dark:hover:bg-orange-400 dark:focus:ring-orange-900"
                onClick={handleSubmit}
              >
                OK
              </button>
              <button
                type="button"
                className="text-red-400 w-32 py-2.5 text-lg hover:text-white border border-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center me-2 mb-2 dark:border-red-300 dark:text-red-300 dark:hover:text-white dark:hover:bg-red-400 dark:focus:ring-red-900"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
