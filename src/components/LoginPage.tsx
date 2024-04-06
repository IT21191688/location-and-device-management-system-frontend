import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "./services/AlertService";
//import Logo from "../assets/logo.jpg";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "https://note-management-system-backend-3.onrender.com/api/v1/user/login",
        {
          email: email,
          password: password,
        }
      );

      const { data } = response.data;

      console.log(data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (data.user.role === "admin") {
        showSuccessToast("Login successful!");
        setTimeout(() => {
          navigate("/adminHome");
          window.location.reload();
        }, 2000);
      } else {
        showSuccessToast("Login successful!");
        setTimeout(() => {
          navigate("/userHome");
          window.location.reload();
        }, 2000);
      }

      // window.location.reload();
    } catch (error) {
      navigate("/login");
      showErrorToast("Login Unsuccessfull!");
    }
  };

  function handleSignUp() {
    navigate("/register");
    window.location.reload();
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="w-full max-w-md">
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
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-semibold"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={`w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError && "border-red-500"
                }`}
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
              />
              {emailError && (
                <div className="text-red-500 text-sm mt-1">{emailError}</div>
              )}
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
                className={`w-full border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordError && "border-red-500"
                }`}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
              {passwordError && (
                <div className="text-red-500 text-sm mt-1">{passwordError}</div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
              >
                Login
              </button>
              <button
                type="button"
                className="text-blue-500 hover:text-blue-600 transition-colors duration-300"
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
