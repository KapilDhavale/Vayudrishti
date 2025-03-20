import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./RealTimeData.css"; // Ensure you have the CSS file for styling

const socket = io("http://localhost:3001"); // Backend URL

const RealTimeData = () => {
  const [hardwareData, setHardwareData] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    // Listen for the "hardwareData" event
    socket.on("hardwareData", (newHardwareData) => {
      console.log("Received hardware data:", newHardwareData);
      setHardwareData(newHardwareData);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("hardwareData");
    };
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="header"></div>
      
      {/* Time Card */}
      <div className="rows">
        <div className="cards">
          Last Updated
          <div className="value" id="lastUpdated">
            {hardwareData 
              ? new Date(hardwareData.timestamp).toLocaleTimeString() 
              : "Loading..."}
          </div>
        </div>
      </div>

      {/* 1st Row */}
      <div className="rows">
        <div className="cards">
          Temperature
          <div className="value" id="temperatureData">
            {hardwareData ? hardwareData.temperature + " °C" : "Loading..."}
          </div>
        </div>
        <div className="cards">
          MQ-135
          <div className="value" id="mq135Data">
            {hardwareData ? hardwareData.mq135 : "Loading..."}
          </div>
        </div>
      </div>

      {/* 2nd Row */}
      <div className="rows">
        <div className="cards">
          Humidity
          <div className="value" id="humidityData">
            {hardwareData ? hardwareData.humidity + " %" : "Loading..."}
          </div>
        </div>
        <div className="cards">
          MQ-7 (CO Sensor)
          <div className="value" id="mq7Data">
            {hardwareData ? hardwareData.mq7 : "Loading..."}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">Real Time Hardware Updates</div>
    </div>
  );
};

export default RealTimeData;
