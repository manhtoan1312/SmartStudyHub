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

  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).getTime());
  const [endDate, setEndDate] = useState(new Date().getTime());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await StatisticUserRegisterByMonth(startDate, endDate);
        // const response2 = await StatisticUserRegisterByDate(from, to)
        if (response.success) {
          const startTimestamp = response.data.length > 0 ? response.data[0].dateFrom : new Date().getTime();
          setStartDate(startTimestamp);
          const dates = response.data.map(data => format(new Date(data.dateFrom), 'yyyy-MM-dd'));
          const totalUsers = response.data.map(data => data.totalUsers);
          console.log(totalUsers)
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
  }, [endDate]);

  if (!chartData || !chartData.chartData || chartData.chartData.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <h2>User Registration Chart</h2>
      <Line data={chartData.chartData} options={chartData.options} />
    </div>
  );
};

export default UserRegistrationChart;
