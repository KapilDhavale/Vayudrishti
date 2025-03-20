class AQICalculator {
    constructor() {
      // Maintain per-location history using a unique key "latitude,longitude"
      this.locationHistory = {};
      // Maintain overall history for Delhi (aggregated across all sensor readings)
      this.overallHistory = {
        subIndexHistory: {
          PM10: [],
          PM25: [],
          NO2: [],
          SO2: [],
          CO: [],
          O3: [],
          NH3: [],
          Pb: []
        },
        firstDataTimestamp: {
          PM10: null,
          PM25: null,
          NO2: null,
          SO2: null,
          CO: null,
          O3: null,
          NH3: null,
          Pb: null
        }
      };
    }
  
    // Initialize history for a given location if it doesn't exist.
    initializeLocation(locationKey) {
      if (!this.locationHistory[locationKey]) {
        this.locationHistory[locationKey] = {
          subIndexHistory: {
            PM10: [],
            PM25: [],
            NO2: [],
            SO2: [],
            CO: [],
            O3: [],
            NH3: [],
            Pb: []
          },
          firstDataTimestamp: {
            PM10: null,
            PM25: null,
            NO2: null,
            SO2: null,
            CO: null,
            O3: null,
            NH3: null,
            Pb: null
          }
        };
      }
    }
  
    // Calculate the pollutant sub-index using linear interpolation.
    calculateSubIndex(pollutant, concentration) {
      const ranges = {
        PM10: [50, 150, 250, 350, 430],
        PM25: [60, 120, 250, 350, 500],
        NO2: [40, 80, 180, 280, 400],
        SO2: [40, 80, 380, 800, 1600],
        CO: [1, 2, 10, 17, 34],
        O3: [50, 100, 168, 208, 748],
        NH3: [200, 400, 800, 1200, 1800],
        Pb: [0.5, 1, 2, 3, 5]
      };
  
      // AQI breakpoints: 0, 50, 100, 200, 300, 400, 500.
      const breakpoints = [0, 50, 100, 200, 300, 400, 500];
      const pollutantRange = ranges[pollutant];
      if (!pollutantRange) throw new Error(`Invalid pollutant: ${pollutant}`);
  
      for (let i = 0; i < pollutantRange.length; i++) {
        if (concentration <= pollutantRange[i]) {
          const lowerC = i === 0 ? 0 : pollutantRange[i - 1];
          const lowerI = breakpoints[i];
          const upperI = breakpoints[i + 1];
          return lowerI + ((concentration - lowerC) * (upperI - lowerI)) / (pollutantRange[i] - lowerC);
        }
      }
      return 500; // If concentration exceeds defined ranges.
    }
  
    // Add a new sub-index reading for a pollutant to the given history object,
    // remove readings older than 5 minutes, and return the average sub-index.
    addToHistoryAndCalculateAvg(historyObj, pollutant, subIndex) {
      if (historyObj.firstDataTimestamp[pollutant] === null) {
        historyObj.firstDataTimestamp[pollutant] = Date.now();
      }
      const currentTime = Date.now();
      historyObj.subIndexHistory[pollutant].push({ subIndex, timestamp: currentTime });
      const fiveMinutesAgo = currentTime - 5 * 60 * 1000;
      historyObj.subIndexHistory[pollutant] = historyObj.subIndexHistory[pollutant].filter(
        entry => entry.timestamp >= fiveMinutesAgo
      );
      const total = historyObj.subIndexHistory[pollutant].reduce((sum, entry) => sum + entry.subIndex, 0);
      return total / historyObj.subIndexHistory[pollutant].length;
    }
  
    // Calculate the final AQI for a sensor reading.
    // Expects sensorData in the format:
    // { name (optional), latitude, longitude, pollutants: { PM10, PM25, ... } }
    // Updates both the location-specific history and the overall Delhi history.
    calculateFinalAQI(sensorData) {
      if (
        !sensorData ||
        typeof sensorData !== 'object' ||
        sensorData.latitude === undefined ||
        sensorData.longitude === undefined ||
        !sensorData.pollutants
      ) {
        throw new Error("Sensor data is missing or invalid. Must include 'latitude', 'longitude', and 'pollutants'.");
      }
  
      const locationKey = `${sensorData.latitude},${sensorData.longitude}`;
      this.initializeLocation(locationKey);
  
      let worstAQI = -Infinity;
      let worstPollutant = null;
      let allSubIndices = {};
  
      let overallWorstAQI = -Infinity;
      let overallWorstPollutant = null;
      let overallSubIndices = {};
  
      for (const pollutant in sensorData.pollutants) {
        const concentration = sensorData.pollutants[pollutant];
        const subIndex = this.calculateSubIndex(pollutant, concentration);
  
        // Update location-specific history.
        const locAvg = this.addToHistoryAndCalculateAvg(this.locationHistory[locationKey], pollutant, subIndex);
        allSubIndices[pollutant] = locAvg;
        if (locAvg > worstAQI) {
          worstAQI = locAvg;
          worstPollutant = pollutant;
        }
  
        // Update overall history.
        const overallAvg = this.addToHistoryAndCalculateAvg(this.overallHistory, pollutant, subIndex);
        overallSubIndices[pollutant] = overallAvg;
        if (overallAvg > overallWorstAQI) {
          overallWorstAQI = overallAvg;
          overallWorstPollutant = pollutant;
        }
      }
  
      const calculationTime = new Date().toISOString();
      const locationName = sensorData.name ? sensorData.name : null;
  
      return {
        locationKey,
        locationName,
        calculationTime,
        // Location-specific result:
        AQI: worstAQI === -Infinity ? null : worstAQI,
        pollutant: worstPollutant,
        subIndices: allSubIndices,
        // Overall Delhi result:
        overall: {
          calculationTime,
          AQI: overallWorstAQI === -Infinity ? null : overallWorstAQI,
          pollutant: overallWorstPollutant,
          subIndices: overallSubIndices
        }
      };
    }
  }
  
  module.exports = AQICalculator;