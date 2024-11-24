const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema({
  deviceID: { type: String, required: true },
  PM25: { type: Number, required: true },
  PM10: { type: Number, required: true },
  NO2: { type: Number, required: true },
  SO2: { type: Number, required: true },
  CO: { type: Number, required: true },
  O3: { type: Number, required: true },
  AQI: { type: Number, required: true }, // Add AQI field to store the calculated AQI value
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model("SensorData", sensorDataSchema);

module.exports = SensorData;
