import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import plantImages from "../assets/plantImages";

export default function Garden() {
  const [plants, setPlants] = useState(null);
  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const getImageKey = (name) => {
    return name.toLowerCase().replace(/\s/g, "");
  };

  useEffect(() => {
    api.getUserPlants(userId)
      .then((res) => setPlants(res || []))
      .catch(() => setPlants([]));
  }, [userId]);

  if (plants === null) return <p>Loading your garden...</p>;

  if (plants.length === 0) {
    return (
      <div className="empty-state">
        <h2>No plants in your garden 🌱</h2>
        <p>You haven’t added any plants yet.</p>

        <button onClick={() => navigate("/search")}>
          Find Plants
        </button>
      </div>
    );
  }

  const handleRemove = (plantId) => {
    api.removePlant(userId, plantId).then(() => {
      setPlants(prev => prev.filter(p => p.id !== plantId));
    });
  };

  return (
    <div>
      <h1>My Garden 🌿 ({plants.length})</h1>

      <div className="plant-grid">
        {plants.map((plant) => (
          <div key={plant.id} className="plant-card">

            <img
              src={
                plantImages[getImageKey(plant.name)] ||
                "https://via.placeholder.com/150"
              }
              alt={plant.name}
              className="plant-image"
            />

            <h3>{plant.name}</h3>
            <p>{plant.description}</p>

            <button
              className="remove-btn"
              onClick={() => handleRemove(plant.id)}
            >
              Remove ❌
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}