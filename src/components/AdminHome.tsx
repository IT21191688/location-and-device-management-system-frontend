import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "./services/AlertService";

const AdminHome = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        "http://localhost:8008/api/v1/location/getAllLocations",
        { headers }
      );

      const locationsWithDeviceCount = await Promise.all(
        response.data.data.map(async (location: any) => {
          const devicesResponse = await axios.get(
            `http://localhost:8008/api/v1/device/getAllDeviceByLocation/${location._id}`,
            { headers }
          );
          const deviceCount = devicesResponse.data.data.length;
          return { ...location, deviceCount };
        })
      );

      setLocations(locationsWithDeviceCount);
    } catch (error) {
      console.error("Error fetching locations:", error);
      showErrorToast("Error fetching locations");
    }
  };

  const handleRowClick = (locationId: any) => {
    // Navigate to location details page
  };

  const handleUpdateClick = (locationId: any) => {
    navigate("/updateLocation/" + locationId);
  };

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Locations</h1>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by name"
              className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link
              to="/addNewLocation"
              className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Add New Location
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Location Name</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">Device Count</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.map((location) => (
                <tr
                  key={location._id}
                  onClick={() => handleRowClick(location._id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border px-4 py-2">{location.name}</td>
                  <td className="border px-4 py-2">{location.address}</td>
                  <td className="border px-4 py-2">{location.phone}</td>
                  <td className="border px-4 py-2">{location.deviceCount}</td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/location/${location._id}`}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      View Machines
                    </Link>
                    <button
                      onClick={() => handleUpdateClick(location._id)}
                      className="text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
