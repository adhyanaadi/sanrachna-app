import React from "react";

const Home = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-300">
      <div className="p-6 max-w-6xl mx-auto pt-20"> {/* ✅ Added `pt-20` here */}
        
        {/* Hero Section */}
        <header className="text-center mb-12 py-12 bg-gray-800 shadow-lg rounded-lg">
          <h1 className="text-5xl font-extrabold text-blue-400">Welcome to SPPL India</h1>
          <h3 className="text-xl text-gray-400 mt-2 font-medium">An IIT Delhi Company</h3>
          <p className="mt-4 text-lg text-gray-300 max-w-3xl mx-auto">
            Ensuring <span className="font-semibold text-white">safety, longevity, and sustainability</span> 
            of infrastructure through cutting-edge technology, innovative research, and world-class 
            services in <span className="font-semibold text-white">Structural Health Monitoring (SHM)</span>.
          </p>
        </header>

        {/* About SPPL Section */}
        <section className="mb-12 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-white border-b pb-2 border-gray-700">About SPPL India</h2>
          <p className="mt-4 leading-relaxed">
            SPPL India specializes in <span className="font-semibold text-white">real-time monitoring and 
            assessment of critical infrastructure</span>, including 
            <strong> bridges, buildings, dams, and industrial structures</strong>. 
            Our solutions integrate <span className="font-semibold text-white">advanced sensor technology, AI-driven 
            analytics, and engineering expertise</span> to provide <span className="font-semibold text-white">actionable 
            insights</span> for asset management.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="mb-12 bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold text-white border-b pb-2 border-gray-700">Our Services</h2>
          <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <li className="flex items-center space-x-3">
              <span className="text-xl text-blue-400">📡</span>
              <span className="font-semibold text-white">Real-Time Structural Health Monitoring</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-xl text-blue-400">🔍</span>
              <span className="font-semibold text-white">Data-Driven Predictive Maintenance</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-xl text-blue-400">📊</span>
              <span className="font-semibold text-white">Live Sensor Data Analysis & Reporting</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-xl text-blue-400">🏗️</span>
              <span className="font-semibold text-white">Custom SHM Solutions for Large Infrastructure</span>
            </li>
          </ul>
        </section>

        {/* Call to Action */}
        <section className="text-center mt-12">
          <a href="/projects">
            <button className="mt-6 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
              View My Projects
            </button>
          </a>
        </section>

      </div>
    </div>
  );
};

export default Home;

