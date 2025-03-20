import React, { useState, useEffect, useRef, useCallback } from "react";
import { OlaMaps } from "./OlaMapsWebSDKNew/olamaps-web-sdk.umd.js";

// Predefined sensor data for various Mumbai suburbs (sample coordinates and AQI values)
const predefinedMumbaiSensors = [
  { location: { lat: 19.1200, lng: 72.8500, name: "Andheri" }, AQI: 90 },
  { location: { lat: 19.0600, lng: 72.8400, name: "Bandra" }, AQI: 100 },
  { location: { lat: 19.1200, lng: 72.9200, name: "Powai" }, AQI: 110 },
  { location: { lat: 19.0400, lng: 72.9200, name: "Chembur" }, AQI: 95 },
  { location: { lat: 19.0333, lng: 73.0333, name: "Navi Mumbai" }, AQI: 85 },
  { location: { lat: 19.1000, lng: 72.9000, name: "Ghatkopar" }, AQI: 105 },
  { location: { lat: 19.1500, lng: 72.9200, name: "Mulund" }, AQI: 80 },
  { location: { lat: 19.0800, lng: 72.8900, name: "Vikhroli" }, AQI: 100 },
  { location: { lat: 19.1000, lng: 72.8700, name: "Bhandup" }, AQI: 95 },
  { location: { lat: 19.0100, lng: 72.8600, name: "Santacruz" }, AQI: 105 },
  { location: { lat: 19.1800, lng: 72.8300, name: "Borivali" }, AQI: 90 },
  { location: { lat: 19.2000, lng: 72.8100, name: "Dahisar" }, AQI: 100 },
  { location: { lat: 19.1600, lng: 72.8000, name: "Kandivali" }, AQI: 95 },
  { location: { lat: 19.1400, lng: 72.9500, name: "Malad" }, AQI: 105 },
  { location: { lat: 19.1300, lng: 72.9400, name: "Goregaon" }, AQI: 100 },
  { location: { lat: 19.0600, lng: 72.8700, name: "Kurla" }, AQI: 98 },
  { location: { lat: 19.0800, lng: 72.8600, name: "Jogeshwari" }, AQI: 100 },
  { location: { lat: 19.1000, lng: 72.8600, name: "Vidyavihar" }, AQI: 95 },
];

// Predefined sensor data for various Delhi areas (sample coordinates and AQI values)
const predefinedDelhiSensors = [
  { location: { lat: 28.6333, lng: 77.2167, name: "Connaught Place" }, AQI: 105 },
  { location: { lat: 28.6500, lng: 77.2300, name: "Chandni Chowk" }, AQI: 110 },
  { location: { lat: 28.5500, lng: 77.2000, name: "Saket" }, AQI: 95 },
  { location: { lat: 28.5700, lng: 77.0500, name: "Dwarka" }, AQI: 100 },
  { location: { lat: 28.7000, lng: 77.1000, name: "Rohini" }, AQI: 90 },
  { location: { lat: 28.6000, lng: 77.2100, name: "Karol Bagh" }, AQI: 100 },
  { location: { lat: 28.6300, lng: 77.2300, name: "Civil Lines" }, AQI: 95 },
  { location: { lat: 28.5460, lng: 77.2060, name: "Hauz Khas" }, AQI: 92 },
  { location: { lat: 28.5672, lng: 77.2500, name: "Lajpat Nagar" }, AQI: 98 },
  { location: { lat: 28.5300, lng: 77.1600, name: "Vasant Kunj" }, AQI: 88 },
  { location: { lat: 28.5300, lng: 77.2100, name: "Greater Kailash" }, AQI: 97 },
  { location: { lat: 28.6350, lng: 77.2167, name: "Lutyens' Delhi" }, AQI: 93 },
  { location: { lat: 28.6000, lng: 77.2500, name: "Kalkaji" }, AQI: 96 },
  { location: { lat: 28.7000, lng: 77.3000, name: "Shahdara" }, AQI: 101 },
  { location: { lat: 28.7000, lng: 77.2000, name: "Pitampura" }, AQI: 99 },
];

const dummySensorData = [...predefinedMumbaiSensors, ...predefinedDelhiSensors];

const Map = () => {
  const mapContainer = useRef(null);
  const mapInstanceRef = useRef(null);
  const [sensorData, setSensorData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the API key from environment variables
  const olaApiKey = process.env.REACT_APP_OLA_API_KEY;
  console.log("Ola Maps API Key:", olaApiKey);

  // On mount, set sensor data (dummy data)
  useEffect(() => {
    setSensorData(dummySensorData);
  }, []);

  // Convert sensorData to a GeoJSON FeatureCollection
  const getGeoJSONData = useCallback(() => {
    return {
      type: "FeatureCollection",
      features: sensorData.map((item) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [item.location.lng, item.location.lat],
        },
        properties: {
          intensity: Math.round(item.AQI),
          name: item.location.name,
        },
      })),
    };
  }, [sensorData]);

  // Initialization effect: Center the map on Delhi
  useEffect(() => {
    try {
      if (!olaApiKey) {
        throw new Error("Ola Maps API key is missing.");
      }
      const olaMaps = new OlaMaps({ apiKey: olaApiKey });
      // Center the map on Delhi with appropriate zoom level (e.g., 10)
      const myMap = olaMaps.init({
        style:
          "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
        container: mapContainer.current,
        center: [77.2090, 28.6139], // [longitude, latitude] for Delhi
        zoom: 10,
      });
      mapInstanceRef.current = myMap;

      myMap.on("load", () => {
        console.log("Map loaded successfully.");
        setLoading(false);

        // Optionally remove problematic 3D layer if present
        try {
          if (myMap.getLayer("3d_model_data")) {
            myMap.removeLayer("3d_model_data");
            console.log("Removed layer: 3d_model_data");
          }
        } catch (e) {
          console.error("Error removing 3d_model_data layer:", e);
        }

        // Create a GeoJSON source with sensor data
        const geojsonData = getGeoJSONData();
        myMap.addSource("india-heat", {
          type: "geojson",
          data: geojsonData,
        });

        // Add a heatmap layer (optional)
        myMap.addLayer({
          id: "india-heatmap-layer",
          type: "heatmap",
          source: "india-heat",
          filter: ["has", "intensity"],
          paint: {
            "heatmap-weight": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0,
              0,
              300,
              1,
            ],
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(0,255,0,0)",
              0.2,
              "rgb(0,255,0)",
              0.4,
              "rgb(255,255,0)",
              0.6,
              "rgb(255,165,0)",
              0.8,
              "rgb(255,0,0)",
              1,
              "rgb(128,0,128)",
            ],
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
            ],
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              7,
              1,
              9,
              0,
            ],
          },
        });

        // Add a circle layer for sensor points.
        myMap.addLayer({
          id: "india-heatmap-circle",
          type: "circle",
          source: "india-heat",
          minzoom: 0,
          paint: {
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              8,
              12,
              20,
            ],
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "intensity"],
              0,
              "rgb(0,255,0)",
              150,
              "rgb(255,0,0)",
              300,
              "rgb(128,0,128)",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 2,
            "circle-opacity": 1,
          },
        });

        // Add a symbol layer to display the AQI value inside each circle.
        myMap.addLayer({
          id: "india-heatmap-label",
          type: "symbol",
          source: "india-heat",
          minzoom: 0,
          layout: {
            "text-field": ["to-string", ["get", "intensity"]],
            "text-size": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              12,
              12,
              16,
            ],
            "text-font": ["Arial Unicode MS Regular"],
            "text-offset": [0, 0],
            "text-anchor": "center",
          },
          paint: {
            "text-color": "white",
            "text-halo-color": "black",
            "text-halo-width": 2,
          },
        });
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize the map.");
      setLoading(false);
    }
  }, [olaApiKey, getGeoJSONData]);

  // Update the GeoJSON source data when sensorData changes
  useEffect(() => {
    if (mapInstanceRef.current && mapInstanceRef.current.getSource("india-heat")) {
      mapInstanceRef.current.getSource("india-heat").setData(getGeoJSONData());
    }
  }, [sensorData, getGeoJSONData]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }}></div>
      {loading && (
        <div style={{ position: "absolute", top: 10, left: 10, background: "#fff", padding: "10px", zIndex: 30 }}>
          Loading map...
        </div>
      )}
      {error && (
        <div style={{ position: "absolute", top: 10, left: 10, background: "red", color: "#fff", padding: "10px", zIndex: 30 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Map;
