import React from 'react'
import { useEffect, useState } from 'react';
import './system.css'
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { RiShutDownLine } from "react-icons/ri";
import { MdOutlineRestartAlt } from "react-icons/md";
import axios from 'axios';

const SettingsSystem = () => {
  const [uptime, setUptime] = useState("Loading...");
    const executeCommand = async (command) => {
      try {
        const response = await axios.post(`http://localhost:3001/${command}`);
        console.log(response.data);
      } catch (error) {
        console.error(`Error executing command: ${error.message}`);
      }
    };
  
    const handleShutdown = () => {
      executeCommand('shutdown');
    };
  
    const handleRestart = () => {
      executeCommand('restart');
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
    <div className='sys-wrapper'>
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
      <div className='sys-cover'>
        <div className='sys-container'>
          <div className='down-flex'>
            <RiShutDownLine size={40} className='icon-sys'/>
            <button className='btn-sys' onClick={handleShutdown}>Shutdown</button>
          </div>
          <div className='reboot-flex'>
            <MdOutlineRestartAlt size={42} className='icon-sys'/>
            <button className='btn-sys' onClick={handleRestart}>Restart</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsSystem