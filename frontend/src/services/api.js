// 🔥 IMPORTANT: Replace with your REAL Render backend URL
const BASE_URL = "http://localhost:10000";

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
    const id = userId || 1;
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

  // ➕ Add Plant (✅ FIXED FORMAT)
  addPlant: (userId, plantId) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        plant_id: Number(plantId)
      })
    }).then(handleResponse),

  // ➖ Remove Plant (✅ FIXED FORMAT)
  removePlant: (data) =>
    fetch(`${BASE_URL}/user-plants`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(data.user_id),
        plant_id: Number(data.plant_id)
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
    }).then(handleResponse),

  // =========================
  // 🌿 COMMUNITY FEATURE
  // =========================

  // 📥 Get all posts
  getPosts: () =>
    fetch(`${BASE_URL}/posts`)
      .then(handleResponse),

  // 📝 Create post
  createPost: (userId, content) =>
    fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(userId),
        content
      })
    }).then(handleResponse),

  likePost: (postId) =>
    fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: "POST"
    }).then(handleResponse),

  // 💬 Reply to post
  replyPost: (data) =>
    fetch(`${BASE_URL}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: Number(data.user_id),
        post_id: Number(data.post_id),
        content: data.content
      })
    }).then(handleResponse),



};