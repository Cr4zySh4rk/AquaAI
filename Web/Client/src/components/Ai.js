import React from 'react'
import './ai.css'
import { useState, useEffect} from 'react'
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LuBrainCircuit } from "react-icons/lu";

const Ai = () => {
  const [uptime, setUptime] = useState("Loading...");
  const [growthData, setGrowthData] = useState([]);
  const [imageSrc, setImageSrc] = useState('');

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

  useEffect(() => {
    const fetchGrowthData = async () => {
      try {
        const response = await fetch('http://192.168.4.1:3001/growth-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setGrowthData(jsonData);
      } catch (error) {
        console.error('Error fetching growth data:', error);
      }
    };

    const interval = setInterval(fetchGrowthData, 5000);
    fetchGrowthData();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch('http://192.168.4.1:3001/image');
        if (!response.ok) {
          throw new Error('Error in resp');
        }
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error('Error fetching img', error);
      }
    };

    const interval = setInterval(fetchImage, 10000);
    fetchImage();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='wrapper-ai'>
      <div className='nav-holder'>
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
      <div className='ai-cover'>
        <div className='ai-container'>
          <div className='left-ai'>
            {imageSrc && <img src={imageSrc} alt='ImageSrc' />}
          </div>
          <div className='growth-data'>
            <h2>Growth Data:</h2>
            {growthData.map((data, index) => (
              <div key={index}>
                <h2>Growth Stage: {data.growthStage}</h2>
                <h2>Target Moisture: {data.targetMoist}</h2>
              </div>
            ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Ai