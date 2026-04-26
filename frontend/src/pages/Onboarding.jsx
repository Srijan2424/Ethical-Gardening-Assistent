import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";   // ✅ FIXED PATH

export default function Onboarding() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "Ludhiana",
    watering_time: "morning",
    care_level: "medium",
    password: ""
  });

  const email = localStorage.getItem("temp_email");

  const handleSubmit = async () => {
    const res = await api.register({
      ...form,
      email
    });

    localStorage.setItem("user_id", res.user_id);
    localStorage.removeItem("temp_email");

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2>Set Up Your Garden 🌱</h2>
        <p className="subtext">
          Tell us a bit about yourself so we can give better plant recommendations
        </p>

        {/* NAME */}
        <div className="form-group">
          <label>Your Name</label>
          <input
            placeholder="Enter your name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <label>Create Password</label>
          <input
            type="password"
            placeholder="Choose a secure password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* CITY */}
        <div className="form-group">
          <label>Your City</label>
          <small className="helper-text">
            This helps us fetch weather and recommend suitable plants
          </small>
          <select
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          >
            <option>Ludhiana</option>
            <option>Delhi</option>
            <option>Mumbai</option>
            <option>Bangalore</option>
          </select>
        </div>

        {/* WATERING TIME */}
        <div className="form-group">
          <label>Preferred Watering Time</label>
          <small className="helper-text">
            When are you usually available to water your plants?
          </small>
          <select
            onChange={(e) =>
              setForm({ ...form, watering_time: e.target.value })
            }
          >
            <option value="morning">Morning (6 AM – 11 AM)</option>
            <option value="evening">Evening (5 PM – 8 PM)</option>
          </select>
        </div>

        {/* CARE LEVEL */}
        <div className="form-group">
          <label>Gardening Experience</label>
          <small className="helper-text">
            Helps us suggest plants based on how much care you can provide
          </small>
          <select
            onChange={(e) =>
              setForm({ ...form, care_level: e.target.value })
            }
          >
            <option value="low">Beginner (Low Maintenance)</option>
            <option value="medium">Intermediate</option>
            <option value="high">Advanced (High Care)</option>
          </select>
        </div>

        <button onClick={handleSubmit}>Finish Setup</button>

      </div>
    </div>
  );
}