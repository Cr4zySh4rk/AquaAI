import React from 'react'
import { useState, useEffect } from 'react';
import './wifi.css'
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios'

const Wifi = () => {
  const [uptime, setUptime] = useState("Loading...");
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [channel, setChannel] = useState('');

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

  const handleReset = async () => {
    try {
      const resp = await axios.post('http://localhost:3001/wifi-settings/reset');
      if(resp.data === "WiFiSet"){
        alert("Wifi Reset Successful! Please Reboot")
      }
    } catch (error) {
      alert('Error resetting WiFi settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:3001/wifi-settings', { ssid, password, channel });
      if(response.data === "WiFiYes"){
        alert("Please Reboot")
      }
    } catch (error) {
      alert('Error saving WiFi settings:', error);
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
    <div className='wifi-wrapper'>
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
      <div className='wifi-cover'>
        <div className='wifi-container'>
          <div className='wifi-box'>
            <FaWifi size={150} color='rgb(161, 140, 209)'/>
            <div className='no-flex'>
              <div className='wifibox-flex'>
                <h3 className='move'>SSID: </h3>
                <input type='text' placeholder='Enter SSID' value={ssid} onChange={(e) => setSSID(e.target.value)}/>
              </div>
              <div className='wifibox-flex'>
                <h3>Password: </h3>
                <input type='text' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className='wifibox-flex'>
                <h3>Channel: </h3>
                  <select name='Channel' id='Channel' value={channel}
                  onChange={(e) => setChannel(e.target.value)}>
                    <option value="Select Channel">Select Channel</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                  </select>
              </div>
              <div className='wifibox-flex1'>
                <button className='btn-sys' onClick={handleReset}>Reset</button>
                <button className='btn-sys' onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default Wifi