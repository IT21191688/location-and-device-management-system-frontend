import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const AdminHomeLocations = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [devices, setDevices] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLocations();
    fetchDevices();
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

  const handleNavigateRowClick = (locationId: any) => {
    navigate(`/locationDetailsPage/${locationId}`);
  };

  const handleDeleteClick = async (locationId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Find all devices with the specified locationId
      const devicesToUpdate = devices.filter(
        (device: any) => device.location === locationId
      );

      //alert(devicesToUpdate);

      await Promise.all(
        devicesToUpdate.map(async (device: any) => {
          removeDevice(device._id);
        })
      );

      await axios.delete(
        `http://localhost:8008/api/v1/location/deleteLocation/${locationId}`,
        { headers }
      );

      setDevices((prevDevices: any) =>
        prevDevices.map((device: any) => ({
          ...device,
          // Update the location field of associated devices to null
          location: devicesToUpdate.some((d: any) => d._id === device._id)
            ? null
            : device.location,
        }))
      );

      showSuccessToast("Location deleted successfully");
      fetchLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
      showErrorToast("Error deleting location");
    }
  };

  const removeDevice = async (deviceId: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const deviceData = {
        location: null,
      };
      await axios.put(
        "http://localhost:8008/api/v1/device/updateDevice/" + deviceId,
        deviceData,
        { headers }
      );
      showSuccessToast("Device removed successfully");
      fetchDevices();
    } catch (error) {
      console.error("Error removing device:", error);
      showErrorToast("Error removing device");
    }
  };

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

      setDevices(response.data.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      showErrorToast("Error fetching devices");
    }
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
                  onClick={() => handleNavigateRowClick(location._id)}
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event from bubbling up to the row
                          handleDeleteClick(location._id);
                        }}
                        className="text-white bg-red-400 hover:bg-red-700 font-bold py-1 px-3 rounded transition-colors duration-300"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click event from bubbling up to the row
                          handleUpdateClick(location._id);
                        }}
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
