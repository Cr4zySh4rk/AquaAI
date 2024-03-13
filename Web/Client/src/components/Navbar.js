import { Link } from "react-router-dom"
import "./Navbar.css"
import React, { useState, useEffect } from 'react'
import {FaBars, FaTimes} from "react-icons/fa"
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import axios from 'axios';

const Navbar = () => {
  const [uptime, setUptime] = useState("Loading...");
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [color, setColor] = useState(false);
  const changeColor = () => {
    if(window.scrollY>=90){
      setColor(true);
    }
    else{
      setColor(false);
    }
  }

  window.addEventListener("scroll", changeColor);

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
    <div className="container">
      <div className={color ? "header header-bg" : "header"}>
        <Link to="/">
            <h1>AquaAI</h1>
        </Link>
        <ul className={click ? ("NavMenu active") : ("NavMenu")}>
            <li><Link to='/'><TbGridDots />Dashboard</Link></li>
            <li><Link to='/analytics'><TbDeviceAnalytics />Analytics</Link></li>
            <li><Link to='/system-settings'><MdOutlineAppSettingsAlt />System Settings</Link></li>
            <li><Link to='/wifi-settings'><FaWifi />Wifi Settings</Link></li>
            <li><Link><FaGlobe />Uptime: {uptime}</Link></li>
        </ul>
        <div className="dropdown" onClick={handleClick}>
            {click ? (<FaTimes size={20} style={{color: "#fff"}} />) : (<FaBars size={20} style={{color: "rgb(161, 140, 209)"}} />)}
        </div>
      </div>
    </div>
    
  )
}

export default Navbar