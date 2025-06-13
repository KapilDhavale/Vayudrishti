import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CardDisplayPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { locationName } = useParams(); // Get the location name from the URL

  useEffect(() => {
    // Fetch data from the backend based on the location
    fetch(`https://vayudrishti-backend.onrender.com/data/location/${locationName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, [locationName]);

  if (loading) {
    return <p>Loading data for {locationName}...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2>{locationName} - Data</h2>
      {data.length === 0 ? (
        <p>No data available for {locationName}</p>
      ) : (
        <div>
          {data.map((item, index) => (
            <div key={index}>
              <h3>Device ID: {item.deviceID}</h3>
              <ul>
                <li>AQI: {item.AQI}</li>
                <li>PM2.5: {item.PM25}</li>
                <li>PM10: {item.PM10}</li>
                <li>NO2: {item.NO2}</li>
                <li>SO2: {item.SO2}</li>
                <li>CO: {item.CO}</li>
                <li>O3: {item.O3}</li>
                <li>Timestamp: {new Date(item.timestamp).toLocaleString()}</li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardDisplayPage;
