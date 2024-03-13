import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './analytic.css'
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';

const AnalyticData = () => {
  const chartRef = useRef([]);
  const [uptime, setUptime] = useState("Loading...");

// eslint-disable-next-line
  const fetchDataAndUpdateCharts = async (csvFilePath) => {
    try {
      const response = await axios.get('http://localhost:3001/analytics');
      const jsonData = response.data;
      updateChart('soilChart', 'Soil_Moisture', 'Soil Moisture', 'rgba(105, 89, 62, 1)', jsonData);
      updateChart('temperatureChart', 'Temperature', 'Temperature', 'rgba(255, 99, 132, 1)', jsonData);
      updateChart('humidityChart', 'Humidity', 'Humidity', 'rgba(255, 99, 71, 1)', jsonData);
      updateChart('nitrogenChart', 'Nitrogen', 'Nitrogen', 'rgba(30, 144, 255, 1)', jsonData);
      updateChart('phosphorousChart', 'Phosphorus', 'Phosphorus', 'rgba(255, 215, 0, 1)', jsonData);
      updateChart('potassiumChart', 'Potassium', 'Potassium', 'rgba(128, 0, 128, 1)', jsonData);
      updateChart('waterDispensedChart', 'Water_Dispensed', 'Water Dispensed', 'rgba(75, 192, 192, 1)', jsonData);
    } catch (error) {
      console.error('Error fetching or processing data:', error);
    }
  };
  useEffect(() => {
    const csvFilePath = 'data.csv';
    fetchDataAndUpdateCharts(csvFilePath);

    const intervalId = setInterval(() => {
      fetchDataAndUpdateCharts(csvFilePath);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchDataAndUpdateCharts]);

  const updateChart = (containerId, dataKey, yAxisLabel, color, jsonData) => {
    let data = [];
    let labels = [];
    let startIndex = Math.max(0, jsonData.length - 15);

    for (let i = startIndex; i < jsonData.length; i++) {
      let value = parseFloat(jsonData[i][dataKey]);
      data.push(value);
      labels.push(i + 1);
    }

    const canvas = document.getElementById(containerId);
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (chartRef.current[containerId]) {
        chartRef.current[containerId].destroy();
      }

      chartRef.current[containerId] = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              fill: false,
              borderColor: color,
              borderWidth: 2,
              pointBackgroundColor: color,
              pointRadius: 4,
              pointHoverRadius: 5,
              label: yAxisLabel,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                stepSize: 5,
                min: 0,
                max: 100,
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: {
                  size: 20,
                },
              },
            },
          },
        },
      });
    }
  };
  
  const fetchUptime = async () => {
    try {
      const response = await axios.get('http://localhost:3001/uptime');
      const uptimestr = response.data;
      setUptime(uptimestr);
    } catch (error) {
      console.error('Error fetching uptime:', error);
      setUptime('Error');
    }
  };
  
  useEffect(() => {
    const uptimeIntervalId = setInterval(() => {
      fetchUptime();
    }, 1000); // Refresh uptime every 1 second

    return () => {
      clearInterval(uptimeIntervalId);
    };
  }, []);

  return (
    <div className='analytic-wrapper'>
      <div className='nav-holder1'>
        <div className='fixed-content'>
          <h1><Link to='/'>AquaAI</Link></h1>
          <ul>
            <li><Link to='/'><TbGridDots />Dashboard</Link></li>
            <li><Link to='/analytics'><TbDeviceAnalytics />Analytics</Link></li>
            <li><Link to='/system-settings'><MdOutlineAppSettingsAlt />System Settings</Link></li>
            <li><Link to='/wifi-settings'><FaWifi />Wifi Settings</Link></li>
          </ul>
          <h2 className='sys-up'><FaGlobe />Uptime: {uptime}</h2>
        </div>
      </div>
      <div className='analytic-cover'>
        <div className='analytic-cont'>
          <h1>Analytics:</h1>
          <div className='chart-container'>
            <canvas id='soilChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='temperatureChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='humidityChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='nitrogenChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='phosphorousChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='potassiumChart'></canvas>
          </div>
          <div className='chart-container'>
            <canvas id='waterDispensedChart'></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticData;
