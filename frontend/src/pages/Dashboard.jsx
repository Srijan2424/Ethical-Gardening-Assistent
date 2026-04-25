import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [userPlants, setUserPlants] = useState([]);
  const [plantStatus, setPlantStatus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  // ⏰ CLOCK
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📡 FETCH
  useEffect(() => {
    api.getRecommendations(userId).then((res) => {
      setData({
        name: res?.name || "Gardener",
        city: res?.city || "Your City",
        weather: res?.weather || {},
        forecast: res?.forecast || [],
        recommendations: res?.recommendations || [],
        user_watering_time: res?.user_watering_time || "morning"
      });
    });

    api.getUserPlants(userId).then(setUserPlants);
  }, []);

  // 🌤 ICONS
  const getWeatherIcon = (c) => {
    if (!c) return "🌤";
    if (c.includes("Cloud")) return "☁️";
    if (c.includes("Rain")) return "🌧";
    if (c.includes("Clear")) return "☀️";
    return "🌤";
  };
  // adding the plant to the garden from recommentations
  const handleAddPlant = (plantId) => {
    api.addPlant(userId, plantId)
      .then(() => {
        alert("Added to your garden 🌱");
      })
      .catch(() => {
        alert("Failed to add plant");
      });
  };

  // 🌱 WINDOW
  const getWindow = (t) =>
    t === "morning" ? { start: 6, end: 14 } : { start: 16, end: 22 };

  const inWindow = () => {
    const h = currentTime.getHours();
    const { start, end } = getWindow(data.user_watering_time);
    return h >= start && h < end;
  };

  const formatHour = (h) => {
    const suffix = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12} ${suffix}`;
  };

  // ✅ DONE
  const handleDone = (id) => {
    const { start } = getWindow(data.user_watering_time);
    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(start, 0, 0);

    setPlantStatus((p) => ({
      ...p,
      [id]: { completed: true, nextTime: next }
    }));
  };

  // ⏳ SNOOZE
  const handleSnooze = (id) => {
    const snoozeUntil = new Date(Date.now() + 5 * 60 * 1000);

    setPlantStatus((p) => ({
      ...p,
      [id]: { snoozeUntil }
    }));
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div>

      {/* 🔝 HEADER */}
      <div className="top-header">
        <h2 className="app-title">🌿 Gardening Assistant</h2>

        <div className="profile clickable" onClick={() => navigate("/profile")}>
          <div className="avatar">👤</div>
          <span>Profile</span>
        </div>
      </div>

      <h1 className="welcome-text">
        Welcome back, {data.name} 🌱
      </h1>

      <div className="dashboard-grid">

        {/* 🌦 WEATHER */}
        <div className="card weather-card apple-glass">
          <h2>{data.city}</h2>

          <h1 className="temp-big">
            {data.weather.temperature ?? "--"}°
          </h1>

          <p>{data.weather.condition}</p>

          <div className="weather-row">
            <span>💧 {data.weather.humidity}%</span>
          </div>
        </div>

        {/* 🔔 REMINDERS */}
        <div className="card apple-glass">
          <h2>Active Reminders</h2>

          {userPlants.length === 0 && (
            <p className="empty-text">No plants in your garden 🌱</p>
          )}

          {userPlants.map((plant) => {
            const status = plantStatus[plant.id] || {};
            const snoozed =
              status.snoozeUntil && currentTime < status.snoozeUntil;

            return (
              <div key={plant.id} className="reminder-item">

                <div>
                  <p className="reminder-title">💧 {plant.name}</p>
                  <p className="reminder-sub">
                    {inWindow()
                      ? "Water now"
                      : `Window: ${formatHour(6)} – ${formatHour(14)}`}
                  </p>
                </div>

                <div className="reminder-actions">
                  {!status.completed && !snoozed && (
                    <>
                      <button
                        className="done-btn"
                        disabled={!inWindow()}
                        onClick={() => handleDone(plant.id)}
                      >
                        Done
                      </button>

                      {inWindow() && (
                        <button
                          className="snooze-btn"
                          onClick={() => handleSnooze(plant.id)}
                        >
                          Snooze
                        </button>
                      )}
                    </>
                  )}
                </div>

                {snoozed && (
                  <p className="countdown">
                    ⏳ {Math.floor((status.snoozeUntil - currentTime) / 60000)}m
                  </p>
                )}

                {status.completed && (
                  <p className="success">
                    🌱 Next: {status.nextTime?.toLocaleTimeString()}
                  </p>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* 📅 FORECAST */}
      <div className="card apple-glass">
        <h2>Weekly Weather</h2>

        <div className="forecast-row">
          {data.forecast.map((d, i) => (
            <div key={i} className="forecast-pill">
              <p>{new Date(d.day).toLocaleDateString("en-US",{weekday:"short"})}</p>
              <p>{getWeatherIcon(d.condition)}</p>
              <p>{Math.round(d.temp)}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🌱 RECOMMENDATIONS */}
      <div className="card recommendations-card">
        <h2>Recommended Plants</h2>

        {data.recommendations.map((rec, i) => (
          <div key={i} className="recommendation-card">

            <div>
              <h3>{rec.plant}</h3>
              <p>{rec.advice}</p>
            </div>

            {/* ✅ ADD BUTTON FIXED */}
            <button
              className="add-btn"
              onClick={() => handleAddPlant(rec.plant_id)}
            >
              +
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}