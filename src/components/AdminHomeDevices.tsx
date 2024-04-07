import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const AdminHomeDevices = () => {
  const [devices, setDevices] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
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
        "http://localhost:8008/api/v1/device/getAllDevices",
        { headers }
      );
      const updatedDevices = await Promise.all(
        response.data.data.map(async (device: any) => {
          if (device.location) {
            const locationResponse = await axios.get(
              `http://localhost:8008/api/v1/location/getOneLocation/${device.location}`,
              { headers }
            );
            const locationName = locationResponse.data.data.name;
            return { ...device, location: locationName };
          } else {
            // If location is null, set locationName as null
            return { ...device, location: "ALLOCATED REMOVED" };
          }
        })
      );
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      showErrorToast("Error fetching devices");
    }
  };

  const handleDelete = async (deviceId: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(
        `http://localhost:8008/api/v1/device/deleteDevice/${deviceId}`,
        { headers }
      );
      setDevices((prevDevices: any) =>
        prevDevices.filter((device: any) => device._id !== deviceId)
      );
      showSuccessToast("Device deleted successfully");
    } catch (error) {
      console.error("Error deleting device:", error);
      showErrorToast("Error deleting device");
    }
  };

  const filteredDevices = devices.filter((device: any) =>
    device.serialnumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Devices</h1>
          <input
            type="text"
            placeholder="Search by serialnumber"
            className="border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Link
            to="/addNewDevice"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Add New Device
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Serial Number</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Image</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {filteredDevices.map((device: any) => (
                <tr
                  key={device._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {device.serialnumber}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {device.type}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {device.status}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {device.location}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <img
                      src={device.image}
                      alt={`Device ${device.serialnumber}`}
                      className="h-16 w-auto"
                    />
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDelete(device._id)}
                        className="text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-3 rounded mr-2 transition-colors duration-300"
                      >
                        Delete
                      </button>
                      <Link
                        to={`/updateDevice/${device._id}`}
                        className="text-white bg-green-500 hover:bg-green-700 font-bold py-1 px-3 rounded transition-colors duration-300"
                      >
                        Update
                      </Link>
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

export default AdminHomeDevices;
