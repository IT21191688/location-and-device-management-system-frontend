import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";

const UpdateLocation = () => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    // Fetch location details when component mounts
    fetchLocationDetails();
  }, []);

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
        {
          headers,
        }
      );
      const { name, address, phone } = response.data.data;
      setName(name);
      setAddress(address);
      setPhone(phone);
    } catch (error) {
      console.error("Error fetching location details:", error);
      showErrorToast("Error fetching location details");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      setPhoneError("Invalid phone number");
      return;
    } else {
      setPhoneError("");
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token is missing in localStorage");
        return;
      }

      const locationData = {
        name,
        address,
        phone,
      };

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.put(
        `http://localhost:8008/api/v1/location/updateLocation/${locationId}`,
        locationData,
        { headers }
      );

      showSuccessToast("Location updated successfully!");
      navigate("/adminHome");
    } catch (error) {
      console.error("Error updating location:", error);
      showErrorToast("Error updating location");
    }
  };

  const validatePhone = (phone: any) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Update Location
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 font-bold mb-2"
            >
              Location Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter location name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-gray-700 font-bold mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter location address"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="phone"
              className="block text-gray-700 font-bold mb-2"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                phoneError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              required
            />
            {phoneError && (
              <p className="text-red-500 text-xs italic mt-1">{phoneError}</p>
            )}
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
              onClick={() => navigate("/adminHome")}
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

export default UpdateLocation;
