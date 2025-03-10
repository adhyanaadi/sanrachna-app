import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Building3D from "../components/Building3D"; 

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;;

const Data = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    fetch(`${VITE_SERVER_URL}/api/projects`)
      .then((response) => response.json())
      .then((data) => {
        const foundProject = data.projects.find((proj) => proj.projectCode === id);
        setProject(foundProject);
      })
      .catch((error) => console.error("Error fetching project data:", error));
  }, [id]);

  const handleAddSensor = () => {
    if (!selectedSensor) {
      alert("Please select a sensor!");
      return;
    }

    if (project.sensors.includes(selectedSensor)) {
      alert(`Sensor ${selectedSensor} is already added to the project.`);
      return;
    }

    fetch(`${VITE_SERVER_URL}/api/projects/${id}/add-sensor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sensor: selectedSensor }),
    })
      .then((response) => response.json())
      .then((updatedProject) => {
        setProject(updatedProject.project);
        setSelectedSensor("");
      })
      .catch((error) => console.error("Error adding sensor:", error));
  };

  const handleRemoveSensor = (sensor) => {
    fetch(`${VITE_SERVER_URL}/api/projects/${id}/remove-sensor`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sensor }),
    })
      .then((response) => response.json())
      .then((updatedProject) => {
        setProject(updatedProject.project);
      })
      .catch((error) => console.error("Error removing sensor:", error));
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-300 pt-20">
        <p className="text-lg text-gray-400">Loading project details...</p>
      </div>
    );
  }

  // Categorizing sensors
  const sensorCategories = {
    Pressure: [],
    Temperature: [],
    "Class C": [],
    "Class D": [],
  };

  project.sensors.forEach((sensor) => {
    if (["sensor1", "sensor2", "sensor3", "sensor4"].includes(sensor)) {
      sensorCategories.Pressure.push(sensor);
    } else if (["sensor5", "sensor6", "sensor7", "sensor8"].includes(sensor)) {
      sensorCategories.Temperature.push(sensor);
    } else if (["sensor9", "sensor10", "sensor11", "sensor12"].includes(sensor)) {
      sensorCategories["Class C"].push(sensor);
    } else if (["sensor13", "sensor14", "sensor15", "sensor16"].includes(sensor)) {
      sensorCategories["Class D"].push(sensor);
    }
  });

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen p-6 pt-20">
      <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg flex justify-between items-start">
        <div className="w-2/3 pr-6">
          <h2 className="text-3xl font-bold text-blue-400">{project.projectName}</h2>
          <p className="text-gray-400 mt-2">
            <strong>Project Code:</strong> {project.projectCode}
          </p>
          <p className="text-gray-400">
            <strong>Info:</strong> {project.projectInfo}
          </p>
          <p className="text-gray-400">
            <strong>Location:</strong> {project.projectLocation}
          </p>
          <div className="mt-6">
            <label className="block text-white font-semibold mb-2">Select a Sensor:</label>
            <div className="flex items-center space-x-4">
              <select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Sensor --</option>
                {Object.keys(sensorCategories).map((category) => (
                  <optgroup key={category} label={category}>
                    {sensorCategories[category].map((sensor) => (
                      <option key={sensor} value={sensor}>{sensor}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button
                onClick={handleAddSensor}
                className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg transition"
              >
                Add Sensor
              </button>
            </div>
          </div>
          {Object.keys(sensorCategories).map((category) => (
            <div key={category} className="mt-6">
              <h3 className="text-xl font-semibold text-white">{category} Sensors:</h3>
              <ul className="mt-2 space-y-2">
                {sensorCategories[category].length > 0 ? (
                  sensorCategories[category].map((sensor, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                      <Link
                        to={`/projects/${id}/${sensor.replace("sensor", "")}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        {sensor}
                      </Link>
                      <div className="flex space-x-2">
                        <Link to={`/projects/${id}/${sensor.replace("sensor", "")}`}>
                          <button className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg transition">
                            View
                          </button>
                        </Link>
                        <button
                          onClick={() => handleRemoveSensor(sensor)}
                          className="bg-red-600 px-3 py-1 rounded-lg hover:bg-red-500 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No sensors added.</p>
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="w-1/3 h-[600px] flex items-center justify-center">
          <Building3D />
        </div>
      </div>
    </div>
  );
};

export default Data;
