const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables
require("dotenv").config();

// Automatically run simulateData.js when this file is executed
require("./simulateData");

// Import your models and routes
const SensorData = require("./models/model");            // Your sensor data Mongoose model
const AQICalculator = require("./models/aqiCalc");      // Module to calculate AQI
const pollutionRoutes = require("./routes/social-analyticsRoutes"); 
const { getClosestLocation } = require("./utils/utils");

// Build list of allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3002",
  process.env.FRONTEND_URL // e.g. https://vayudrishti-frontend.onrender.com
].filter(Boolean);

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware: dynamic CORS
app.use(cors({
  origin: (origin, callback) => {
    // allow non-browser requests (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("CORS policy: This origin is not allowed."));
  },
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// In-memory storage (optional)
let sensorDataArray = [];
let locationAQI = {};

// AQI calculator instance
const aqiCalculator = new AQICalculator();

// Socket.IO connection handler
io.on("connection", socket => {
  console.log("New WebSocket connection");
  socket.emit("initialData", { message: "Welcome, waiting for data..." });

  socket.on("requestLatestData", () => {
    if (sensorDataArray.length > 0) {
      socket.emit("latestData", sensorDataArray[sensorDataArray.length - 1]);
    }
  });
});

// Mount social analytics routes
app.use("/api/pollution", pollutionRoutes);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the AQI Monitoring Server!",
    endpoints: {
      sensorData: { method: "POST", url: "/sensor-data", description: "Send sensor data to calculate AQI and broadcast to clients." },
      getAQI:      { method: "GET",  url: "/aqi",         description: "Retrieve latest AQI for all locations." },
      getRecentData: { method: "GET", url: "/data",       description: "Retrieve recent sensor data." },
      feedbacks:     { method: "GET", url: "/api/pollution/feedbacks", description: "Retrieve feedback messages." },
    }
  });
});

// POST: hardware data
app.post("/api/hardware", (req, res) => {
  try {
    const { temperature, humidity, mq7, mq135 } = req.body;
    const newSensorData = { timestamp: new Date().toISOString(), temperature, humidity, mq7, mq135 };
    sensorDataArray.push(newSensorData);
    io.emit("hardwareData", newSensorData);
    res.status(200).json({ message: "Hardware data received successfully", data: newSensorData });
  } catch (error) {
    console.error("Error processing hardware data:", error);
    res.status(500).json({ message: "Error processing hardware data" });
  }
});

// POST: sensor data → AQI calc, save, broadcast
app.post("/sensor-data", async (req, res) => {
  const { sensor_id, name, latitude, longitude, pollutants } = req.body;
  if (!sensor_id || !latitude || !longitude || !pollutants) {
    return res.status(400).json({ message: "Missing required data" });
  }

  const required = ["PM10","PM25","NO2","SO2","CO","O3","NH3","Pb"];
  for (const p of required) {
    if (!pollutants.hasOwnProperty(p)) {
      return res.status(400).json({ message: `Missing pollutant: ${p}` });
    }
  }

  try {
    const sensorData = { name: name || null, latitude, longitude, pollutants };
    const aqiData = aqiCalculator.calculateFinalAQI(sensorData);
    if (!aqiData) throw new Error("AQI calculation returned no data");

    const key = `${latitude},${longitude}`;
    locationAQI[key] = aqiData;

    const payload = {
      location: { name: aqiData.locationName, latitude, longitude },
      AQI: aqiData.AQI,
      worstPollutant: aqiData.worstPollutant,
      subIndices: aqiData.subIndices,
      overall: aqiData.overall,
      calculationTime: aqiData.calculationTime,
    };

    io.emit("aqiUpdate", payload);

    const closestLocation = getClosestLocation(latitude, longitude, require("./config/locations")) || { name: "Unknown" };
    const doc = new SensorData({
      sensor_id,
      deviceID: sensor_id,
      name,
      latitude,
      longitude,
      PM10: pollutants.PM10,
      PM25: pollutants.PM25,
      NO2: pollutants.NO2,
      SO2: pollutants.SO2,
      CO: pollutants.CO,
      O3: pollutants.O3,
      NH3: pollutants.NH3,
      Pb: pollutants.Pb,
      location: closestLocation,
      AQI: aqiData.AQI,
      timestamp: new Date().toISOString(),
    });
    await doc.save();
    sensorDataArray.push(doc);

    console.log("Received new sensor data and calculated AQI:", payload);
    res.status(200).json({ message: "AQI calculated and broadcasted", result: payload });
  } catch (error) {
    console.error("Error calculating AQI:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// GET: feedback messages
app.get("/api/pollution/feedbacks", async (req, res) => {
  try {
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

// GET: recent sensor data
app.get("/data", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ message: "Error fetching data from MongoDB" });
  }
});

// GET: all AQI locations
app.get("/aqi", (req, res) => {
  res.status(200).json({ message: "AQI Data", locations: locationAQI });
});

// Start the server
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
