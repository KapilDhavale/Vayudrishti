const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const SensorData = require("./models/model"); // Import the Mongoose model
const { calculateAQI } = require("./services/aqiCalculation"); // Import AQI calculation function
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
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("New WebSocket connection");
  // Emit current AQI on new connection
  socket.emit("initialData", { message: "Welcome, no data yet" });
});

// API endpoint to receive new data and calculate AQI
app.post("/data", async (req, res) => {
  try {
    const newData = req.body;

    // Calculate the start of the 24-hour window
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch data from the last 24 hours
    const previousData = await SensorData.find({
      deviceID: newData.deviceID,
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
      previousData.forEach((data) => {
        averageData.PM25 += data.PM25;
        averageData.PM10 += data.PM10;
        averageData.NO2 += data.NO2;
        averageData.SO2 += data.SO2;
        averageData.CO += data.CO;
        averageData.O3 += data.O3;
      });

      for (let key in averageData) {
        averageData[key] /= numberOfDataPoints;
      }

      console.log(
        `Number of AQI data points used for averaging: ${numberOfDataPoints}`,
      );
    } else {
      console.log("No previous data found for averaging.");
    }

    const finalData = {
      PM25: (averageData.PM25 + newData.PM25) / 2,
      PM10: (averageData.PM10 + newData.PM10) / 2,
      NO2: (averageData.NO2 + newData.NO2) / 2,
      SO2: (averageData.SO2 + newData.SO2) / 2,
      CO: (averageData.CO + newData.CO) / 2,
      O3: (averageData.O3 + newData.O3) / 2,
    };

    const { maxAQI } = calculateAQI(finalData);

    const dataToSave = {
      ...newData,
      AQI: maxAQI,
      timestamp: new Date().toISOString(),
    };

    const sensorData = new SensorData(dataToSave);
    await sensorData.save();

    io.emit("newData", dataToSave);

    console.log("Received new data and calculated AQI:", dataToSave);

    res.status(200).send({
      message: "Data received, AQI calculated, and sent to WebSocket",
      fetchedData: previousData,
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).send("Error saving data to MongoDB");
  }
});

// API endpoint to fetch data
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
server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
