import { Link } from "react-router-dom";
import { FaLaptop, FaMapMarkerAlt, FaUser } from "react-icons/fa"; // Importing icons from react-icons library

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          to="/adminHomeDevices"
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg"
        >
          <div className="bg-white p-6 flex flex-col items-center">
            <FaLaptop className="text-4xl text-gray-800 mb-4" /> {/* Icon */}
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              Manage Devices
            </h2>
          </div>
        </Link>

        <Link
          to="/adminHomeLocations"
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg"
        >
          <div className="bg-white p-6 flex flex-col items-center">
            <FaMapMarkerAlt className="text-4xl text-gray-800 mb-4" />{" "}
            {/* Icon */}
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              Manage Locations
            </h2>
          </div>
        </Link>

        <Link
          to="/userManagement"
          className="rounded-lg overflow-hidden shadow-md hover:shadow-lg"
        >
          <div className="bg-white p-6 flex flex-col items-center">
            <FaUser className="text-4xl text-gray-800 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mt-4">
              User Management
            </h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminHome;
