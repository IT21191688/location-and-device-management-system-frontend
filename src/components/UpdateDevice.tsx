import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const UpdateDevice = () => {
  const navigate = useNavigate();
  const { deviceId } = useParams();
  const [serialNumber, setSerialNumber] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchDeviceDetails();
    fetchLocations();
  }, []);

  const fetchDeviceDetails = async () => {
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
        `http://localhost:8008/api/v1/device/getOneDevice/${deviceId}`,
        {
          headers,
        }
      );
      const { serialnumber, type, status, location } = response.data.data;
      setSerialNumber(serialnumber);
      setType(type);
      setStatus(status);
      setLocation(location);
    } catch (error) {
      console.error("Error fetching device details:", error);
      showErrorToast("Error fetching device details");
    }
  };

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
        {
          headers,
        }
      );
      setLocations(response.data.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      showErrorToast("Error fetching locations");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const deviceData = {
        serialNumber,
        type,
        status,
        location,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        `http://localhost:8008/api/v1/device/updateDevice/${deviceId}`,
        deviceData,
        { headers }
      );

      showSuccessToast("Device updated successfully!");
      navigate("/adminHomeDevices");
    } catch (error) {
      console.error("Error updating device:", error);
      showErrorToast("Error updating device");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Update Device</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="serialNumber"
              className="block text-gray-700 font-bold mb-2"
            >
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter serial number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 font-bold mb-2"
            >
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select type</option>
              <option value="pos">POS</option>
              <option value="kiosk">Kiosk</option>
              <option value="signage">Signage</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block text-gray-700 font-bold mb-2"
            >
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2"
            >
              Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {locations.map((loc: any) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-1/2 mr-2"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => navigate("/adminHomeDevices")}
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 w-1/2 ml-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDevice;
