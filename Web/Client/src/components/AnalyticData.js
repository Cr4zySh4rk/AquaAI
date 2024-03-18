import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './analytic.css';
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuBrainCircuit } from "react-icons/lu";

const AnalyticData = () => {
  const chartRef = useRef([]);
  const [uptime, setUptime] = useState("Loading...");
  const [selectedRange, setSelectedRange] = useState("Day");
// eslint-disable-next-line
  const fetchDataAndUpdateCharts = async () => {
    try {
      const response = await axios.get('http://192.168.4.1:3001/analytics');
      const jsonData = response.data;
      const numberOfEntries = getNumberOfEntries(selectedRange);
      updateChart('soilChart', 'Soil_Moisture', 'Soil Moisture', 'rgba(105, 89, 62, 1)', jsonData.slice(-numberOfEntries), "%");
      updateChart('temperatureChart', 'Temperature', 'Temperature', 'rgba(255, 99, 132, 1)', jsonData.slice(-numberOfEntries), "°C");
      updateChart('humidityChart', 'Humidity', 'Humidity', 'rgba(255, 99, 71, 1)', jsonData.slice(-numberOfEntries), "%");
      updateChart('nitrogenChart', 'Nitrogen', 'Nitrogen', 'rgba(30, 144, 255, 1)', jsonData.slice(-numberOfEntries), "mg/kg");
      updateChart('phosphorousChart', 'Phosphorus', 'Phosphorus', 'rgba(255, 215, 0, 1)', jsonData.slice(-numberOfEntries), "mg/kg");
      updateChart('potassiumChart', 'Potassium', 'Potassium', 'rgba(128, 0, 128, 1)', jsonData.slice(-numberOfEntries), "mg/kg");
      updateChart('waterDispensedChart', 'Water_Dispensed', 'Water Dispensed', 'rgba(75, 192, 192, 1)', jsonData.slice(-numberOfEntries), "mL");
    } catch (error) {
      console.error('Error fetching or processing data:', error);
    }
  };

  useEffect(() => {
    fetchDataAndUpdateCharts();

    const intervalId = setInterval(() => {
      fetchDataAndUpdateCharts();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchDataAndUpdateCharts]);

  useEffect(() => {
    fetchDataAndUpdateCharts('data.csv');
  }, [selectedRange, fetchDataAndUpdateCharts]);

  const updateChart = (containerId, dataKey, yAxisLabel, color, jsonData, unit) => {
    let data = [];
    let labels = [];

    for (let i = 0; i < jsonData.length; i++) {
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
              title: {
                display: true,
                text: 'Entries', // X-axis label
                font: {
                  size: 16,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: yAxisLabel, // Y-axis label
                font: {
                  size: 16,
                },
              },
              ticks: {
                callback: function (value) {
                  return `${value}${unit}`;
                },
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

  const getNumberOfEntries = (range) => {
    switch (range) {
      case "Day":
        return 15;
      case "Week":
        return 100;
      case "Month":
        return 500;
      default:
        return 15;
    }
  };

  const fetchUptime = async () => {
    try {
      const response = await axios.get('http://192.168.4.1:3001/uptime');
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

  const handleRangeChange = (event) => {
    setSelectedRange(event.target.value);
  };

  return (
    <div className='analytic-wrapper'>
      <div className='nav-holder1'>
        <div className='fixed-content'>
          <h1><Link to='/'>AquaAI</Link></h1>
          <ul>
            <li><Link to='/'><TbGridDots />Dashboard</Link></li>
            <li><Link to='/analytics'><TbDeviceAnalytics />Analytics</Link></li>
            <li><Link to='/ai-recommendations'><LuBrainCircuit />AI Recommendations</Link></li>
            <li><Link to='/system-settings'><MdOutlineAppSettingsAlt />System Settings</Link></li>
            <li><Link to='/wifi-settings'><FaWifi />Wifi Settings</Link></li>
          </ul>
          <h2 className='sys-up'><FaGlobe />Uptime: {uptime}</h2>
        </div>
      </div>
      <div className='analytic-cover'>
        <div className='analytic-cont'>
          <div className='hero-crumb'>
            <h1>Analytics:</h1>
            <div className='select'>
              <select name="Range" id="Range" onChange={handleRangeChange}>
                <option value="Day">Day</option>
                <option value="Week">Week</option>
                <option value="Month">Month</option>
              </select>
            </div>
          </div>
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
