import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900 text-gray-300">
      
      {/* 404 Error Message */}
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-gray-400 text-lg mt-2">Oops! The page you're looking for doesn't exist.</p>

      {/* Back to Home Button */}
      <Link to="/" className="mt-6">
        <button className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg text-lg font-semibold transition">
          Go Back Home
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
