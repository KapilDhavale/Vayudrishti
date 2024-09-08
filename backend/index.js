const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const SensorData = require('./model'); // Import your MongoDB model

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect("mongodb+srv://kapildhavale602:<password>@connectiontemplate.vricl.mongodb.net/?retryWrites=true&w=majority&appName=connectiontemplate", { useNewUrlParser: true, useUnifiedTopology: true });


// Endpoint to receive data and store it in MongoDB
app.post('/data', async (req, res) => {
  try {
    const receivedData = req.body;

    // Create a new document in MongoDB
    const sensorData = new SensorData(receivedData);
    await sensorData.save(); // Save the data to MongoDB

    console.log('Data saved to MongoDB:', receivedData);
    res.status(200).send('Data received and saved to MongoDB');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Endpoint to fetch data from MongoDB
app.get('/data', async (req, res) => {
  try {
    const data = await SensorData.find(); // Fetch all data from MongoDB
    res.json(data); // Send data to frontend
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
