import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { StatisticalRole } from "~/services/UserService";

const StatisticRole = () => {
  const [type, setType] = useState("YEAR");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Months are 0-indexed
  const [day, setDay] = useState(new Date().getDate());
  const [data, setData] = useState(null);

  const typeOptions = [
    { label: "Year", value: "YEAR" },
    { label: "Month", value: "MONTH" },
    { label: "Day", value: "DAY" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StatisticalRole(type, year, month, day);
        if (response.success) {
          setData(response.data);
        } else {
          console.error("Failed to fetch registration data");
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchData();
  }, [type, year, month, day]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleMonthChange = (event) => {
    setMonth(event.target.value);
  };

  const handleDayChange = (event) => {
    setDay(event.target.value);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const chartData = {
    labels: ["Guest Users", "Registered Users", "Premium Users"],
    datasets: [
      {
        data: [data.totalUsersGuest, data.totalUserRegisterAccount, data.totalUserRegisterPremium],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const totalUsers = data.totalUsersGuest + data.totalUserRegisterAccount + data.totalUserRegisterPremium;

  return (
    <div className="p-4">
      <div className="mb-4 max-w-32">
        <label htmlFor="typeSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Type: </label>
        <select
          id="typeSelect"
          value={type}
          onChange={handleTypeChange}
          className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-row">
          {type === "YEAR" && (
            <div className="mb-4  flex flex-row w-screen items-center">
              <label htmlFor="yearSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Year: </label>
              <input
                type="number"
                id="yearSelect"
                value={year}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear()}
                className="mt-1 block w-full p-2 border max-w-32 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}
    
          {type === "MONTH" && (
            <div className="mb-4 flex flex-row w-screen items-center">
              <label htmlFor="monthSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Month: </label>
              <input
                type="number"
                id="monthSelect"
                value={month}
                onChange={handleMonthChange}
                min="1"
                max="12"
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <label htmlFor="yearSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Year: </label>
              <input
                type="number"
                id="yearSelect"
                value={year}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear()}
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}
    
          {type === "DAY" && (
            <div className="mb-4 flex flex-row w-screen items-center">

              <label htmlFor="daySelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Day: </label>
              <input
                type="number"
                id="daySelect"
                value={day}
                onChange={handleDayChange}
                min="1"
                max="31"
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <label htmlFor="monthSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Month: </label>
              <input
                type="number"
                id="monthSelect"
                value={month}
                onChange={handleMonthChange}
                min="1"
                max="12"
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
              <label htmlFor="yearSelect" className="block text-sm pr-4 font-medium text-gray-700 dark:text-gray-300">Select Year: </label>
              <input
                type="number"
                id="yearSelect"
                value={year}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear()}
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
            </div>
          )}
      </div>

      <div className="max-w-xs mx-auto">
        <Doughnut data={chartData} />
      </div>
      <div className="total-users text-center mt-4">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Total Users: {totalUsers}</h3>
      </div>
    </div>
  );
};

export default StatisticRole;
