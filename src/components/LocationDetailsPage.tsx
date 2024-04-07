import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const LocationDetailsPage = () => {
  const [location, setLocation] = useState<any>([]);
  const [devices, setDevices] = useState([]);
  const [unallocatedDevices, setUnallocatedDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { locationId } = useParams();

  useEffect(() => {
    fetchLocationDetails();
    fetchDevices();
  }, [locationId]);

  const fetchLocationDetails = async () => {
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
        `http://localhost:8008/api/v1/location/getOneLocation/${locationId}`,
        { headers }
      );
      setLocation(response.data.data);
    } catch (error) {
      console.error("Error fetching location details:", error);
      showErrorToast("Error fetching location details");
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
        `http://localhost:8008/api/v1/device/getAllDeviceByLocation/${locationId}`,
        { headers }
      );
      setDevices(response.data.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      showErrorToast("Error fetching devices");
    }
  };

  const fetchUnallocatedDevices = async () => {
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
        "http://localhost:8008/api/v1/device/getAllUnallocatedDevice",
        { headers }
      );
      setUnallocatedDevices(response.data.data);
    } catch (error) {
      console.error("Error fetching unallocated devices:", error);
      showErrorToast("Error fetching unallocated devices");
    }
  };

  const addDeviceToLocation = async (deviceId: any) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const payload = {
        location: locationId,
      };
      await axios.put(
        "http://localhost:8008/api/v1/device/updateDevice/" + deviceId,
        payload,
        { headers }
      );
      showSuccessToast("Device added to location successfully");
      setShowModal(false);
      fetchDevices();
    } catch (error) {
      console.error("Error adding device to location:", error);
      showErrorToast("Error adding device to location");
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

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Location Details</h1>
          <button
            onClick={() => {
              setShowModal(true);
              fetchUnallocatedDevices();
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Add New Device
          </button>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-2">{location.name}</h2>
            <p className="text-gray-600">{location.address}</p>
          </div>
        </div>
        {devices.length === 0 ? (
          <p className="text-gray-600 text-lg text-center">
            No devices found in this location.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {devices.map((device: any) => (
              <div
                key={device._id}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col mb-4"
              >
                <div className="p-6 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">
                    {device.serialnumber}
                  </h2>
                  <p className="text-gray-600 mb-4">Type: {device.type}</p>

                  {/* Image display */}
                  {device.image && (
                    <img
                      src={device.image}
                      alt="Device Image"
                      className="mb-4"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  )}

                  <p className="text-gray-600 mb-4">Status:</p>
                  <select
                    value={device.status}
                    //onChange={(e) => updateStatus(device._id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="p-4 bg-gray-100 flex justify-end">
                  <button
                    onClick={() => removeDevice(device._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 mr-2"
                  >
                    Remove
                  </button>
                  {/* Add other actions like edit or more */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for adding new device */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-">
            <h2 className="text-2xl font-semibold mb-4">Add New Device</h2>
            <p>SELECT SERIAL NUMBER</p>
            <div className="flex flex-col gap-4">
              {unallocatedDevices.map((device: any) => (
                <button
                  key={device._id}
                  onClick={() => addDeviceToLocation(device._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                >
                  {device.serialnumber}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors duration-300 mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationDetailsPage;
