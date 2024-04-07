import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AdminHome from "./components/AdminHome";
import NavBar from "./components/NavBar";
import LoginPage from "./components/LoginPage";
import AddNewLocation from "./components/AddNewLocation";
import UpdateLocation from "./components/UpdateLocation";
import AdminHomeLocations from "./components/AdminHomeLocations";
import AdminHomeDevices from "./components/AdminHomeDevices";
import AddNewDevice from "./components/AddNewDevice";
import UpdateDevice from "./components/UpdateDevice";
import LocationDetailsPage from "./components/LocationDetailsPage";
import UserManagement from "./components/UserManagement";
import AddNewAdmin from "./components/AddNewAdmin";

function App() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(localStorage.getItem("role") || null);
  }, []);

  return (
    <Router>
      <div>
        <NavBar />
        <ToastContainer />

        <Routes>
          {/* {user === "admin" && <Route path="/" element={<UserHomePage />} />} */}
          {user === "admin" && (
            <>
              <Route path="/adminRegister" element={<AddNewAdmin />} />

              <Route path="/adminHome" element={<AdminHome />} />

              <Route path="/adminHomeDevices" element={<AdminHomeDevices />} />

              <Route path="/addNewDevice" element={<AddNewDevice />} />

              <Route
                path="/updateDevice/:deviceId"
                element={<UpdateDevice />}
              />

              <Route path="/addNewLocation" element={<AddNewLocation />} />

              <Route
                path="/adminHomeLocations"
                element={<AdminHomeLocations />}
              />
              <Route
                path="/updateLocation/:locationId"
                element={<UpdateLocation />}
              />

              <Route
                path="/locationDetailsPage/:locationId"
                element={<LocationDetailsPage />}
              />

              <Route path="/userManagement" element={<UserManagement />} />
            </>
          )}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
