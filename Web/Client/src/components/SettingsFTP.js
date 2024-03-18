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
import { LuBrainCircuit } from "react-icons/lu";

const SettingsSystem = () => {
  const [uptime, setUptime] = useState("Loading...");
  const [hostname, setHostname] = useState('');
  const [osInfo, setOsInfo] = useState('');
  const [ipAddress, setIpAddress] = useState('');
    const executeCommand = async (command) => {
      try {
        const response = await axios.post(`http://192.168.4.1:3001/${command}`);
        console.log(response.data);
      } catch (error) {
        console.error(`Error executing command: ${error.message}`);
      }
    };
  
    const handleShutdown = () => {
      alert("Shutting down...");
      executeCommand('shutdown');
    };
  
    const handleRestart = () => {
      alert("Restarting...");
      executeCommand('restart');
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

    useEffect(() => {
      const fetchData = async () => {
        try {
          const hostnameResponse = await axios.post('http://localhost:3001/sys-info', { command: 'hostname' });
          const osInfoResponse = await axios.post('http://localhost:3001/sys-info', { command: "grep -E '^(VERSION|NAME)=' /etc/os-release | sed 's/^[^=]*=//; s/\"//g'" });
          const ipAddressResponse = await axios.post('http://localhost:3001/sys-info', { command: "hostname -I | awk '{print $1}'" });
  
          setHostname(hostnameResponse.data.output);
          setOsInfo(osInfoResponse.data.output);
          setIpAddress(ipAddressResponse.data.output);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }, []);

  return (
    <div className='sys-wrapper'>
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
      <div className='sys-cover'>
        <div className='sys-container'>
          <div className='left-sys'>
            <div className='left-h'>
              <h1>Hostname: {hostname}</h1>
              <h1>OS Name & Version: {osInfo}</h1>
              <h1>IP Address: {ipAddress}</h1>
            </div>
          </div>
          <div className='right-sys'>
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
    </div>
  )
}

export default SettingsSystem