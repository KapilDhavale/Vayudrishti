This it the old curl request to be sent 
 curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"sensorId\": \"12345\", \"temperature\": 24.5, \"humidity\": 55, \"timestamp\": \"2024-08-31T12:00:00Z\"}"



 this is the latest curl
 curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"name\": \"Sensor A\", \"email\": \"sensora@example.com\", \"sensorId\": \"12345\", \"temperature\": 25.3, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"



curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"name\": \"Sensor A\", \"email\": \"websocketsuccessfulwithmongodb@AQISQUAD.com\", \"sensorId\": \"12345\", \"temperature\": 25.3, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"


Latest 18/11/24
curl -X POST http://localhost:3001/data -H "Content-Type: application/json" -d "{\"boxId\": \"box123\", \"aqi\": 75, \"pm2_5\": 15.4, \"pm10\": 20.1, \"temperature\": 22.5, \"humidity\": 60, \"location\": {\"latitude\": 28.7041, \"longitude\": 77.1025}}"
