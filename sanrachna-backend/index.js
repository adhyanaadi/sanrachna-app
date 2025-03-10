
require("dotenv").config();
const express = require("express");
const { parse } = require("csv-parse");
const fs = require("fs");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/api/projects", (req, res) => {
  const filePath = "./public/projectData.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading data" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/projects/:id/add-sensor", (req, res) => {
  const { id } = req.params;
  const { sensor } = req.body;

  if (!sensor) {
    return res.status(400).json({ message: "Sensor name is required" });
  }

  const filePath = "./public/projectData.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading data" });

    let jsonData = JSON.parse(data);
    const project = jsonData.projects.find((proj) => proj.projectCode === id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!project.sensors.includes(sensor)) {
      project.sensors.push(sensor);
    } else {
      return res.status(400).json({ message: "Sensor already exists" });
    }

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ message: "Error updating file" });

      res.json({ message: `Sensor ${sensor} added successfully`, project });
    });
  });
});

app.delete("/api/projects/:id/remove-sensor", (req, res) => {
  const { id } = req.params;
  const { sensor } = req.body;

  if (!sensor) {
    return res.status(400).json({ message: "Sensor name is required" });
  }

  const filePath = "./public/projectData.json";

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading data" });

    let jsonData = JSON.parse(data);
    const project = jsonData.projects.find((proj) => proj.projectCode === id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.sensors.includes(sensor)) {
      project.sensors = project.sensors.filter((s) => s !== sensor);
    } else {
      return res.status(400).json({ message: "Sensor not found" });
    }

    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8", (err) => {
      if (err) return res.status(500).json({ message: "Error updating file" });

      res.json({ message: `Sensor ${sensor} removed successfully`, project });
    });
  });
});

const io = socketIo(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  let streamInterval = null;

  socket.on("requestSensors", ({ sensorQuery, intervalDuration }) => {
    if (streamInterval) {
      console.log("Stopping previous data stream...");
      clearInterval(streamInterval);
    }

    const requestedSensors = sensorQuery
      .split(",")
      .map((sensor) => parseInt(sensor.replace("sensor", ""), 10));

    if (requestedSensors.length === 0 || requestedSensors.some(isNaN)) {
      socket.emit("data", { error: "Invalid or no sensors specified" });
      return;
    }

    const parser = parse({ columns: false }, function (err, records) {});
    const stream = fs
      .createReadStream("./public/Test_Sensor_Data.csv")
      .pipe(parser);

    let dataRows = [];

    stream.on("data", (row) => {
      const sensorData = {};
      sensorData["time"] = row[0];

      requestedSensors.forEach((sensorIndex) => {
        if (sensorIndex >= 1 && sensorIndex <= 17) {
          sensorData[`sensor${sensorIndex}`] = parseFloat(row[sensorIndex]);
        }
      });

      if (Object.keys(sensorData).length > 1) {
        dataRows.push(sensorData);
      }
    });

    stream.on("end", () => {
      if (dataRows.length === 0) {
        socket.emit("data", {
          error: "No data available for requested sensors",
        });
        return;
      }

      let index = 0;
      const interval = intervalDuration || 500;

      streamInterval = setInterval(() => {
        if (index < dataRows.length) {
          socket.emit("data", dataRows[index]);
          index++;
        } else {
          socket.emit("data", { message: "[STREAM_END]" });
          clearInterval(streamInterval);
        }
      }, interval);
    });

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      socket.emit("data", { error: "Failed to read CSV" });
    });
  });

  socket.on("stopSensors", () => {
    console.log("Stopping data stream...");
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    if (streamInterval) {
      clearInterval(streamInterval);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
