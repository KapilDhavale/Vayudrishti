const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import your models and routes
const SensorData = require("./models/model"); // Your sensor data model
const AQICalculator = require("./models/aqiCalc"); // AQI Calculation Module
const pollutionRoutes = require("./routes/social-analyticsRoutes"); // Social analytics routes
const { getClosestLocation } = require("./utils/utils"); // Helper function for closest location
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"], // Frontend clients
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// In-memory storage for sensor data (optional, used in addition to MongoDB)
let sensorDataArray = [];
let locationAQI = {};

// Create an instance of AQICalculator
const aqiCalculator = new AQICalculator();

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  
  // Send initial data on connection
  socket.emit("initialData", { message: "Welcome, waiting for data..." });

  // Optionally, you can respond to requests for the latest data
  socket.on("requestLatestData", () => {
    if (sensorDataArray.length > 0) {
      socket.emit("latestData", sensorDataArray[sensorDataArray.length - 1]);
    }
  });
});

// Use pollution-related routes (e.g., for social analytics)
app.use("/api/pollution", pollutionRoutes);

// Root Route (for debugging/info)
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the AQI Monitoring Server!",
    endpoints: {
      sensorData: {
        method: "POST",
        url: "/sensor-data",
        description: "Send sensor data to calculate AQI and broadcast to clients."
      },
      getAQI: {
        method: "GET",
        url: "/aqi",
        description: "Retrieve latest AQI for all locations."
      },
      getRecentData: {
        method: "GET",
        url: "/data",
        description: "Retrieve recent sensor data."
      },
      feedbacks: {
        method: "GET",
        url: "/api/pollution/feedbacks",
        description: "Retrieve feedback messages."
      }
    }
  });
});

// POST endpoint to receive hardware data and broadcast via Socket.IO
app.post("/api/hardware", (req, res) => {
  try {
    const hardwareData = req.body;
    console.log("Received from hardware:", hardwareData);

    const newSensorData = {
      timestamp: new Date().toISOString(),
      temperature: hardwareData.temperature,
      humidity: hardwareData.humidity,
      mq7: hardwareData.mq7,
      mq135: hardwareData.mq135,
    };

    // Store in memory (optional)
    sensorDataArray.push(newSensorData);
    
    // Emit hardware data via Socket.IO
    io.emit("hardwareData", newSensorData);

    res.status(200).json({
      message: "Hardware data received successfully",
      data: newSensorData,
    });
  } catch (error) {
    console.error("Error processing hardware data:", error);
    res.status(500).json({ message: "Error processing hardware data" });
  }
});

// POST endpoint to receive sensor data, calculate AQI, store in MongoDB, and broadcast via Socket.IO
app.post("/sensor-data", async (req, res) => {
  const { sensor_id, name, latitude, longitude, pollutants } = req.body;
  
  if (!sensor_id || !latitude || !longitude || !pollutants) {
    return res.status(400).json({ message: "Missing required data" });
  }
  
  const requiredPollutants = ["PM10", "PM25", "NO2", "SO2", "CO", "O3", "NH3", "Pb"];
  for (const pollutant of requiredPollutants) {
    if (!pollutants.hasOwnProperty(pollutant)) {
      return res.status(400).json({ message: `Missing pollutant: ${pollutant}` });
    }
  }
  
  try {
    const locationKey = `${latitude},${longitude}`;
    const sensorData = { name: name || null, latitude, longitude, pollutants };
    const aqiData = aqiCalculator.calculateFinalAQI(sensorData);
  
    if (aqiData) {
      locationAQI[locationKey] = aqiData;
  
      const payload = {
        location: { name: aqiData.locationName, latitude, longitude },
        AQI: aqiData.AQI,
        worstPollutant: aqiData.worstPollutant,
        subIndices: aqiData.subIndices,
        overall: aqiData.overall,
        calculationTime: aqiData.calculationTime,
      };
  
      // Emit AQI data via WebSocket
      io.emit("aqiUpdate", payload);
  
      // Create a new SensorData document (save to MongoDB)
      const sensorDataDoc = new SensorData({
        ...req.body,
        location: getClosestLocation(latitude, longitude, locations),
        AQI: aqiData.AQI,
        timestamp: new Date().toISOString()
      });
      await sensorDataDoc.save();
  
      // Also store in memory (optional)
      sensorDataArray.push(sensorDataDoc);
  
      console.log("Received new data and calculated AQI:", payload);
  
      res.status(200).json({
        message: "AQI calculated and broadcasted",
        result: payload
      });
    } else {
      res.status(500).json({ message: "AQI calculation failed" });
    }
  } catch (error) {
    console.error("Error calculating AQI:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET endpoint to retrieve all feedback messages from the Pollution model
app.get("/api/pollution/feedbacks", async (req, res) => {
  try {
    // Assuming the "Pollution" model is registered
    const feedbacks = await mongoose
      .model("Pollution")
      .find({ feedbackMessage: { $exists: true, $ne: null } })
      .select("feedbackMessage")
      .sort({ timestamp: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
});

// GET endpoint to fetch recent sensor data (last 100 records)
app.get("/data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Error fetching data from MongoDB" });
  }
});

// GET endpoint to retrieve AQI data for all locations
app.get("/aqi", (req, res) => {
  res.status(200).json({ message: "AQI Data", locations: locationAQI });
});

// Start the server
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
