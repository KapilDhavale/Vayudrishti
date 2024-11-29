const { getClosestLocation } = require("../utils/utils"); // Adjust the path if necessary
const assert = require("assert"); // Using Node.js built-in assert module

// Test cases
describe("getClosestLocation", function () {
  it("should find the closest location within the radius", function () {
    const deviceLatitude = 28.63; // Example latitude of the device (close to Connaught Place)
    const deviceLongitude = 77.21; // Example longitude of the device

    const closestLocation = getClosestLocation(deviceLatitude, deviceLongitude);

    assert.notEqual(closestLocation, null); // Check if a location is found
    assert.strictEqual(closestLocation.name, "Connaught Place"); // Check if it is Connaught Place
  });

  it("should return null if no location is within the radius", function () {
    const deviceLatitude = 28.9999; // Latitude far from the defined locations
    const deviceLongitude = 77.0; // Longitude far from the defined locations

    const closestLocation = getClosestLocation(deviceLatitude, deviceLongitude);

    assert.strictEqual(closestLocation, null); // No location should be found
  });

  it("should return the closest location when two locations are equidistant", function () {
    // Define test case where two locations are equidistant
    const deviceLatitude = 28.633; // Latitude close to both Connaught Place and Chandni Chowk
    const deviceLongitude = 77.22; // Longitude close to both locations

    const closestLocation = getClosestLocation(deviceLatitude, deviceLongitude);

    // You can adjust this based on which one you consider closer, but this will depend on actual distances
    // For example, let's expect Connaught Place to be closer in this case
    assert.strictEqual(closestLocation.name, "Connaught Place");
  });

  it("should return the correct location when it is inside the radius", function () {
    const deviceLatitude = 28.631; // Latitude near Connaught Place
    const deviceLongitude = 77.2105; // Longitude near Connaught Place

    const closestLocation = getClosestLocation(deviceLatitude, deviceLongitude);

    assert.notEqual(closestLocation, null); // Location should be found
    assert.strictEqual(closestLocation.name, "Connaught Place"); // Should be Connaught Place
  });

  it("should not return a location outside the radius", function () {
    const deviceLatitude = 28.651; // Latitude outside the radius of Connaught Place
    const deviceLongitude = 77.3; // Longitude outside the radius

    const closestLocation = getClosestLocation(deviceLatitude, deviceLongitude);

    assert.strictEqual(closestLocation, null); // No location should be found within radius
  });
});
