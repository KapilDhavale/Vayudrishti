import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DataDisplay.css';

const getGRAPStage = (aqi) => {
  let stageInfo = { stage: '', color: '', dos: [], donts: [] };
  if (aqi <= 300) {
    stageInfo = {
      stage: 'Stage I',
      color: 'linear-gradient(to bottom, #FFECB3, #FFC107)',
      dos: [
        'Use public transport or carpool to reduce emissions.',
        'Water plants and sprinkle water on dusty areas around your home.',
        'Dispose of waste responsibly—avoid burning trash.'
      ],
      donts: [
        'Avoid unnecessary outdoor physical activity, especially for children and the elderly.',
        'Don’t leave engines idling unnecessarily.',
        'Refrain from using firecrackers.'
      ]
    };
  } else if (aqi <= 400) {
    stageInfo = {
      stage: 'Stage II',
      color: 'linear-gradient(to bottom, #FFD54F, #FF9800)',
      dos: [
        'Limit outdoor activities for children and the elderly.',
        'Wear a mask if you need to go outside.'
      ],
      donts: [
        'Avoid outdoor physical exertion.',
        'Refrain from using air-conditioning in non-essential areas.'
      ]
    };
  } else if (aqi <= 450) {
    stageInfo = {
      stage: 'Stage III',
      color: 'linear-gradient(to bottom, #FF8A80, #F44336)',
      dos: [
        'Stay indoors as much as possible.',
        'Keep windows closed to avoid pollutants from entering.'
      ],
      donts: [
        'Avoid all outdoor physical activity.',
        'Do not burn wood or other materials indoors.'
      ]
    };
  } else {
    stageInfo = {
      stage: 'Stage IV',
      color: 'linear-gradient(to bottom, #CE93D8, #6A1B9A)',
      dos: [
        'Stay indoors and avoid any physical exertion.',
        'Use air purifiers if available.'
      ],
      donts: [
        'Do not leave your home unnecessarily.',
        'Avoid using private vehicles.'
      ]
    };
  }
  return stageInfo;
};

const DataDisplay = () => {
  const navigate = useNavigate();

  // We'll use one Socket.IO connection on port 3001 for both AQI and hardware updates.
  const [socket, setSocket] = useState(null);
  
  // State for real-time AQI data from Socket.IO ("aqiUpdate" event)
  const [locationsData, setLocationsData] = useState({});
  const [overallData, setOverallData] = useState(null);
  const [selectedLocationKey, setSelectedLocationKey] = useState("overall");
  const [isConnected, setIsConnected] = useState(false);
  
  // State for hardware data from Socket.IO ("hardwareData" event)
  const [hardwareData, setHardwareData] = useState(null);

  useEffect(() => {
    // Create a single Socket.IO connection to the backend on port 3001
    const socketInstance = io("https://vayudrishti-backend.onrender.com");
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
      setIsConnected(true);
    });

    // Listen for AQI updates
    socketInstance.on("aqiUpdate", (data) => {
      console.log("Received AQI update:", data);
      // If the message includes overall data, update overallData
      if (data.overall) {
        setOverallData(data.overall);
      }
      // Use latitude and longitude to build a key
      const roundedLat = Number(data.location.latitude.toFixed(2));
      const roundedLon = Number(data.location.longitude.toFixed(2));
      const key = `${roundedLat},${roundedLon}`;
      setLocationsData(prev => ({ ...prev, [key]: data }));
    });

    // Listen for hardware data updates
    socketInstance.on("hardwareData", (data) => {
      console.log("Received hardware data:", data);
      setHardwareData(data);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setIsConnected(false);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Build dropdown options for location selector with unique names (without coordinates)
  const locationOptions = useMemo(() => {
    const labelsMap = {};
    const overallOption = { value: "overall", label: "Delhi (Overall)" };
    const options = [overallOption];
    Object.keys(locationsData).forEach((key) => {
      const loc = locationsData[key].location;
      let label = loc.name; // Only the name
      // If the label already exists, append a suffix to make it unique.
      if (labelsMap[label]) {
        labelsMap[label] += 1;
        label = `${label} - ${labelsMap[label]}`;
      } else {
        labelsMap[label] = 1;
      }
      options.push({
        value: key,
        label,
      });
    });
    return options;
  }, [locationsData]);

  const handleLocationChange = (selectedOption) => {
    setSelectedLocationKey(selectedOption.value);
  };

  // Determine which data to show
  const selectedData =
    selectedLocationKey === "overall" ? overallData : locationsData[selectedLocationKey];
  const grapInfo = selectedData ? getGRAPStage(selectedData.AQI) : null;

  // Logout handler
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <div className="data-display">
      {/* Header with Logo and Logout Button */}
      <div className="header">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* GRAP Cards Section */}
      <div id="grap-cards">
        <div id="card-1" style={{ background: 'linear-gradient(to bottom, #FFECB3, #FFC107)' }}>
          <div id="stages-head-1" style={{ backgroundColor: '#FFFF00' }}>Stage I</div>
          <div id="stages-value-1">AQI less than 300</div>
        </div>
        <div id="card-2" style={{ background: 'linear-gradient(to bottom, #FFD54F, #FF9800)' }}>
          <div id="stages-head-2" style={{ backgroundColor: '#FFA500' }}>Stage II</div>
          <div id="stages-value-2">AQI 301-400</div>
        </div>
        <div id="card-3" style={{ background: 'linear-gradient(to bottom, #FF8A80, #F44336)' }}>
          <div id="stages-head-3" style={{ backgroundColor: '#FF0000' }}>Stage III</div>
          <div id="stages-value-3">AQI 401-450</div>
        </div>
        <div id="card-4" style={{ background: 'linear-gradient(to bottom, #CE93D8, #6A1B9A)' }}>
          <div id="stages-head-4" style={{ backgroundColor: '#8E47B1' }}>Stage IV</div>
          <div id="stages-value-4">AQI more than 450</div>
        </div>
      </div>

      {/* AQI Status Section */}
      <div className="aqi-status-section" style={{ background: grapInfo ? grapInfo.color : '#fff' }}>
        <h3>
          {selectedData && selectedLocationKey === "overall"
            ? `Delhi Overall AQI Status`
            : selectedData && selectedData.location
            ? `${selectedData.location.name} AQI Status`
            : 'Waiting for data...'}
        </h3>
        {selectedData ? (
          <div className="aqi-status">
            <div className="aqi-left">
              <h4>AQI: {selectedData.AQI}</h4>
            </div>
            <div className="aqi-right">
              <p>GRAP: {grapInfo ? grapInfo.stage : 'Loading...'}</p>
              <p>Worst Pollutant: {selectedData.worstPollutant}</p>
              <p>
                Condition: {selectedData.AQI <= 100
                  ? 'Good'
                  : selectedData.AQI <= 200
                  ? 'Moderate'
                  : selectedData.AQI <= 300
                  ? 'Unhealthy for Sensitive Groups'
                  : 'Hazardous'}
              </p>
              <p>Calculated: {selectedData.calculationTime || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p>Waiting for data...</p>
        )}
      </div>

      {/* Searchable Location Selector */}
      <div className="container custom-container">
        <h1 className="text-center mb-4">Real-Time AQI Data by Parameter</h1>
        {!isConnected && (
          <div className="alert alert-warning text-center" role="alert">
            Connecting to Socket.IO...
          </div>
        )}
        {locationOptions.length > 0 && (
          <div className="mb-4">
            <label style={{ marginRight: '10px' }}>Select Location: </label>
            <Select
              options={locationOptions}
              onChange={handleLocationChange}
              defaultValue={locationOptions.find(option => option.value === selectedLocationKey)}
              placeholder="Search location..."
            />
          </div>
        )}
      </div>

      {/* Do's and Don'ts Section */}
      <div className="container custom-container">
        <div className="row">
          <div className="col-md-6">
            <h4>Do's</h4>
            <div className="dos-box">
              <ul>
                {grapInfo && grapInfo.dos.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Don'ts</h4>
            <div className="donts-box">
              <ul>
                {grapInfo && grapInfo.donts.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataDisplay;
