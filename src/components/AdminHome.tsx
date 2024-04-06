import React from "react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          to="/adminHomeDevices"
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg"
        >
          <div className="bg-white p-6">
            <img
              src="device_image_url"
              alt="Devices"
              className="w-full h-auto"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              Manage Devices
            </h2>
          </div>
        </Link>
        <Link
          to="/adminHomeLocations"
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg"
        >
          <div className="bg-white p-6">
            <img
              src="location_image_url"
              alt="Locations"
              className="w-full h-auto"
            />
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              Manage Locations
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
