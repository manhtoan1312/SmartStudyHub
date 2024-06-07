import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { statisticalRevenue } from "~/services/RevenueService";

const Revenue = () => {
  const currentYear = new Date().getFullYear();
  const [selectedType, setSelectedType] = useState("MONTH");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await statisticalRevenue(selectedType, selectedYear, selectedMonth);
        if (response.success) {
          setChartData(response.data);
        } else {
          console.error("Failed to fetch revenue data");
        }
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchData();
  }, [selectedType, selectedYear, selectedMonth]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value, 10));
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(parseInt(event.target.value, 10));
  };

  const generateMonthlyLabels = (year) => {
    const labels = [];
    for (let month = 0; month < 12; month++) {
      labels.push(new Date(year, month, 1));
    }
    return labels;
  };

  const generateDailyLabels = (year, month) => {
    const labels = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day += 3) {
      labels.push(new Date(year, month - 1, day));
    }
    return labels;
  };

  const formatDataForChart = () => {
    if (!chartData) return { labels: [], datasets: [] };

    let labels;
    if (selectedType === "ALL") {
      labels = generateMonthlyLabels(selectedYear);
    } else {
      labels = generateDailyLabels(selectedYear, selectedMonth);
    }

    const data = labels.map(label => {
      const entry = chartData.find(entry => new Date(entry.firstDateOfMonthOrDateInMonth).getTime() === label.getTime());
      return entry ? entry.totalRevenue : 0;
    });

    return {
      labels,
      datasets: [
        {
          label: "Total Revenue",
          data,
          fill: false,
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          tension: 0.1,
        },
      ],
    };
  };

  const data = formatDataForChart();
  console.log("Chart Data:", data);

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label
            htmlFor="typeSelect"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Select Type:
          </label>
          <select
            id="typeSelect"
            value={selectedType}
            onChange={handleTypeChange}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          >
            <option value="ALL">Year</option>
            <option value="MONTH">Month</option>
          </select>
        </div>

        {selectedType === "MONTH" && (
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
              value={selectedMonth}
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
            value={selectedYear}
            onChange={handleYearChange}
            min="2000"
            max={new Date().getFullYear()}
            className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Line
          data={data}
          options={{
            scales: {
              x: {
                type: "time",
                time: {
                  unit: selectedType === "ALL" ? "month" : "day",
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
  );
};

export default Revenue;
