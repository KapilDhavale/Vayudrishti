const mongoose = require('mongoose');

// Define a schema for the sensor data
const sensorDataSchema = new mongoose.Schema({
  boxId: { 
    type: String, 
    required: true, 
    index: true // Index for fast searching by boxId
  },
  timestamp: { 
    type: Date, 
    default: Date.now, 
    index: true // Index for fast searching by timestamp
  },
  aqi: { type: Number, required: true },  // Air Quality Index
  pm2_5: { type: Number, required: true }, // PM2.5
  pm10: { type: Number, required: true },  // PM10
  temperature: { type: Number, required: true }, // Temperature
  humidity: { type: Number, required: true },   // Humidity
  location: { 
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

// Create a model using the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
