import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Building3D from "../components/Building3D"; // Import the 3D Building component

const VITE_SERVER_URL = "http://localhost:3000";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const authData = JSON.parse(localStorage.getItem("auth"));
  const isAuthenticated = authData && new Date().getTime() < authData.expiryTime;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin");
    } else {
      fetchProjects();
    }
  }, [isAuthenticated, navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${VITE_SERVER_URL}/api/projects`);
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error("Error fetching project data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/signin");
  };

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-blue-400">Projects Page</h2>
        </div>

        {/* Project List */}
        <div className="space-y-6">
          {projects.length > 0 ? (
            projects.map((project) => {
              const sensorNumbers = project.sensors
                .map((sensor) => sensor.replace("sensor", ""))
                .join(",");

              return (
                <div
                  key={project.projectCode}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition flex justify-between items-center"
                >
                  {/* Left Side - Project Details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white">{project.projectName}</h3>
                    <p className="text-gray-400 mt-2"><strong>Info:</strong> {project.projectInfo}</p>
                    <p className="text-gray-400"><strong>Location:</strong> {project.projectLocation}</p>
                    <p className="text-gray-400"><strong>Sensors:</strong> {project.sensors.join(", ")}</p>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-4">
                      <Link to={`/projects/${project.projectCode}`}>
                        <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg transition">
                          View Details
                        </button>
                      </Link>
                      <Link to={`/projects/${project.projectCode}/${sensorNumbers}`}>
                        <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg transition">
                          View All Sensor Data
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Right Side - 3D Model */}
                  <div className="w-1/3 h-[200px] flex items-center justify-center">
                    <Building3D />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-lg text-gray-400">Loading projects...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;