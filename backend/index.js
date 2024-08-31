const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const app = express();
const port = 3001;

// In-memory storage
let dataStorage = [];

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// Endpoint to receive data
app.post('/data', (req, res) => {
  const receivedData = req.body;
  dataStorage.push(receivedData);

  // Log the received data to the console
  console.log("Received data:", receivedData);

  res.status(200).send('Data received');
});

// Endpoint to serve data
app.get('/data', (req, res) => {
  res.json(dataStorage);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
