import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SERVER_URL = import.meta.env.VITE_SERVER_URL; // ✅ Use environment variable

// ✅ WebSocket setup
const socket = io(SERVER_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

// ✅ Define 16 unique colors
const sensorColors = [
  "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FF8C33", "#A133FF",
  "#33FFF5", "#FFC733", "#5733FF", "#FF336E", "#A1FF33", "#33A1FF",
  "#FF5733", "#57FF33", "#FF3385", "#33FFBD"
];

const SensorData = () => {
  const { sensorNumber } = useParams();
  const [sensorData, setSensorData] = useState([]);
  const [storedData, setStoredData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [dataRange, setDataRange] = useState(10);
  const [isStreaming, setIsStreaming] = useState(false);
  const [intervalDuration, setIntervalDuration] = useState(500); // ✅ Added state for interval duration

  const sensorList = sensorNumber.split(",").map((num) => `sensor${num.trim()}`);
  const formattedSensorQuery = sensorList.join(",");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    if (isStreaming) {
      console.log(`Requesting data for: ${formattedSensorQuery} with interval ${intervalDuration}ms`);
      
      // ✅ Modified to send intervalDuration along with sensorQuery
      socket.emit("requestSensors", { sensorQuery: formattedSensorQuery, intervalDuration });

      socket.on("data", (data) => {
        console.log("Received data:", data);
        if (data.message === "[STREAM_END]") {
          console.log("Streaming finished");
        } else {
          const newEntry = { time: data.time || "Unknown Time" }; // ✅ Use received time

          sensorList.forEach((sensor) => {
            newEntry[sensor] = data[sensor] || 0;
          });

          // ✅ Store ALL Data but only display last "dataRange" elements
          setStoredData((prevStored) => [...prevStored, newEntry]);
          setSensorData((prevData) => [...prevData, newEntry]);
        }
      });
    } else {
      socket.off("data");
    }
  }, [isStreaming, sensorNumber, dataRange, intervalDuration]); // ✅ Added intervalDuration dependency

  const handleStart = () => {
    setIsStreaming(true);
  };

  const handleStop = () => {
    setIsStreaming(false);
    setSensorData([]);
  };

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        
        {/* Header */}
        <h2 className="text-3xl font-bold text-blue-400 text-center">Sensor Data Stream</h2>
        <p className="text-center mt-2">
          Status: <span className={isConnected ? "text-green-400" : "text-red-400"}>
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button 
            onClick={handleStart} 
            disabled={isStreaming}
            className={`px-6 py-2 rounded-lg transition ${
              isStreaming ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-500"
            }`}
          >
            Start
          </button>
          <button 
            onClick={handleStop} 
            disabled={!isStreaming}
            className={`px-6 py-2 rounded-lg transition ${
              !isStreaming ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
            }`}
          >
            Stop
          </button>
        </div>

        {/* Interval Duration Selector */}
        <div className="mt-6 text-center">
          <label className="text-lg font-semibold">Update Interval (ms): </label>
          <input
            type="number"
            min="100"
            max="5000"
            step="100"
            value={intervalDuration}
            onChange={(e) => setIntervalDuration(Number(e.target.value))}
            className="ml-2 p-2 bg-gray-700 text-white rounded-lg w-20 text-center"
          />
        </div>

        {/* Range Selector */}
        <div className="mt-6 text-center">
          <label className="text-lg font-semibold">Data Range: {dataRange}</label>
          <input
            type="range"
            min="10"
            max="50"
            step="1"
            value={dataRange}
            onChange={(e) => setDataRange(Number(e.target.value))}
            className="w-full mt-2 accent-blue-500"
          />
        </div>

        {/* Graph with Scroll */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-center text-white">Live Sensor Data</h3>
          <div className="w-full overflow-x-scroll">
            <ResponsiveContainer width={storedData.length * 30} height={300}>
              <LineChart data={storedData.slice(-dataRange)}> 
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                {sensorList.map((sensor, index) => (
                  <Line
                    key={sensor}
                    type="monotone"
                    dataKey={sensor}
                    stroke={sensorColors[index % sensorColors.length]}
                    strokeWidth={4}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-x-auto">
          <h3 className="text-lg font-semibold text-center text-white">Stored Sensor Data</h3>
          <table className="w-full text-left border-collapse border border-gray-700 mt-4">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="p-2 border border-gray-600">Time</th>
                {sensorList.map((sensor) => (
                  <th key={sensor} className="p-2 border border-gray-600">{sensor}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {storedData.slice(-dataRange).map((row, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="p-2 border border-gray-600">{row.time}</td>
                  {sensorList.map((sensor) => (
                    <td key={sensor} className="p-2 border border-gray-600">
                      {row[sensor] !== undefined ? row[sensor] : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default SensorData;
