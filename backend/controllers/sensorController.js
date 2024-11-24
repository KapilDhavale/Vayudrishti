// controllers/sensorController.js
const { v4: uuidv4 } = require("uuid");
const SensorData = require("../models/model"); // Assuming model.js is in the same directory

// Add sensor data with auto-generated ID
exports.addSensorData = async (req, res) => {
  try {
    const sensorData = new SensorData({
      ...req.body,
      deviceID: req.body.deviceID || uuidv4(), // Generate a unique ID if not provided
    });

    // Optional: Calculate AQI if needed
    sensorData.AQI = calculateOverallAQI(req.body);

    await sensorData.save();
    res.status(201).json({
      message: "Sensor data added successfully",
      data: sensorData,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error adding sensor data",
      error: error.message,
    });
  }
};

// AQI Calculation Function (simplified for context)
function calculateOverallAQI(data) {
  // Your AQI calculation logic here
  return Math.round(Math.random() * 500); // Placeholder for testing
}
