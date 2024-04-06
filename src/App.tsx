import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AdminHome from "./components/AdminHome";
import NavBar from "./components/NavBar";
import AdminRegister from "./components/AdminRegister";
import LoginPage from "./components/LoginPage";

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
          {user === "user" && (
            <>
              <Route path="/register" element={<AdminRegister />} />
              <Route path="/adminHome" element={<AdminHome />} />
              {/* <Route path="/AddNotePage" element={<AddNotePage />} /> */}
              {/* <Route path="/EditNotePage/:noteId" element={<EditNotePage />} /> */}
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
