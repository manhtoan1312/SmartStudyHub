import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { format } from 'date-fns';
import { StatisticUserRegisterByDate, StatisticUserRegisterByMonth } from "~/services/StatisticService";

import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const UserRegistrationChart = () => {
  const [chartData, setChartData] = useState({
    dates: [],
    totalUsers: [],
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Total Users",
          data: [],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(new Date(currentYear, 0, 1).getTime());
  const [endDate, setEndDate] = useState(new Date(currentYear, 11, 31).getTime());

  const handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
    setStartDate(new Date(year, 0, 1).getTime());
    setEndDate(new Date(year, 11, 31).getTime());
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StatisticUserRegisterByMonth(startDate, endDate);
        if (response.success) {
          const startTimestamp = response.data.length > 0 ? response.data[0].dateFrom : new Date().getTime();
          setStartDate(startTimestamp);
          const dates = response.data.map(data => format(new Date(data.dateFrom), 'yyyy-MM-dd'));
          const totalUsers = response.data.map(data => data.totalUsers);
          const chartData = {
            labels: dates,
            datasets: [
              {
                label: "Total Users",
                data: totalUsers,
                fill: false,
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1
              }
            ]
          };
          setChartData({
            dates,
            totalUsers,
            chartData,
            options: chartData.options
          });
        } else {
          console.error("Failed to fetch registration data");
        }
      } catch (error) {
        console.error("Error fetching registration data:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  if (!chartData || !chartData.chartData || chartData.chartData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h2>User Registration Chart in {selectedYear}</h2>
      <div className="flex flex-row items-center">
      <label htmlFor="yearSelect" className="block text-sm px-4 font-medium text-gray-700 dark:text-gray-300">Select Year: </label>
              <input
                type="number"
                id="yearSelect"
                value={selectedYear}
                onChange={handleYearChange}
                min="2000"
                max={new Date().getFullYear()}
                className="mt-1 block w-full p-2 border border-gray-300 max-w-32 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              />
      </div>
      <Line data={chartData.chartData} options={chartData.options} />
    </div>
  );
};

export default UserRegistrationChart;
