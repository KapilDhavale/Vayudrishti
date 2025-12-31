const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const SensorData = require("./models/model"); // Import the Mongoose model
const { calculateAQI } = require("./services/aqiCalculation"); // Import AQI calculation function
const locations = require("./config/locations"); // Predefined locations
const { getClosestLocation } = require("./utils/utils"); // Helper function for closest location
const pollutionRoutes = require("./routes/social-analyticsRoutes"); // Import pollution-related routes
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"], // Allow requests from both frontend ports
    methods: ["GET", "POST"],
  },
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  // Emit initial data when a new connection is made
  socket.emit("initialData", { message: "Welcome, no data yet" });
});

// Use pollution-related routes
app.use("/api/pollution", pollutionRoutes);

// Route to fetch all feedback messages
app.get("/api/pollution/feedbacks", async (req, res) => {
  try {
    // Fetch feedback messages from the Pollution model
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

// POST endpoint to receive new sensor data and calculate AQI
app.post("/data", async (req, res) => {
  try {
    const newData = req.body;
    console.log("Data received:", newData); // Debugging log to see incoming data

    // Get the closest location based on latitude and longitude
    const closestLocation = getClosestLocation(
      newData.latitude,
      newData.longitude,
      locations,
    );

    if (!closestLocation) {
      return res.status(400).send("Device is not in any predefined location.");
    }

    console.log(`Closest location: ${closestLocation}`);

    // Fetch previous data for the same location in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const previousData = await SensorData.find({
      location: closestLocation,
      timestamp: { $gte: twentyFourHoursAgo },
    }).sort({ timestamp: -1 });

    console.log(`Fetching data since: ${twentyFourHoursAgo.toISOString()}`);
    console.log(`Fetched ${previousData.length} records from last 24 hours.`);

    let averageData = {
      PM25: 0,
      PM10: 0,
      NO2: 0,
      SO2: 0,
      CO: 0,
      O3: 0,
    };

    const numberOfDataPoints = previousData.length;

    if (numberOfDataPoints > 0) {
      // Calculate the average of the last 24 hours data for the same location
      previousData.forEach((data) => {
        averageData.PM25 += data.PM25;
        averageData.PM10 += data.PM10;
        averageData.NO2 += data.NO2;
        averageData.SO2 += data.SO2;
        averageData.CO += data.CO;
        averageData.O3 += data.O3;
      });

      // Calculate the average for each pollutant
      for (let key in averageData) {
        averageData[key] /= numberOfDataPoints;
      }

      console.log(`Averaging ${numberOfDataPoints} previous data points.`);
    } else {
      console.log("No previous data found for averaging.");
    }

    // Average current data with the averaged data from the last 24 hours
    const finalData = {
      PM25: (averageData.PM25 + newData.PM25) / 2,
      PM10: (averageData.PM10 + newData.PM10) / 2,
      NO2: (averageData.NO2 + newData.NO2) / 2,
      SO2: (averageData.SO2 + newData.SO2) / 2,
      CO: (averageData.CO + newData.CO) / 2,
      O3: (averageData.O3 + newData.O3) / 2,
    };

    // Calculate AQI from the final averaged data
    const { maxAQI } = calculateAQI(finalData);

    const dataToSave = {
      ...newData,
      location: closestLocation,
      AQI: maxAQI,
      timestamp: new Date().toISOString(),
    };

    const sensorData = new SensorData(dataToSave);
    await sensorData.save();

    // Emit new data to WebSocket clients
    io.emit("newData", dataToSave);

    console.log("Received new data and calculated AQI:", dataToSave);

    res.status(200).send({
      message: "Data received, AQI calculated, and sent to WebSocket",
      location: closestLocation,
      fetchedData: previousData,
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data to MongoDB");
  }
});

// API endpoint to fetch all data
app.get("/data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(100); // Limit to 100 recent records
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});

// Start the server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
