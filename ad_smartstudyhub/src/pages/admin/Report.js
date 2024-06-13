import { useNavigate } from "react-router-dom";

const { useState, useEffect } = require("react");
const { GetAllReport, UpdateReport } = require("~/services/ReportService");

const Report = () => {
  const [reportList, setReportList] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [totalReports, setTotalReports] = useState(0);
  const navigation = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const response = await GetAllReport(page, size);
      if (response.success) {
        setReportList(response.data.data);
        setTotalReports(response.data.extendProp.totalReports); 
      }
    };
    fetchData();
  }, [page]);

  const totalPages = Math.ceil(totalReports / size);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleClickReport = async (report) => {
    if (report.statusReport === "NOT SEEN") {
      const response = await UpdateReport(report.id);
      if (!response.success) {
        console.log(response.message);
      }
    }
    navigation(`/report/${report.id}`);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white dark:bg-[#24303F] dark:border-[#2E3A47] px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Report
      </h4>
      {reportList.length === 0 ? (
        <div className="flex justify-center items-center pb-10">
          <h2 className="text-4xl pl-10">No Report</h2>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Phone Number
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Type Report
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider"
                >
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reportList.map((report) => (
                <tr
                  onClick={() => handleClickReport(report)}
                  key={report.id}
                  className={`${
                    report.statusReport === "NOT SEEN"
                      ? "bg-orange-100 dark:bg-orange-800"
                      : ""
                  } hover:bg-gray-100 dark:hover:bg-gray-700`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.descriptionDetail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {report.typeReport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {new Date(report.createdDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {Math.min(page + 1,totalPages)} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          onClick={() => handlePageChange(page + 1)}
          disabled={page + 1 >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Report;
