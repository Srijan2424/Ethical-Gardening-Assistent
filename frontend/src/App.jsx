import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Garden from "./pages/Garden";
import Search from "./pages/Search";
import Onboarding from "./pages/Onboarding";

function AppLayout() {
  const location = useLocation();
  const userId = localStorage.getItem("user_id");

  const isAuthPage = location.pathname === "/" || location.pathname === "/onboarding";

  return (
    <div className="app-container">

      {/* ✅ Sidebar ONLY after login */}
      {!isAuthPage && userId && (
        <div className="sidebar">
          <h2>🌱 Gardening App</h2>

          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/garden">🧑‍🌾 My Garden</Link>
          <Link to="/search">🪴 Search Plants</Link>

          {/* 🔴 Logout Button */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user_id");
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="main">
        <Routes>

          {/* Login */}
          <Route
            path="/"
            element={userId ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* Onboarding */}
          <Route
            path="/onboarding"
            element={<Onboarding />}
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={userId ? <Profile /> : <Navigate to="/" />}
          />

          <Route
            path="/dashboard"
            element={userId ? <Dashboard /> : <Navigate to="/" />}
          />

          <Route
            path="/garden"
            element={userId ? <Garden /> : <Navigate to="/" />}
          />

          <Route
            path="/search"
            element={userId ? <Search /> : <Navigate to="/" />}
          />

        </Routes>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}