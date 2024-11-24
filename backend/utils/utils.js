const haversine = require("haversine-distance");
const locations = require("../config/locations");

/**
 * Finds the closest location within the specified radius.
 * @param {number} latitude - Latitude of the device.
 * @param {number} longitude - Longitude of the device.
 * @returns {object|null} - The closest location or null if no location is within the radius.
 */
function getClosestLocation(latitude, longitude) {
  let closestLocation = null;
  let shortestDistance = Infinity;

  locations.forEach((location) => {
    const distance = haversine(
      { latitude, longitude },
      { latitude: location.latitude, longitude: location.longitude }
    );

    // Convert radius to meters and check if within the radius
    const radiusInMeters = location.radius * 1000;

    if (distance <= radiusInMeters && distance < shortestDistance) {
      closestLocation = location; // Update closest location
      shortestDistance = distance; // Update shortest distance
    }
  });

  return closestLocation;
}

module.exports = { getClosestLocation };
