import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";
import { FaTrash } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
        "http://localhost:8008/api/v1/user/getAllUsers",
        {
          headers,
        }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorToast("Error fetching users");
    }
  };

  const handleDelete = async (userId: any) => {
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
        `http://localhost:8008/api/v1/user/deleteUser/${userId}`,
        {
          headers,
        }
      );
      setUsers(users.filter((user: any) => user._id !== userId));
      showSuccessToast("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      showErrorToast("Error deleting user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <Link
            to="/adminRegister"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Add New User
          </Link>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">First Name</th>
                <th className="py-3 px-6 text-left">Last Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Telephone</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {users.map((user: any) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.firstname}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.lastname}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.telephone}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.address}
                  </td>
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {user.role}
                  </td>
                  <td className="py-3 px-6 text-center whitespace-nowrap">
                    {/* <Link
                      to={`/updateUser/${user._id}`}
                      className="text-blue-500 mr-2"
                    >
                      <FaEdit />
                    </Link> */}
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500"
                    >
                      <FaTrash />
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

export default UserManagement;
