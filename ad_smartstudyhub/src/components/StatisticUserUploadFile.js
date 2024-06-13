import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { StatisticalUserUploadFile } from "~/services/FileService";

const StatisticUserUploadFile = () => {
  const currentYear = new Date().getFullYear();
  const [type, setType] = useState("MONTH");
  const [userId, setUserId] = useState(null);
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        userId,
        typeQuery: type,
        year,
        month,
      };
      const response = await StatisticalUserUploadFile(params);
      if (response.success) {
        setData(response.data);
      } else {
        console.error("Error fetching data:", response.message);
      }
    };

    fetchData();
  }, [type, userId, year, month]);

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event) => {
    setMonth(parseInt(event.target.value, 10));
  };

  const handleUserIdChange = (event) => {
    const value = event.target.value;
    setUserId(value ? parseInt(value, 10) : null);
  };

  const generateLabels = () => {
    if (type === "YEAR") {
      return Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
    } else {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from(
        { length: daysInMonth },
        (_, i) => new Date(year, month - 1, i + 1)
      );
    }
  };

  const formatDataForChart = () => {
    const labels = generateLabels();

    const datasets = [
      { label: "Total Themes", dataKey: "totalThemes", borderColor: "#FF6384" },
      {
        label: "Total Sound Dones",
        dataKey: "totalSoundDones",
        borderColor: "#36A2EB",
      },
      {
        label: "Total Sound Concentrations",
        dataKey: "totalSoundConcentrations",
        borderColor: "#FFCE56",
      },
      {
        label: "Total Avatars",
        dataKey: "totalAvatars",
        borderColor: "#4BC0C0",
      },
      {
        label: "Total Cover Images",
        dataKey: "totalCoverImages",
        borderColor: "#9966FF",
      },
      {
        label: "Total Files Uploaded for Report",
        dataKey: "totalFilesUploadedForReport",
        borderColor: "#FF9F40",
      },
      { label: "Total Files", dataKey: "totalFiles", borderColor: "#E7E9ED" },
    ].map((dataset) => ({
      label: dataset.label,
      data: generateLabels().map((label) => {
        const entry = data.find(
          (entry) =>
            new Date(entry.firstDateOfMonthOrDateInMonth).getTime() ===
            label.getTime()
        );
        return entry ? entry[dataset.dataKey] : 0;
      }),
      borderColor: dataset.borderColor,
      backgroundColor: dataset.borderColor,
      fill: false,
      tension: 0.1,
    }));

    return { labels: generateLabels(), datasets };
  };

  const chartData = formatDataForChart();

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="userIdInput"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            User ID:
          </label>
          <input
            type="number"
            id="userIdInput"
            value={userId || ""}
            onChange={handleUserIdChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="typeSelect"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Type:
          </label>
          <select
            id="typeSelect"
            value={type}
            onChange={handleTypeChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="YEAR">Year</option>
            <option value="MONTH">Month</option>
          </select>
        </div>

        {type === "MONTH" && (
          <div className="flex-1">
            <label
              htmlFor="monthSelect"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Select Month:
            </label>
            <input
              type="number"
              id="monthSelect"
              value={month}
              onChange={handleMonthChange}
              min="1"
              max="12"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
        )}

        <div className="flex-1">
          <label
            htmlFor="yearSelect"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Year:
          </label>
          <input
            type="number"
            id="yearSelect"
            value={year}
            onChange={handleYearChange}
            min="2000"
            max={new Date().getFullYear()}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="h-96"> {/* Added height class */}
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  type: "time",
                  time: {
                    unit: type === "YEAR" ? "month" : "day",
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticUserUploadFile;
