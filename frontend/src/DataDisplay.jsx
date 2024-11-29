import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Import the Navbar component
import "./DataDisplay.css";

const DataDisplay = ({ socket }) => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data from the backend
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
        const grouped = data.reduce((acc, item) => {
          if (item.location && item.location.name) {
            const location = item.location.name;
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

    if (socket) {
      socket.on("newData", (newData) => {
        setData((prevData) => {
          const updatedData = [newData, ...prevData];
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
    <div className="dashboard-container">
      <div className="sidebar">
        <h4 className="sidebar-title">Menu</h4>
        <ul className="sidebar-menu">
          <li>
            <button
              onClick={() => navigate("/logout")}
              className="btn btn-danger sidebar-btn"
            >
              Logout
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/cards")}
              className="btn btn-primary sidebar-btn"
            >
              View Cards
            </button>
          </li>
        </ul>
      </div>

      <div className="main-content">
        {/* Use the Navbar component */}
        <Navbar />

        <div className="dashboard-content">
          {Object.keys(groupedData).length === 0 ? (
            <p className="no-data">No data available</p>
          ) : (
            <div className="location-container">
              {Object.keys(groupedData).map((location, index) => (
                <div key={index} className="location-group card">
                  <h3 className="location-title">{location}</h3>
                  <div className="data-grid">
                    {groupedData[location].map((item, index) => (
                      <div key={index} className="data-card card">
                        <h4 className="data-title">
                          Device ID: {item.deviceID}
                        </h4>
                        <ul className="data-list">
                          <li className="data-item">
                            <strong>AQI:</strong> {item.AQI}
                          </li>
                          {/* Other data points */}
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
      </div>
    </div>
  );
};

export default DataDisplay;
