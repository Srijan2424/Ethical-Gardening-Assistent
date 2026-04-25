import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    watering_time: "morning",
    care_level: "medium"
  });

  useEffect(() => {
    api.getUser(userId).then((res) => {
      setForm(res);
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    api.updateUser(userId, form).then(() => {
      alert("Profile updated ✅");
      navigate("/dashboard");
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Edit Profile 👤</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} />

        <label>City</label>
        <input name="city" value={form.city} onChange={handleChange} />

        <label>Watering Time</label>
        <select name="watering_time" value={form.watering_time} onChange={handleChange}>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>

        <label>Care Level</label>
        <select name="care_level" value={form.care_level} onChange={handleChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}