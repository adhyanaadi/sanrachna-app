import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "aadi") {
      localStorage.setItem("auth", JSON.stringify({ username, expiryTime: new Date().getTime() + 20 * 60 * 1000 }));
      navigate("/projects");
    } else {
      setError("Invalid credentials! Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center">
            <img src="/sppl-logo.png" alt="SPPL Logo" className="w-20 h-20 object-contain" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-blue-400 mb-6">Sign In</h2>

        {error && <p className="text-red-500 text-center mb-4 bg-red-700 p-2 rounded-lg">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg mb-4 focus:ring-blue-500"
        />

        <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 transition">
          Login
        </button>
      </div>
    </div>
  );
};

export default Signin;