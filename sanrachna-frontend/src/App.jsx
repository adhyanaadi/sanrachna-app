import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import SensorData from "./components/SensorData";
import Data from "./pages/Data";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<Data />} />
        <Route path="/projects/:id/:sensorNumber" element={<SensorData />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
