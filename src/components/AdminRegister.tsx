import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./services/AlertService";
//import Logo from "../assets/logo.jpg";
import axios from "axios";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const user = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        telephone: telephone,
        address: address,
        password: password,
        role: "user",
      };

      const response = await axios.post(
        "https://note-management-system-backend-3.onrender.com/api/v1/user/register",
        {
          user: user,
        }
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setTelephone("");
      setAddress("");
      setPassword("");

      if (response.status === 201) {
        showSuccessToast("Registration Successful");
        setTimeout(() => {
          navigate("/login");
          window.location.reload();
        }, 2000);
      } else {
        showErrorToast("Registration Unsuccessful. Please try again.");
      }
    } catch (error) {
      showErrorToast("Error occurred:");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="w-full max-w-md mt-2">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <img
              //src={Logo}
              alt="Logo"
              className="h-16 w-16 rounded-full object-cover"
            />
            <h1 className="text-3xl font-bold text-center ml-4">
              Note Management System
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Customer Registration
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-gray-700 font-semibold"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-gray-700 font-semibold"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="telephone"
                className="block text-gray-700 font-semibold"
              >
                Telephone
              </label>
              <input
                type="tel"
                id="telephone"
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 font-semibold"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-semibold"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                className="btn-primary w-full rounded-md bg-blue-500 text-white py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                Register
              </button>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-600 transition-colors duration-300 ml-2"
              >
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
