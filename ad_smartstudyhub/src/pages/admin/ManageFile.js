import StatisticSystemFile from "~/components/StatisticSystemFile";
import StatisticUserUploadFile from "~/components/StatisticUserUploadFile";

const { default: ManageAllFile } = require("./ManageAllFile");

const ManageFile = () => {
  return (
    <div className="z-10">
      <div className="dark:border-[#2E3A47] dark:bg-gray-800 rounded-lg bg-white dark:text-white">
        <div className="flex justify-center items-center py-12 text-4xl">
          <h1>Statistics Of Users Uploaded Files</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 mb-8 flex flex-col lg:flex-row">
          <ManageAllFile />
          <div className="container mx-auto w-full lg:w-[55%] dark:bg-gray-800 dark:text-white">
            <div className="flex justify-center items-center">
              <StatisticUserUploadFile />
            </div>
          </div>
        </div>
      </div>
      <div className="z-10 mt-8">
        <div className="dark:border-[#2E3A47] dark:bg-gray-800 rounded-lg bg-white dark:text-white">
          <div className="flex justify-center items-center py-12 text-4xl">
            <h1>Statistics Of System Files</h1>
          </div>
          <div className="bg-white dark:bg-gray-800 mb-8 flex justify-center">
            <StatisticSystemFile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFile;
