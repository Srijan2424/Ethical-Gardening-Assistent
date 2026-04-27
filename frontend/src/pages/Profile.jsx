import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/styles.css";

export default function Profile() {
  const user_id = localStorage.getItem("user_id");

  const [form, setForm] = useState({
    name: "",
    city: "",
    watering_time: "morning",
    care_level: "medium"
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.getUser(user_id);
      if (res.id) {
        setForm(res);
      }
    };
    fetchUser();
  }, [user_id]);

  const handleUpdate = async () => {
    const res = await api.updateUser(user_id, form);

    if (res.message) {
      alert("Profile updated ✅");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2>👤 Edit Profile</h2>

        <div className="form-grid">

          <div className="form-group">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            >
              <option>Ludhiana</option>
              <option>Delhi</option>
              <option>Mumbai</option>
              <option>Bangalore</option>
            </select>
          </div>

          <div className="form-group">
            <label>Watering Time</label>
            <select
              value={form.watering_time}
              onChange={(e) =>
                setForm({ ...form, watering_time: e.target.value })
              }
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className="form-group">
            <label>Care Level</label>
            <select
              value={form.care_level}
              onChange={(e) =>
                setForm({ ...form, care_level: e.target.value })
              }
            >
              <option value="low">Beginner</option>
              <option value="medium">Intermediate</option>
              <option value="high">Advanced</option>
            </select>
          </div>

        </div>

        <button className="primary-btn" onClick={handleUpdate}>
          Save Changes
        </button>

      </div>
    </div>
  );
}