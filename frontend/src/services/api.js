// 🔥 IMPORTANT: Replace with your REAL Render backend URL
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:10000"
    : "https://ethical-gardening-assistant.onrender.com";
  
// ✅ Common response handler (prevents crashes)
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ API ERROR:", text);
    throw new Error("API request failed");
  }
  return res.json();
};

export const api = {

  // 🔍 Check if user exists
  checkUser: (email) =>
    fetch(`${BASE_URL}/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    }).then(handleResponse),

  // 🔐 Login
  login: (email, password) =>
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),

  // 🆕 Register
  register: (data) =>
    fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handleResponse),

  // 🌱 Recommendations
  getRecommendations: (userId) => {
    const id = userId || 1; // fallback
    console.log("📡 Fetching recommendations:", `${BASE_URL}/recommendations/${id}`);
    return fetch(`${BASE_URL}/recommendations/${id}`)
      .then(handleResponse);
  },

  // 🔎 Search Plants
  searchPlants: (query) =>
    fetch(`${BASE_URL}/plants/search?q=${query}`)
      .then(handleResponse),

  // 🌿 Get User Plants
  getUserPlants: (userId) => {
    const id = userId || 1;
    return fetch(`${BASE_URL}/user-plants/${id}`)
      .then(handleResponse);
  },

  // ➕ Add Plant
  addPlant: (userId, plantId) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        plant_id: Number(plantId)
      })
    }).then(handleResponse),

  // ➖ Remove Plant
  removePlant: (userId, plantId) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        plant_id: Number(plantId)
      })
    }).then(handleResponse),

  // 👤 Get user profile
  getUser: (userId) =>
    fetch(`${BASE_URL}/user/${userId}`)
      .then(handleResponse),

  // ✏️ Update user profile
  updateUser: (userId, data) =>
    fetch(`${BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(handleResponse)
};