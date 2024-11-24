import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardDisplayPage = ({ socket }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch initial data from the backend
    fetch('http://localhost:3001/data')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Transform the data into an object keyed by boxId
        const initialData = data.reduce((acc, item) => {
          acc[item.deviceID] = item; // Use deviceID instead of boxId if needed
          return acc;
        }, {});
        setData(initialData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });

    // Listen for new data from WebSocket
    if (socket) {
      socket.on('newData', (newData) => {
        setData(prevData => ({
          ...prevData,
          [newData.deviceID]: newData, // Update the data for the existing device or add a new one
        }));
      });
    }

    return () => {
      if (socket) {
        socket.off('newData'); // Clean up the listener when component unmounts
      }
    };
  }, [socket]);

  // Utility function to format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date'; // Fallback if date is invalid
    }
    return date.toLocaleString(); // Format date to local string
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error loading data: {error.message}</p>;
  }

  return (
    <div className="container">
      <h2 className="title">Device Data</h2>

      {/* Link to Logout */}
      <button 
        onClick={() => navigate('/logout')} 
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545', // Red for logout
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
        }}
      >
        Logout
      </button>

      {Object.keys(data).length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <div className="data-grid">
          {Object.values(data).map((item) => (
            <div key={item.deviceID} className="data-card"> {/* Use deviceID as key */}
              <h3 className="data-title">Device ID: {item.deviceID}</h3>
              <ul className="data-list">
                <li className="data-item"><strong>AQI:</strong> {item.AQI}</li>
                <li className="data-item"><strong>PM2.5:</strong> {item.PM25}</li>
                <li className="data-item"><strong>PM10:</strong> {item.PM10}</li>
                <li className="data-item"><strong>NO2:</strong> {item.NO2}</li>
                <li className="data-item"><strong>SO2:</strong> {item.SO2}</li>
                <li className="data-item"><strong>CO:</strong> {item.CO}</li>
                <li className="data-item"><strong>O3:</strong> {item.O3}</li>
                <li className="data-item"><strong>Temperature:</strong> {item.temperature}°C</li>
                <li className="data-item"><strong>Humidity:</strong> {item.humidity}%</li>
                {item.location && item.location.latitude && item.location.longitude ? (
                  <li className="data-item">
                    <strong>Location:</strong> ({item.location.latitude}, {item.location.longitude})
                  </li>
                ) : (
                  <li className="data-item"><strong>Location:</strong> Not Available</li>
                )}
                <li className="data-item"><strong>Timestamp:</strong> {formatTimestamp(item.timestamp)}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardDisplayPage;
