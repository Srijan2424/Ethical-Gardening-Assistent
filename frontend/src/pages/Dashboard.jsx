import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [userPlants, setUserPlants] = useState([]);
  const [plantStatus, setPlantStatus] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [communityPosts, setCommunityPosts] = useState([]);

  const [carbonScore, setCarbonScore] = useState(
    Number(localStorage.getItem("carbon_score")) || 0
  );

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  // ⏰ CLOCK
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📡 FETCH DATA
  useEffect(() => {
    api.getRecommendations(userId)
      .then(res => setData(res || {}))
      .catch(() => setData({}));
  }, [userId]);

  useEffect(() => {
    api.getUserPlants(userId)
      .then(res => setUserPlants(Array.isArray(res) ? res : []))
      .catch(() => setUserPlants([]));
  }, [userId]);

  useEffect(() => {
    api.getPosts()
      .then(res => setCommunityPosts(Array.isArray(res) ? res : []))
      .catch(() => setCommunityPosts([]));
  }, []);

  // 🌱 ADD PLANT
  const handleAddPlant = (plantId) => {
    api.addPlant({
      user_id: userId,
      plant_id: plantId
    })
      .then(() => api.getUserPlants(userId))
      .then(res => setUserPlants(res));
  };

  // 🌿 WATER WINDOW
  const getWindow = (t) =>
    t === "morning" ? { start: 6, end: 14 } : { start: 16, end: 22 };

  const inWindow = () => {
    if (!data?.user_watering_time) return false;
    const h = currentTime.getHours();
    const { start, end } = getWindow(data.user_watering_time);
    return h >= start && h < end;
  };

  const formatWindow = (t) => {
    if (!t) return "Not set";
    if (t === "morning") return "6 AM – 2 PM";
    if (t === "evening") return "4 PM – 10 PM";
    return t;
  };

  // ✅ DONE + CARBON
  const handleDone = (id) => {
    const { start } = getWindow(data.user_watering_time);

    const next = new Date();
    next.setDate(next.getDate() + 1);
    next.setHours(start, 0, 0);

    setPlantStatus((p) => ({
      ...p,
      [id]: { completed: true, nextTime: next }
    }));

    setCarbonScore(prev => {
      const updated = prev + 1;
      localStorage.setItem("carbon_score", updated);
      return updated;
    });
  };

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

      {/* HEADER */}
      <div className="top-header">
        <h2 className="app-title">🌿 Gardening Assistant</h2>

        <div className="profile clickable" onClick={() => navigate("/profile")}>
          <div className="avatar">👤</div>
          <span>Profile</span>
        </div>
      </div>

      <h1 className="welcome-text">
        Welcome back, {data?.name || "User"} 🍃
      </h1>

      {/* GRID */}
      <div className="dashboard-grid">

        {/* WEATHER */}
        <div className="card weather-card">
          <h2>{data?.city}</h2>
          <h1>{data?.weather?.temperature ?? "--"}°</h1>
          <p>{data?.weather?.condition}</p>
          <span>💧 {data?.weather?.humidity ?? "--"}%</span>
        </div>

        {/* 🌍 CARBON CARD */}
        <div className="card carbon-card">
          <h2>🌍 Carbon Index</h2>
          <h1 className="carbon-score">{carbonScore}</h1>
          <p>+1 credit per watering 🌱</p>
        </div>

        {/* REMINDERS */}
        <div className="card">
          <h2>Active Reminders</h2>

          {userPlants.map((plant) => {
            const status = plantStatus[plant.id] || {};
            const snoozed =
              status.snoozeUntil && currentTime < status.snoozeUntil;

            return (
              <div key={plant.id} className="reminder-item">
                <div>
                  <p>Water {plant.name}</p>
                  <small>⏱ {formatWindow(data?.user_watering_time)}</small>
                </div>

                <div>
                  {!status.completed && !snoozed && (
                    <>
                      <button
                        disabled={!inWindow()}
                        onClick={() => handleDone(plant.id)}
                      >
                        Done
                      </button>

                      {inWindow() && (
                        <button onClick={() => handleSnooze(plant.id)}>
                          Snooze
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🌍 COMMUNITY (SMALL WIDGET) */}
        <div className="card community-card">
          <h3>🌍 Community</h3>

          {communityPosts.slice(0, 3).map(post => (
            <div key={post.id} className="community-widget-item">
              <strong>{post.name}</strong>
              <p>{post.content.slice(0, 40)}...</p>
            </div>
          ))}
        </div>

      </div>

      {/* FORECAST */}
      <div className="card">
        <h2>Weekly Weather</h2>
        <div className="forecast-row">
          {data?.forecast?.map((d, i) => (
            <div key={i} className="forecast-pill">
              <p className="day">
                {new Date(d.day).toLocaleDateString("en-US", { weekday: "short" })}
              </p>

              <p className="temp">
                {Math.round(d.temp)}°
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="card">
        <h2>Recommended Plants</h2>

        {data?.recommendations?.map((rec, i) => (
          <div key={i} className="recommendation-card">
            <div>
              <h3>{rec.plant}</h3>
              <p>{rec.advice}</p>
            </div>

            <button
              className={
                userPlants.some(p => p.id === rec.plant_id)
                  ? "added-btn"
                  : "add-btn"
              }
              onClick={() => handleAddPlant(rec.plant_id)}
            >
              {userPlants.some(p => p.id === rec.plant_id)
                ? "Added"
                : "+ Add"}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}