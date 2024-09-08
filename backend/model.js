const mongoose = require('mongoose');

// Define a schema for the sensor data
const sensorDataSchema = new mongoose.Schema({
    name: String,
    email: String,
    sensorId: String,
    temperature: Number,
    humidity: Number,
    timestamp: {
        type: Date,
        default: Date.now
    },
    location: {
        latitude: Number,
        longitude: Number
    }
});

// Create a model using the schema
const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
