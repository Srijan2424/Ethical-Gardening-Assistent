import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import plantImages from "../assets/plantImages";

export default function Search() {
  const [query, setQuery] = useState("");
  const [plants, setPlants] = useState([]);

  const userId = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // 🔧 FIX: normalize plant name → image key
  const getImageKey = (name) => {
  return name
    .toLowerCase()
    .replace(/\s/g, "");
  };

  // Load all plants initially
  useEffect(() => {
    api.searchPlants("").then(setPlants);
  }, []);

  const handleSearch = () => {
    api.searchPlants(query).then(setPlants);
  };

  // Add plant to garden
  const handleAddPlant = (plantId) => {
    api.addPlant(userId, plantId)
      .then(() => {
        alert("Added to your garden 🌱");
        navigate("/garden");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add plant");
      });
  };

  return (
    <div>
      <h1>Search Plants 🌿</h1>

      <div className="search-container">
        <div className="search-box">
          <input
            placeholder="Search plants..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

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
              className="add-btn"
              onClick={() => api.addPlant(userId, plant.id)}
            >
              + Add to Garden
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}