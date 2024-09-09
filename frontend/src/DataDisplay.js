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
              <h3 className="data-title">Data Entry {index + 1}</h3>
              <ul className="data-list">
                {Object.entries(item).map(([key, value]) => (
                  <li key={key} className="data-item">
                    <strong>{key}:</strong> {typeof value === 'object' && value !== null 
                      ? JSON.stringify(value) // Convert object to string for rendering
                      : value} {/* Render the value directly if it's not an object */}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataDisplay;
