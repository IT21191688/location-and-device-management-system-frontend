import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "./services/AlertService";

const AdminHomeLocations = () => {
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

  const handleUpdateClick = (locationId: any) => {
    navigate(`/updateLocation/${locationId}`);
  };

  const filteredLocations = locations.filter((location: any) =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
              Add New Location
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Location Name</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Device Count</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredLocations.map((location: any) => (
                <tr
                  key={location._id}
                  className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {location.name}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {location.address}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {location.phone}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {location.deviceCount}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    <div className="flex justify-center">
                      <Link
                        to={`/location/${location._id}`}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        View Machines
                      </Link>
                      <button
                        onClick={() => handleUpdateClick(location._id)}
                        className="text-white bg-green-500 hover:bg-green-700 font-bold py-1 px-3 rounded transition-colors duration-300"
                      >
                        Update
                      </button>
                    </div>
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

export default AdminHomeLocations;
