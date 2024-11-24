const express = require('express');
const router = express.Router();
const SensorData = require('../models/model');
const { calculateAQI } = require('../services/aqiCalculation');  // Import AQI calculation service

// POST route to receive sensor data and calculate AQI
router.post('/data', async (req, res) => {
  try {
    const newData = req.body;

    // Check if all necessary parameters are present
    if (!newData.PM25 || !newData.PM10 || !newData.NO2 || !newData.SO2 || !newData.CO || !newData.O3) {
      return res.status(400).send('Missing sensor data');
    }

    // Fetch previous data for averaging (based on timestamp or deviceID)
    const previousData = await SensorData.find({ deviceID: newData.deviceID }).sort({ timestamp: -1 }).limit(10); // Example: fetch last 10 entries

    let averageData = {
      PM25: 0,
      PM10: 0,
      NO2: 0,
      SO2: 0,
      CO: 0,
      O3: 0,
    };

    // Calculate averages from previous values (using last 10 or fewer data points)
    if (previousData.length > 0) {
      previousData.forEach((data) => {
        averageData.PM25 += data.PM25;
        averageData.PM10 += data.PM10;
        averageData.NO2 += data.NO2;
        averageData.SO2 += data.SO2;
        averageData.CO += data.CO;
        averageData.O3 += data.O3;
      });

      const totalEntries = previousData.length;
      // Average each pollutant's value
      for (let key in averageData) {
        averageData[key] /= totalEntries;
      }
    }

    // Now merge the average data with the new data from the device
    const finalData = {
      PM25: (averageData.PM25 + newData.PM25) / 2,
      PM10: (averageData.PM10 + newData.PM10) / 2,
      NO2: (averageData.NO2 + newData.NO2) / 2,
      SO2: (averageData.SO2 + newData.SO2) / 2,
      CO: (averageData.CO + newData.CO) / 2,
      O3: (averageData.O3 + newData.O3) / 2,
    };

    // Calculate AQI for the combined data
    const { aqiValues, maxAQI } = calculateAQI(finalData);

    // Add timestamp if not present
    if (!newData.timestamp) {
      newData.timestamp = new Date().toISOString();
    }

    // Add the calculated AQI to the new data
    newData.AQI = maxAQI;

    // Save the new data, including the AQI, to MongoDB
    const sensorData = new SensorData(newData);
    await sensorData.save();

    // Emit the new data to WebSocket clients
    io.emit('newData', newData);

    res.status(200).send('Data received, AQI calculated, and sent to WebSocket');
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).send('Error saving data to MongoDB');
  }
});

module.exports = router;
