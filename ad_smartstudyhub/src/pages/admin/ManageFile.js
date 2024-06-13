import StatisticSystemFile from "~/components/StatisticSystemFile";
import StatisticUserUploadFile from "~/components/StatisticUserUploadFile";

const { default: ManageAllFile } = require("./ManageAllFile");

const ManageFile = () => {
  return (
    <div className="z-10">
      <div className="dark:border-[#2E3A47] dark:bg-gray-800 rounded-lg bg-white">
        <div className="flex justify-center items-center py-12 text-4xl">
          <h1>Statistics Of Users Uploaded Files</h1>
        </div>
        <div className="bg-white mb-8 flex flex-row ">
          <ManageAllFile />

          <div className="container mx-auto w-[55%] dark:bg-gray-800 dark:text-white">
            <div className="justify-center items-center flex">
              <StatisticUserUploadFile />
            </div>
          </div>
        </div>
      </div>
      <div className="z-10">
        <div className="dark:border-[#2E3A47] dark:bg-gray-800 rounded-lg bg-white">
          <div className="flex justify-center items-center py-12 text-4xl">
            <h1>Statistics Of System Files</h1>
          </div>
          <div className="bg-white mb-8 flex flex-row ">
            <StatisticSystemFile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFile;
