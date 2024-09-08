const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware
const SensorData = require('./model'); // Import the Mongoose model
require('dotenv').config(); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from frontend
    methods: ["GET", "POST"]
  }
});

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGO_URI; // Replace with your MongoDB URI
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('New WebSocket connection');
});

// API endpoint to receive data via POST request
app.post('/data', async (req, res) => {
  try {
    const newData = req.body;

    // Save data to MongoDB
    const sensorData = new SensorData(newData);
    await sensorData.save();

    // Emit the new data to connected WebSocket clients
    io.emit('newData', newData);

    res.status(200).send('Data received and sent to WebSocket');
  } catch (err) {
    res.status(500).send('Error saving data to MongoDB');
  }
});

// API endpoint to retrieve data via GET request
app.get('/data', async (req, res) => {
  try {
    // Fetch data from MongoDB
    const data = await SensorData.find();
    res.json(data);
  } catch (err) {
    res.status(500).send('Error fetching data from MongoDB');
  }
});

server.listen(3001, () => {
  console.log('Server listening on port 3001');
});
