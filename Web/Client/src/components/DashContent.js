import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { TbGridDots } from "react-icons/tb";
import { TbDeviceAnalytics } from "react-icons/tb";
import { MdOutlineAppSettingsAlt } from "react-icons/md";
import { FaWifi } from "react-icons/fa";
import { FaGlobe } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashContent = () => {
  const [data, setData] = useState([]);
  const [totalWaterDispensed, setTotalWaterDispensed] = useState(0);
  const [currentSoilMoisture, setCurrentSoilMoisture] = useState(0);
  const [currentNPK, setCurrentNPK] = useState({});
  const [currentTemperature, setCurrentTemperature] = useState(0);
  const [currentHumidity, setCurrentHumidity] = useState(0);
  const [uptime, setUptime] = useState("Loading...");
  const [selectedCrop, setSelectedCrop] = useState('Select Crop');
  const [selectedCropData, setSelectedCropData] = useState(null);
  const [nitrogenOp, setNitrogenOp] = useState(null);
  const [potassiumOp, setPotassiumOp] = useState(null);
  const [phosphorusOp, setPhosphorusOp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/analytics');
        const jsonData = response.data;
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching or processing data:', error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 10000); // Refresh data every 10 seconds
    return () => clearInterval(intervalId);
  }, [data]);
  
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

  useEffect(() => {
    if (data.length > 0) {
      const lastEntry = data[data.length - 1];
      const last15Entries = data.slice(-15);
      const total = last15Entries.reduce((acc, entry) => acc + parseFloat(entry.Water_Dispensed), 0);
      setTotalWaterDispensed(total);
      setCurrentSoilMoisture(parseFloat(lastEntry.Soil_Moisture));
      setCurrentNPK({
        nitrogen: parseFloat(lastEntry.Nitrogen),
        phosphorus: parseFloat(lastEntry.Phosphorus),
        potassium: parseFloat(lastEntry.Potassium),
      });
      setCurrentTemperature(parseFloat(lastEntry.Temperature));
      setCurrentHumidity(parseFloat(lastEntry.Humidity));
    }
  }, [data]);

  const fetchCropData = async (selectedCrop) => {
    try {
      const response = await axios.get(`http://localhost:3001/crop-data/${selectedCrop}`);
      const cropData = response.data;
      setSelectedCropData(cropData);
    } catch (error) {
      console.error(`Error ${selectedCrop} data not found:`, error);
      setSelectedCropData(null);
    }
  };
  
  const handleCropChange = (event) => {
    const selectedCrop = event.target.value;
    setSelectedCrop(selectedCrop);
    fetchCropData(selectedCrop);
  };

  useEffect(() => {
    compareNitrogenLevels(currentNPK, selectedCropData);
    comparePhosphorusLevels(currentNPK, selectedCropData);
    comparePotassiumLevels(currentNPK, selectedCropData);
  }, [currentNPK, selectedCropData]);

  const compareNitrogenLevels = (currentNPK, selectedCropData) => {
    if (currentNPK && selectedCropData && currentNPK.nitrogen > selectedCropData.N) {
      setNitrogenOp("high");
    } else if (currentNPK && selectedCropData && currentNPK.nitrogen < selectedCropData.N) {
      setNitrogenOp("low");
    } else {
      setNitrogenOp(null);
    }
  };
  const comparePhosphorusLevels = (currentNPK, selectedCropData) => {
    if (currentNPK && selectedCropData && currentNPK.phosphorus > selectedCropData.P) {
      setPhosphorusOp("high");
    } else if (currentNPK && selectedCropData && currentNPK.phosphorus < selectedCropData.P) {
      setPhosphorusOp("low");
    } else {
      setPhosphorusOp(null);
    }
  };
  const comparePotassiumLevels = (currentNPK, selectedCropData) => {
    if (currentNPK && selectedCropData && currentNPK.potassium > selectedCropData.K) {
      setPotassiumOp("high");
    } else if (currentNPK && selectedCropData && currentNPK.potassium < selectedCropData.K) {
      setPotassiumOp("low");
    } else {
      setPotassiumOp(null);
    }
  };


  return (
    <div className='wrapper-dash'>
      <div className='nav-holder'>
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
      <div className="dash-cover">
        <div className='dash-container'>
          <div className='head-space-between'>
            <h1>Dashboard</h1>
            <div className='select'>
              <select name="Crop" id="Crop" onChange={handleCropChange} value={selectedCrop}>
                <option value="Select Crop">Select Crop</option>
                <option value="Pomegranate">Pomegranate</option>
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
                <option value="Brinjal">Brinjal</option>
                <object value="Onion">Onion</object>
                <option value="Cabbage">Cabbage</option>
                <option value="Potato">Potato</option>
              </select>
            </div>
          </div>
          <div className='metric-wrapper'>
            <div className='metric-cont'>
              <h1>Water Dispensed Today: {totalWaterDispensed}mL</h1>
            </div>
            <div className='metric-cont'>
              <h1>Current Soil Moisture: {currentSoilMoisture}bar</h1>
            </div>
            <div className='metric-cont'>
              <h1>Current N, P, K Values: {currentNPK.nitrogen}, {currentNPK.phosphorus}, {currentNPK.potassium}</h1>
            </div>
          </div>
          <div className='metric-wrapper'>
            <div className='metric-cont'>
              <h1>Current Temperature: {currentTemperature}°C</h1>
            </div>
            <div className='metric-cont'>
              <h1>Current Humidity: {currentHumidity}%</h1>
            </div>
          </div>
          <div className='recommendation-wrapper'>
            <div className='reco-cont'>
              <h1>Recommendations:</h1>
              <div className='ideal-flex'>
                {selectedCropData !== null ?<h2>Ideal values for {selectedCropData ? selectedCropData.Name : "None"}:</h2> : console.log("")}
                
                {selectedCropData !== null ? <p>Nitrogen: {selectedCropData ? selectedCropData.N : "Error"},
                  Phosphorus: {selectedCropData ? selectedCropData.P : "Error"},
                  Potassium: {selectedCropData ? selectedCropData.K : "Error"},
                  Soil-Moisture(min-max): {selectedCropData ? selectedCropData.SoilMin : "Error"} - {selectedCropData ? selectedCropData.SoilMax : "Error"}%,
                  Temperature(min-max) : {selectedCropData ? selectedCropData.TempMin : "Error"} - {selectedCropData ? selectedCropData.TempMax : "Error"}°C,
                  Humidity(min-max) : {selectedCropData ? selectedCropData.HumidMin : "Error"} - {selectedCropData ? selectedCropData.HumidMax : "Error"}%.</p> : <p>Please select crop</p>
                }
                {selectedCropData !== null ?<h2>Fertilizer suggestions for {selectedCropData ? selectedCropData.Name : "None"}:</h2> : console.log("")}
                {nitrogenOp === "high" ? (<p>
                <b>The N value of soil is high and might give rise to weeds.</b>
                <br/><br/> 1. <b> Manure </b> – adding manure is one of the simplest ways to amend your soil with nitrogen. Be careful as there are various types of manures with varying degrees of nitrogen.

                <br/> 2. <b>Coffee grinds </b> – use your morning addiction to feed your gardening habit! Coffee grinds are considered a green compost material which is rich in nitrogen. Once the grounds break down, your soil will be fed with delicious, delicious nitrogen. An added benefit to including coffee grounds to your soil is while it will compost, it will also help provide increased drainage to your soil.

                <br/>3. <b>Plant nitrogen fixing plants</b> – planting vegetables that are in Fabaceae family like peas, beans and soybeans have the ability to increase nitrogen in your soil

                <br/>4. Plant 'green manure' crops like cabbage, corn and brocolli

                <br/>5. <b>Use mulch (wet grass) while growing crops</b> - Mulch can also include sawdust and scrap soft woods
                </p>) : nitrogenOp === "low" ? (<p>
                  <b>The N value of your soil is low.</b>
                  <br/><br/> 1. <b>Add sawdust or fine woodchips to your soil</b> – the carbon in the sawdust/woodchips love nitrogen and will help absorb and soak up and excess nitrogen.

                  <br/>2. <b>Plant heavy nitrogen feeding plants</b> – tomatoes, corn, broccoli, cabbage and spinach are examples of plants that thrive off nitrogen and will suck the nitrogen dry.

                  <br/>3. <b>Water</b> – soaking your soil with water will help leach the nitrogen deeper into your soil, effectively leaving less for your plants to use.

                  <br/>4. <b>Sugar</b> – In limited studies, it was shown that adding sugar to your soil can help potentially reduce the amount of nitrogen is your soil. Sugar is partially composed of carbon, an element which attracts and soaks up the nitrogen in the soil. This is similar concept to adding sawdust/woodchips which are high in carbon content.

                  <br/>5. Add composted manure to the soil.

                  <br/>6. Plant Nitrogen fixing plants like peas or beans.

                  <br/>7. Use NPK fertilizers with high N value.

                  <br/>8. <b>Do nothing</b> – It may seem counter-intuitive, but if you already have plants that are producing lots of foliage, it may be best to let them continue to absorb all the nitrogen to amend the soil for your next crops.
                </p>) : null}
                {phosphorusOp === "high" ? (<p>
                  <b>The P value of your soil is high.</b>
                  <br /><br/>1. <b>Avoid adding manure</b> – manure contains many key nutrients for your soil but typically including high levels of phosphorous. Limiting the addition of manure will help reduce phosphorus being added.

                  <br/>2. <b>Use only phosphorus-free fertilizer</b> – if you can limit the amount of phosphorous added to your soil, you can let the plants use the existing phosphorus while still providing other key nutrients such as Nitrogen and Potassium. Find a fertilizer with numbers such as 10-0-10, where the zero represents no phosphorous.

                  <br/>3. <b>Water your soil</b> – soaking your soil liberally will aid in driving phosphorous out of the soil. This is recommended as a last ditch effort.

                  <br/>4. Plant nitrogen fixing vegetables to increase nitrogen without increasing phosphorous (like beans and peas).

                  <br/>5. Use crop rotations to decrease high phosphorous levels
                  </p>) : phosphorusOp === "low" ? (<p>
                  <b>The P value of your soil is low.</b>
                  <br/><br/>1. <b>Bone meal</b> – a fast acting source that is made from ground animal bones which is rich in phosphorous.

                  <br/>2. <b>Rock phosphate</b> – a slower acting source where the soil needs to convert the rock phosphate into phosphorous that the plants can use.

                  <br/>3. <b>Phosphorus Fertilizers</b> – applying a fertilizer with a high phosphorous content in the NPK ratio (example: 10-20-10, 20 being phosphorous percentage).

                  <br/>4. <b>Organic compost</b> – adding quality organic compost to your soil will help increase phosphorous content.

                  <br/>5. <b>Manure</b> – as with compost, manure can be an excellent source of phosphorous for your plants.

                  <br/>6. <b>Clay soil</b> – introducing clay particles into your soil can help retain & fix phosphorus deficiencies.

                  <br/>7. <b>Ensure proper soil pH</b> – having a pH in the 6.0 to 7.0 range has been scientifically proven to have the optimal phosphorus uptake in plants.

                  <br/>8. If soil pH is low, add lime or potassium carbonate to the soil as fertilizers. Pure calcium carbonate is very effective in increasing the pH value of the soil.

                  <br/>9. If pH is high, addition of appreciable amount of organic matter will help acidify the soil. Application of acidifying fertilizers, such as ammonium sulfate, can help lower soil pH
                  </p>) : null
                }
                {potassiumOp === "high" ? (<p>
                  <b>The K value of your soil is high</b>.
                  <br/><br/>1. <b>Loosen the soil</b> deeply with a shovel, and water thoroughly to dissolve water-soluble potassium. Allow the soil to fully dry, and repeat digging and watering the soil two or three more times.

                  <br/>2. <b>Sift through the soil</b>, and remove as many rocks as possible, using a soil sifter. Minerals occurring in rocks such as mica and feldspar slowly release potassium into the soil slowly through weathering.

                  <br/>3. Stop applying potassium-rich commercial fertilizer. Apply only commercial fertilizer that has a '0' in the final number field. Commercial fertilizers use a three number system for measuring levels of nitrogen, phosphorous and potassium. The last number stands for potassium. Another option is to stop using commercial fertilizers all together and to begin using only organic matter to enrich the soil.

                  <br/>4. Mix crushed eggshells, crushed seashells, wood ash or soft rock phosphate to the soil to add calcium. Mix in up to 10 percent of organic compost to help amend and balance the soil.

                  <br/>5. Use NPK fertilizers with low K levels and organic fertilizers since they have low NPK values.

                  <br/>6. Grow a cover crop of legumes that will fix nitrogen in the soil. This practice will meet the soil’s needs for nitrogen without increasing phosphorus or potassium.
                  </p>) : potassiumOp === "low" ? ( <p>
                  <b>The K value of your soil is low.</b>
                  <br /><br/>Please consider the following suggestions:

                  <br/><br/>1. Mix in muricate of potash or sulphate of potash
                  <br/>2. Try kelp meal or seaweed
                  <br/>3. Try Sul-Po-Mag
                  <br/>4. Bury banana peels an inch below the soils surface
                  <br/>5. Use Potash fertilizers since they contain high values potassium
                </p>) : null

                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashContent;
