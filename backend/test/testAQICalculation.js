const { getClosestLocation } = require("../utils/utils"); // Adjust the relative path
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter latitude: ", (latitude) => {
  rl.question("Enter longitude: ", (longitude) => {
    const result = getClosestLocation(
      parseFloat(latitude),
      parseFloat(longitude),
    );

    if (result) {
      console.log(`Device is at or near ${result.name}`);
    } else {
      console.log("Device is not in any predefined location.");
    }

    rl.close();
  });
});
