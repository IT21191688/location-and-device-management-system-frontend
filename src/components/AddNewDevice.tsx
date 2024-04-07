import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const AddNewDevice = () => {
  const navigate = useNavigate();
  const [serialNumber, setSerialNumber] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("active");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [locations, setLocations] = useState([]);

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

      if (!validateSerialNumber(serialNumber)) {
        showErrorToast("Serial number must be a 10-character number.");
        return;
      }

      const formData = new FormData();
      formData.append("serialnumber", serialNumber);
      formData.append("type", type);
      formData.append("status", status);
      if (image) {
        formData.append("image", image);
      }
      formData.append("location", location);

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      await axios.post(
        "http://localhost:8008/api/v1/device/createDevice",
        formData,
        { headers }
      );

      showSuccessToast("Device added successfully!");
      setTimeout(() => {
        navigate("/adminHomeDevices");
      }, 2000);
    } catch (error) {
      console.error("Error creating device:", error);
      showErrorToast("Error creating device");
    }
  };

  const validateSerialNumber = (serialNumber: string) => {
    return /^\d{10}$/.test(serialNumber);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Device
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="serialNumber"
              className="block text-gray-700 font-bold mb-2"
            >
              Serial Number *
            </label>
            <input
              type="text"
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1234567890"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 font-bold mb-2"
            >
              Type *
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
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-bold mb-2"
            >
              Location *
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select location</option>
              {locations.map((loc: any) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 font-bold mb-2"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              onChange={(e) =>
                setImage(
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />
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

export default AddNewDevice;
