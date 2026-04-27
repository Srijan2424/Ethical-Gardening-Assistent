# 🌱 GardenMate — Sustainable Gardening Companion

A full-stack intelligent gardening assistant that combines **AI-driven recommendations, weather intelligence, reminders, community interaction, and sustainability tracking** to help users grow plants efficiently and responsibly.

---

# 🚀 Deployment

⚠️ If deployed:
Frontend: https://your-frontend-url.com  
Backend API: https://your-backend-url.com  

⚠️ If not deployed, follow local setup below.

---

# 🛠️ Local Setup

## 1. Clone Repository
git clone <your-repo-url>  
cd ethical_gardening_assistent  

---

## 2. Backend Setup (Python)

Install dependencies:
pip install -r requirements.txt  

Initialize database:
cd backend/database  

IMPORTANT FIX:
mv schems.sql schema.sql  

Create DB:
python init_db.py  

Seed Data:
python seed.py  

Run backend:
cd ../  
python main.py  

Backend runs on:
http://localhost:10000  

---

## 3. Frontend Setup (React)

cd frontend  
npm install  
npm start  

Frontend runs on:
http://localhost:3000  

---

# 🧩 Architecture

GardenMate follows a **Service-Oriented Architecture (SOA)**:

Frontend (React)  
↓  
API Layer  
↓  
Backend Services (5 Subsystems)  
↓  
SQLite Database + JSON  

---

# 🧠 Subsystems Overview

## SS1: User & Profile Management
- Register/Login
- JWT-based authentication
- Profile management
- Preferences (organic mode, water saving)
- Location-based personalization

---

## SS2: Gardening Guide & Recommendations
- Smart plant recommendations
- Soil + weather-based suggestions
- Pest identification system
- Organic & chemical treatments
- Uses plants.json and pests.json

---

## SS3: Weather & Smart Alerts
- Weekly forecast
- Alerts:
  - Heatwave
  - Frost
  - Heavy rain
  - Wind
- Suggests protective actions

---

## SS4: Reminders & Notifications
- Watering reminders
- Snooze / reschedule
- Time window (e.g., 6 AM – 2 PM)
- Task completion tracking

---

## SS5: Community Forum
- Create posts
- Like posts
- Reply to posts
- View feed
- Moderation-ready structure

---

# 🌱 Sustainability Feature (Key Highlight)

## 🌍 Carbon Index System

This is the **core sustainability innovation** of the project.

### How it works:
- Every time a user:
  - Waters a plant
  - Clicks “Done” in reminders  

They earn:
+1 Carbon Credit  

---

### Purpose:
- Encourages consistent plant care  
- Promotes sustainable gardening habits  
- Gamifies environmental contribution  

---

### Dashboard Integration:
- Carbon Index widget shows total credits
- Updates in real-time
- Motivates long-term engagement  

---

### Impact:
Watering plants → improves survival → increases carbon absorption → builds sustainable behavior  

---

# 📊 Features

## Dashboard Widgets
- Weather Forecast  
- Active Reminders  
- Community Feed  
- Recommended Plants  
- Carbon Index  

---

## Gardening
- Add plants to garden  
- Get recommendations  
- Pest awareness  

---

## Community
- Post content  
- Like and reply  
- View others' posts  

---

# 🗂️ Project Structure

ethical_gardening_assistent/  

backend/  
  database/  
    schema.sql  
    seed.py  
    db.py  
    plants.json  
    pests.json  
    garden.db  

  routes/  
  services/  
  main.py  

frontend/  
  src/  
    pages/  
    services/api.js  
    App.jsx  

---

# 🔌 API Endpoints

Auth:
POST /register  
POST /login  

Plants:
GET /plants/search  
GET /recommendations/:userId  
POST /user-plants  
DELETE /user-plants  

Community:
GET /posts  
POST /posts  
POST /posts/:id/like  
POST /reply  

User:
GET /user/:id  
PUT /user/:id  

---

# ⚠️ Important Notes

1. Backend must be running  
If not → frontend shows "Failed to fetch"

2. Database must be initialized  
Otherwise:
- Dashboard crashes  
- No posts load  
- No plants appear  

3. Known safeguards added:
- API error handling  
- Safe rendering for empty data  
- Prevents app crashes  

---

# ⚡ Design Highlights

- Modular subsystem architecture  
- Fault-tolerant frontend  
- Lightweight database (SQLite)  
- Scalable backend design  

---

# 📈 Future Scope

- Push notifications (FCM)  
- AI pest detection (image-based)  
- Real weather API integration  
- Advanced carbon analytics  
- ML-based recommendations  

---

# 🧪 Testing Guide

- Login / Register  
- Add plants → check garden  
- Mark reminders → check carbon increment  
- Post in community → verify feed  

---

# 👨‍💻 Team

Team 59 — Mahindra University  

- Srijan Chopra  
- V. Nikhil Varma  
- Rohit Bharadwaj  
- Susmit Reddy  
- Rishikesh  

---

# 🎯 Final Note

GardenMate is not just a gardening tool — it is a **sustainability-driven behavioral system**.

The Carbon Index transforms:

“watering plants” → into → measurable environmental impact  

This connects:
Technology + Sustainability + User Behavior  

---