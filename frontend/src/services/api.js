const BASE_URL = "https://your-backend.onrender.com";

export const api = {

  checkUser: (email) =>
    fetch(`${BASE_URL}/check-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    }).then(res => res.json()),

  login: (email, password) =>
    fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    }).then(res => res.json()),

  register: (data) =>
    fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json()),

  getRecommendations: (userId) =>
    fetch(`${BASE_URL}/recommendations/${userId}`)
      .then(res => res.json()),

  searchPlants: (query) =>
    fetch(`${BASE_URL}/plants/search?q=${query}`)
      .then(res => res.json()),

  getUserPlants: (userId) =>
    fetch(`${BASE_URL}/user-plants/${Number(userId)}`)
      .then(res => res.json()),

  addPlant: (userId, plantId) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        plant_id: plantId
      })
    }).then(res => res.json()),

  // ✅ FIXED
  removePlant: (userId, plantId) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        plant_id: plantId
      })
    }).then(res => res.json()),

  // 👤 Get user profile
  getUser: (userId) =>
    fetch(`${BASE_URL}/user/${userId}`)
      .then(res => res.json()),

  // ✏️ Update user
  updateUser: (userId, data) =>
    fetch(`${BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(res => res.json())
  };