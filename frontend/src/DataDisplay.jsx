import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DataDisplay = ({ socket }) => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data from the backend (GET /data)
    fetch("http://localhost:3001/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);

        // Group data by location name, only include items with a valid location name
        const grouped = data.reduce((acc, item) => {
          if (item.location && item.location.name) {
            const location = item.location.name; // Only use the location name
            if (!acc[location]) {
              acc[location] = [];
            }
            acc[location].push(item);
          }
          return acc;
        }, {});
        
        setGroupedData(grouped);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });

    // Listen for new data from WebSocket
    if (socket) {
      socket.on("newData", (newData) => {
        setData((prevData) => {
          const updatedData = [newData, ...prevData];
          // Update groupedData with new data, only if location name exists
          const updatedGrouped = updatedData.reduce((acc, item) => {
            if (item.location && item.location.name) {
              const location = item.location.name;
              if (!acc[location]) {
                acc[location] = [];
              }
              acc[location].push(item);
            }
            return acc;
          }, {});
          setGroupedData(updatedGrouped);
          return updatedData;
        });
      });
    }

    // Clean up the WebSocket listener when the component unmounts
    return () => {
      if (socket) {
        socket.off("newData");
      }
    };
  }, [socket]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error loading data: {error.message}</p>;
  }

  return (
    <div className="container">
      <h2 className="title">Received Data</h2>

      {/* Link to Logout */}
      <button
        onClick={() => navigate("/logout")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#dc3545", // Red for logout
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>

      {/* Button to navigate to CardDisplayPage */}
      <button
        onClick={() => navigate("/cards")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff", // Blue for the new button
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        View Cards
      </button>

      {Object.keys(groupedData).length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <div className="location-container">
          {Object.keys(groupedData).map((location, index) => (
            <div key={index} className="location-group">
              <h3 className="location-title">{location}</h3>
              <div className="data-grid">
                {groupedData[location].map((item, index) => (
                  <div key={index} className="data-card">
                    <h3 className="data-title">Device ID: {item.deviceID}</h3>
                    <ul className="data-list">
                      <li className="data-item">
                        <strong>AQI:</strong> {item.AQI}
                      </li>
                      <li className="data-item">
                        <strong>PM2.5:</strong> {item.PM25}
                      </li>
                      <li className="data-item">
                        <strong>PM10:</strong> {item.PM10}
                      </li>
                      <li className="data-item">
                        <strong>NO2:</strong> {item.NO2}
                      </li>
                      <li className="data-item">
                        <strong>SO2:</strong> {item.SO2}
                      </li>
                      <li className="data-item">
                        <strong>CO:</strong> {item.CO}
                      </li>
                      <li className="data-item">
                        <strong>O3:</strong> {item.O3}
                      </li>
                      {/* Handle location as an object */}
                      <li className="data-item">
                        <strong>Location:</strong> 
                        {item.location ? (
                          <>
                            <p>Name: {item.location.name}</p>
                            <p>Latitude: {item.location.latitude}</p>
                            <p>Longitude: {item.location.longitude}</p>
                            <p>Radius: {item.location.radius} km</p>
                          </>
                        ) : (
                          "Not Available"
                        )}
                      </li>
                      <li className="data-item">
                        <strong>Timestamp:</strong>{" "}
                        {new Date(item.timestamp).toLocaleString()}
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
