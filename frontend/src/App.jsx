import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation
} from "react-router-dom";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Garden from "./pages/Garden";
import Search from "./pages/Search";
import Onboarding from "./pages/Onboarding";
import Community from "./pages/community"; // ✅ FIXED CASE

function AppLayout() {
  const location = useLocation();
  const userId = localStorage.getItem("user_id");

  const isAuthPage =
    location.pathname === "/" || location.pathname === "/onboarding";

  return (
    <div className="app-container">

      {/* ✅ Sidebar ONLY after login */}
      {!isAuthPage && userId && (
        <div className="sidebar">
          <h2>🌱 Gardening App</h2>

          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/garden">🧑‍🌾 My Garden</Link>
          <Link to="/search">🪴 Search Plants</Link>
          <Link to="/community">🌍 Community</Link>

          {/* 🔴 Logout */}
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

      {/* MAIN CONTENT */}
      <div className="main">
        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={userId ? <Navigate to="/dashboard" /> : <Login />}
          />

          {/* ONBOARDING */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* PROFILE */}
          <Route
            path="/profile"
            element={userId ? <Profile /> : <Navigate to="/" />}
          />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={userId ? <Dashboard /> : <Navigate to="/" />}
          />

          {/* GARDEN */}
          <Route
            path="/garden"
            element={userId ? <Garden /> : <Navigate to="/" />}
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={userId ? <Search /> : <Navigate to="/" />}
          />

          {/* 🌍 COMMUNITY (🔥 THIS WAS MISSING) */}
          <Route
            path="/community"
            element={userId ? <Community /> : <Navigate to="/" />}
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