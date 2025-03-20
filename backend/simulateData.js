const axios = require("axios");
const locationData = [
  {
    name: "Anand Vihar",
    latitudeRange: [28.6489, 28.6589],
    longitudeRange: [77.3155, 77.3255],
    pollutants: {
      PM10: [350, 450],
      PM25: [250, 350],
      CO: [3.5, 5.0],
      NO2: [130, 150],
      SO2: [10, 15],
      O3: [5, 10],
      NH3: [80, 100],
      Pb: [0.25, 0.4],
    },
    wind: { speed: [2, 4], direction: ["northwest", "west"] },
  },
  {
    name: "Connaught Place",
    latitudeRange: [28.6289, 28.6389],
    longitudeRange: [77.2131, 77.2231],
    pollutants: {
      PM10: [150, 200],
      PM25: [120, 160],
      CO: [1.0, 1.5],
      NO2: [50, 70],
      SO2: [3, 7],
      O3: [8, 15],
      NH3: [20, 30],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [2, 3], direction: ["northwest", "north"] },
  },
  {
    name: "Punjabi Bagh",
    latitudeRange: [28.6512, 28.6612],
    longitudeRange: [77.1358, 77.1458],
    pollutants: {
      PM10: [320, 420],
      PM25: [270, 350],
      CO: [3.0, 4.5],
      NO2: [120, 150],
      SO2: [12, 18],
      O3: [15, 25],
      NH3: [30, 50],
      Pb: [0.3, 0.5],
    },
    wind: { speed: [3, 5], direction: ["northwest", "west"] },
  },
  {
    name: "Rohini",
    latitudeRange: [28.7406, 28.7506],
    longitudeRange: [77.1116, 77.1216],
    pollutants: {
      PM10: [200, 300],
      PM25: [150, 200],
      CO: [1.5, 2.0],
      NO2: [40, 70],
      SO2: [10, 20],
      O3: [50, 80],
      NH3: [25, 35],
      Pb: [0.2, 0.3],
    },
    wind: { speed: [3, 6], direction: ["north", "northwest"] },
  },
  {
    name: "Dwarka, Sec-8",
    latitudeRange: [28.5875, 28.5975],
    longitudeRange: [77.0483, 77.0583],
    pollutants: {
      PM10: [180, 230],
      PM25: [120, 150],
      CO: [0.7, 1.2],
      NO2: [20, 40],
      SO2: [4, 8],
      O3: [40, 60],
      NH3: [15, 25],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [1.5, 3.0], direction: ["west", "northwest"] },
  },
  {
    name: "Greater Noida",
    latitudeRange: [28.5600, 28.5800],
    longitudeRange: [77.4000, 77.4200],
    pollutants: {
      PM10: [220, 270],
      PM25: [150, 180],
      CO: [2.0, 3.0],
      NO2: [60, 90],
      SO2: [10, 20],
      O3: [40, 60],
      NH3: [20, 30],
      Pb: [0.3, 0.5],
    },
    wind: { speed: [3, 5], direction: ["northwest", "north"] },
  },
  {
    name: "Saket",
    latitudeRange: [28.5317, 28.5417],
    longitudeRange: [77.2215, 77.2315],
    pollutants: {
      PM10: [170, 200],
      PM25: [130, 150],
      CO: [1.0, 1.5],
      NO2: [40, 60],
      SO2: [5, 10],
      O3: [10, 15],
      NH3: [10, 20],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [2, 4], direction: ["northwest", "west"] },
  },
  {
    name: "Ghaziabad",
    latitudeRange: [28.6624, 28.6724],
    longitudeRange: [77.3750, 77.3850],
    pollutants: {
      PM10: [220, 270],
      PM25: [150, 180],
      CO: [1.5, 2.5],
      NO2: [50, 80],
      SO2: [5, 15],
      O3: [10, 20],
      NH3: [25, 35],
      Pb: [0.2, 0.3],
    },
    wind: { speed: [4, 6], direction: ["northwest", "north"] },
  },
  {
    name: "Gurugram",
    latitudeRange: [28.4500, 28.4600],
    longitudeRange: [77.0200, 77.0300],
    pollutants: {
      PM10: [180, 230],
      PM25: [150, 180],
      CO: [1.5, 2.0],
      NO2: [40, 60],
      SO2: [5, 10],
      O3: [20, 40],
      NH3: [15, 25],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [3, 5], direction: ["northwest", "north"] },
  },
  {
    name: "Jahangirpuri",
    latitudeRange: [28.7024, 28.7124],
    longitudeRange: [77.1750, 77.1850],
    pollutants: {
      PM10: [270, 320],
      PM25: [240, 280],
      CO: [2.5, 3.0],
      NO2: [70, 100],
      SO2: [10, 20],
      O3: [15, 25],
      NH3: [30, 40],
      Pb: [0.3, 0.4],
    },
    wind: { speed: [4, 6], direction: ["northwest", "north"] },
  },
  {
    name: "Vivek Vihar",
    latitudeRange: [28.6270, 28.6370],
    longitudeRange: [77.2960, 77.3060],
    pollutants: {
      PM10: [250, 300],
      PM25: [180, 220],
      CO: [1.5, 2.5],
      NO2: [70, 90],
      SO2: [5, 10],
      O3: [20, 40],
      NH3: [20, 30],
      Pb: [0.15, 0.25],
    },
    wind: { speed: [2, 5], direction: ["north", "northwest"] },
  },
  {
    name: "Okhla Phase-2",
    latitudeRange: [28.5525, 28.5625],
    longitudeRange: [77.2845, 77.2945],
    pollutants: {
      PM10: [280, 350],
      PM25: [230, 270],
      CO: [2.5, 3.5],
      NO2: [110, 130],
      SO2: [8, 12],
      O3: [15, 25],
      NH3: [45, 55],
      Pb: [0.25, 0.35],
    },
    wind: { speed: [3, 6], direction: ["northwest", "west"] },
  },
  {
    name: "Patparganj",
    latitudeRange: [28.6250, 28.6350],
    longitudeRange: [77.2930, 77.3030],
    pollutants: {
      PM10: [300, 350],
      PM25: [250, 290],
      CO: [2.5, 3.5],
      NO2: [100, 120],
      SO2: [12, 18],
      O3: [20, 30],
      NH3: [35, 45],
      Pb: [0.25, 0.35],
    },
    wind: { speed: [3, 5], direction: ["northwest", "north"] },
  },
  {
    name: "Indirapuram",
    latitudeRange: [28.5960, 28.6060],
    longitudeRange: [77.3260, 77.3360],
    pollutants: {
      PM10: [250, 300],
      PM25: [200, 240],
      CO: [2.0, 3.0],
      NO2: [90, 110],
      SO2: [5, 10],
      O3: [10, 20],
      NH3: [30, 40],
      Pb: [0.2, 0.3],
    },
    wind: { speed: [3, 5], direction: ["northwest", "west"] },
  },
  {
    name: "Faridabad New Industrial Town",
    latitudeRange: [28.4245, 28.4345],
    longitudeRange: [77.2875, 77.2975],
    pollutants: {
      PM10: [350, 400],
      PM25: [300, 350],
      CO: [4.0, 5.0],
      NO2: [120, 140],
      SO2: [15, 20],
      O3: [30, 40],
      NH3: [50, 60],
      Pb: [0.3, 0.4],
    },
    wind: { speed: [4, 6], direction: ["northwest", "north"] },
  },
  {
    name: "Lodhi Road",
    latitudeRange: [28.5900, 28.6000],
    longitudeRange: [77.2100, 77.2200],
    pollutants: {
      PM10: [150, 200],
      PM25: [100, 150],
      CO: [1.0, 1.5],
      NO2: [40, 60],
      SO2: [5, 10],
      O3: [10, 20],
      NH3: [20, 30],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [2, 4], direction: ["northwest", "north"] },
  },
  {
    name: "Najafgarh",
    latitudeRange: [28.6080, 28.6180],
    longitudeRange: [76.9800, 76.9900],
    pollutants: {
      PM10: [300, 350],
      PM25: [250, 300],
      CO: [2.5, 3.5],
      NO2: [80, 100],
      SO2: [10, 15],
      O3: [15, 25],
      NH3: [35, 45],
      Pb: [0.2, 0.3],
    },
    wind: { speed: [4, 6], direction: ["west", "northwest"] },
  },
  {
    name: "Ashok Vihar",
    latitudeRange: [28.6900, 28.7000],
    longitudeRange: [77.1700, 77.1800],
    pollutants: {
      PM10: [200, 250],
      PM25: [150, 200],
      CO: [1.5, 2.0],
      NO2: [50, 70],
      SO2: [8, 12],
      O3: [10, 20],
      NH3: [25, 35],
      Pb: [0.1, 0.2],
    },
    wind: { speed: [3, 5], direction: ["north", "northwest"] },
  },
  {
    name: "Karol Bagh",
    latitudeRange: [28.6375, 28.6475],
    longitudeRange: [77.1900, 77.2000],
    pollutants: {
      PM10: [250, 300],
      PM25: [200, 250],
      CO: [2.0, 3.0],
      NO2: [70, 90],
      SO2: [10, 15],
      O3: [20, 30],
      NH3: [30, 40],
      Pb: [0.2, 0.3],
    },
    wind: { speed: [3, 5], direction: ["northwest", "west"] },
  },
  {
    name: "Palam",
    latitudeRange: [28.5800, 28.5900],
    longitudeRange: [77.0900, 77.1000],
    pollutants: {
      PM10: [280, 350],
      PM25: [220, 270],
      CO: [2.5, 3.5],
      NO2: [90, 120],
      SO2: [12, 18],
      O3: [15, 25],
      NH3: [35, 45],
      Pb: [0.3, 0.4],
    },
    wind: { speed: [4, 6], direction: ["west", "northwest"] },
  },
];

// Hourly AQI baselines for Delhi
const hourlyAQIBaselines = [
  200, 195, 190, 185, 180, 175, 170, 165, 160, 155, 150, 145, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250,
];

// Store last generated values for smoothing
let lastGeneratedValues = {};

// Utility for IST timestamps
const getISTTimestamp = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 330); // Convert UTC to IST
  return now.toISOString().replace("T", " ").split(".")[0]; // Format to YYYY-MM-DD HH:mm:ss
};

// Utility to get hourly AQI baseline
const getHourlyBaseline = () => {
  const hour = new Date().getHours();
  return hourlyAQIBaselines[hour];
};

// Generate pollutant data with smoothing, and include the location name
const generateDataForLocation = (location) => {
  const { name, latitudeRange, longitudeRange, pollutants } = location;
  const baselineAQI = getHourlyBaseline();

  const randomPollutants = Object.keys(pollutants).reduce((result, key) => {
    const [min, max] = pollutants[key];
    const baseValue = Math.random() * (max - min) + min;

    // Smooth changes
    const lastValue = lastGeneratedValues[key] || baseValue;
    const smoothedValue = lastValue + Math.min(Math.max(baseValue - lastValue, -1), 1);

    lastGeneratedValues[key] = smoothedValue; // Update the last value
    result[key] = smoothedValue * (baselineAQI / 200); // Scale to AQI baseline
    return result;
  }, {});

  return {
    sensor_id: `sensor_${Math.floor(Math.random() * 1000)}`,
    name, // include the location name
    latitude: Math.random() * (latitudeRange[1] - latitudeRange[0]) + latitudeRange[0],
    longitude: Math.random() * (longitudeRange[1] - longitudeRange[0]) + longitudeRange[0],
    timestamp: getISTTimestamp(),
    pollutants: randomPollutants,
  };
};

// Send data to the server
const sendData = async (data) => {
  try {
    const response = await axios.post("http://localhost:3003/sensor-data", data);
    console.log("Response from server:", response.data);
  } catch (error) {
    console.error("Error sending data:", error.response?.data || error.message);
  }
};

// Generate and send data
const generateData = () => {
  const randomLocation = locationData[Math.floor(Math.random() * locationData.length)];
  const data = generateDataForLocation(randomLocation);

  console.log("Generated Data:", data);
  sendData(data);

  // Generate data every random interval between 0 and 30 seconds (30000 ms)
  const randomDelay = Math.floor(Math.random() * 30000);
  setTimeout(generateData, randomDelay);
};

generateData();
