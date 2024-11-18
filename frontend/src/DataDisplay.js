import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Connect to the backend server using Socket.IO
const socket = io('http://localhost:3001');

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial data from the backend
    fetch('http://localhost:3001/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });

    // Listen for new data from WebSocket
    socket.on('newData', (newData) => {
      setData(prevData => [...prevData, newData]);
    });

    return () => {
      socket.off('newData'); // Clean up the listener when component unmounts
    };
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error loading data: {error.message}</p>;
  }

  return (
    <div className="container">
      <h2 className="title">Received Data</h2>
      {data.length === 0 ? (
        <p className="no-data">No data available</p>
      ) : (
        <div className="data-grid">
          {data.map((item, index) => (
            <div key={index} className="data-card">
              <h3 className="data-title">Box ID: {item.boxId}</h3>
              <ul className="data-list">
                <li className="data-item"><strong>AQI:</strong> {item.aqi}</li>
                <li className="data-item"><strong>PM2.5:</strong> {item.pm2_5}</li>
                <li className="data-item"><strong>PM10:</strong> {item.pm10}</li>
                <li className="data-item"><strong>Temperature:</strong> {item.temperature}°C</li>
                <li className="data-item"><strong>Humidity:</strong> {item.humidity}%</li>
                {item.location && item.location.latitude && item.location.longitude ? (
                  <li className="data-item">
                    <strong>Location:</strong> ({item.location.latitude}, {item.location.longitude})
                  </li>
                ) : (
                  <li className="data-item"><strong>Location:</strong> Not Available</li>
                )}
                <li className="data-item"><strong>Timestamp:</strong> {new Date(item.timestamp).toLocaleString()}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
