🌬️ Vayudrishti – Smart Air Quality Monitoring System

Finalist – Smart India Hackathon 2024

Vayudrishti is a real-time air quality monitoring system that deploys IoT-based AQI sensors on public transport (like buses) and high-rise buildings. It captures air quality and GPS data, maps the readings to predefined zones, and displays real-time AQI analytics for micro-locations. Built for urban pollution awareness, actionable data, and sustainable city planning.

---

🧠 Problem Statement

The technological solutions for capturing AQI values through mobile and other forms of stations.

---

🎯 Objectives

- Monitor pollution levels dynamically via mobile sensors
- Map moving GPS data to fixed geographical zones
- Provide live AQI updates to citizens and authorities
- Enable data-driven decisions for traffic, health, and urban planning

---

🧩 Key Features

- 📍 Zone Mapping – Maps live GPS location of the device to nearest predefined AQI zone  
- 🌐 Live AQI Dashboard – Real-time air quality monitoring via WebSockets  
- 🔒 Role-based Access – Firebase authentication for users and admins  
- 🧾 Historical Data – Stores sensor logs and past AQI for trends  
- 🚍 Mobile + Fixed Nodes – Designed for both buses (mobile) and towers (static)

---













This it the old curl request to be sent
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"sensorId\": \"12345\", \"temperature\": 24.5, \"humidity\": 55, \"timestamp\": \"2024-08-31T12:00:00Z\"}"

this is the latest curl
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"name\": \"Sensor A\", \"email\": \"sensora@example.com\", \"sensorId\": \"12345\", \"temperature\": 25.3, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"

curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"name\": \"Sensor A\", \"email\": \"websocketsuccessfulwithmongodb@AQISQUAD.com\", \"sensorId\": \"12345\", \"temperature\": 25.3, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"

Latest 18/11/24
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"boxId\": \"box123\", \"aqi\": 75, \"pm2_5\": 15.4, \"pm10\": 20.1, \"temperature\": 22.5, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"

Latest 24/11/24
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"deviceID\":\"device123\",\"PM25\":35,\"PM10\":60,\"NO2\":10,\"SO2\":5,\"CO\":0.5,\"O3\":45,\"temperature\":25,\"humidity\":60,\"location\":{\"latitude\":28.7041,\"longitude\":77.1025}}"

Latest 25/11/24
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"deviceID\":\"bus-003\",\"latitude\":28.6375,\"longitude\":77.1130,\"PM25\":92,\"PM10\":125,\"NO2\":50,\"SO2\":18,\"CO\":1.0,\"O3\":60}"
