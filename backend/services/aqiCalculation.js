const breakpoints = {
  PM25: [
    { C_low: 0, C_high: 30, I_low: 0, I_high: 50 },
    { C_low: 31, C_high: 60, I_low: 51, I_high: 100 },
    { C_low: 61, C_high: 90, I_low: 101, I_high: 200 },
    { C_low: 91, C_high: 120, I_low: 201, I_high: 300 },
    { C_low: 121, C_high: 250, I_low: 301, I_high: 400 },
    { C_low: 251, C_high: 500, I_low: 401, I_high: 500 },
  ],
  PM10: [
    { C_low: 0, C_high: 50, I_low: 0, I_high: 50 },
    { C_low: 51, C_high: 100, I_low: 51, I_high: 100 },
    { C_low: 101, C_high: 150, I_low: 101, I_high: 200 },
    { C_low: 151, C_high: 200, I_low: 201, I_high: 300 },
    { C_low: 201, C_high: 350, I_low: 301, I_high: 400 },
    { C_low: 351, C_high: 500, I_low: 401, I_high: 500 },
  ],
  NO2: [
    { C_low: 0, C_high: 40, I_low: 0, I_high: 50 },
    { C_low: 41, C_high: 80, I_low: 51, I_high: 100 },
    { C_low: 81, C_high: 180, I_low: 101, I_high: 200 },
    { C_low: 181, C_high: 280, I_low: 201, I_high: 300 },
    { C_low: 281, C_high: 400, I_low: 301, I_high: 400 },
    { C_low: 401, C_high: 800, I_low: 401, I_high: 500 },
  ],
  SO2: [
    { C_low: 0, C_high: 40, I_low: 0, I_high: 50 },
    { C_low: 41, C_high: 80, I_low: 51, I_high: 100 },
    { C_low: 81, C_high: 380, I_low: 101, I_high: 200 },
    { C_low: 381, C_high: 800, I_low: 201, I_high: 300 },
    { C_low: 801, C_high: 1600, I_low: 301, I_high: 400 },
    { C_low: 1601, C_high: 5000, I_low: 401, I_high: 500 },
  ],
  CO: [
    { C_low: 0, C_high: 1, I_low: 0, I_high: 50 },
    { C_low: 1.1, C_high: 2.0, I_low: 51, I_high: 100 },
    { C_low: 2.1, C_high: 5.0, I_low: 101, I_high: 200 },
    { C_low: 5.1, C_high: 10.0, I_low: 201, I_high: 300 },
    { C_low: 10.1, C_high: 20.0, I_low: 301, I_high: 400 },
    { C_low: 20.1, C_high: 50.0, I_low: 401, I_high: 500 },
  ],
  O3: [
    { C_low: 0, C_high: 60, I_low: 0, I_high: 50 },
    { C_low: 61, C_high: 120, I_low: 51, I_high: 100 },
    { C_low: 121, C_high: 180, I_low: 101, I_high: 200 },
    { C_low: 181, C_high: 240, I_low: 201, I_high: 300 },
    { C_low: 241, C_high: 300, I_low: 301, I_high: 400 },
    { C_low: 301, C_high: 500, I_low: 401, I_high: 500 },
  ],
};

// General AQI calculation function
function calculateAQI(data) {
  let aqiValues = {};
  let maxAQI = 0;

  // Loop through each pollutant in the data object
  const pollutants = ["PM25", "PM10", "NO2", "SO2", "CO", "O3"]; // Only these pollutants should be processed
  pollutants.forEach((pollutant) => {
    const concentration = data[pollutant];

    if (concentration === undefined || concentration === null) {
      console.error(`Missing concentration data for ${pollutant}`);
      return; // Skip pollutants with missing data
    }

    const breakpoint = breakpoints[pollutant];
    if (!breakpoint) {
      console.error(`No breakpoints found for ${pollutant}`);
      return;
    }

    // Find the breakpoint for the given concentration
    for (let i = 0; i < breakpoint.length; i++) {
      const { C_low, C_high, I_low, I_high } = breakpoint[i];
      if (concentration >= C_low && concentration <= C_high) {
        const aqi =
          ((I_high - I_low) / (C_high - C_low)) * (concentration - C_low) +
          I_low;
        aqiValues[pollutant] = aqi;
        maxAQI = Math.max(maxAQI, aqi); // Update the max AQI
        break;
      }
    }
  });

  return { maxAQI };
}

module.exports = { calculateAQI };
