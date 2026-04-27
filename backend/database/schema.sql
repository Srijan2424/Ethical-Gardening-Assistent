-- defines all tables and their relationships 
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    city TEXT,
    watering_time TEXT,
    care_level TEXT
);

DROP TABLE IF EXISTS plants;

CREATE TABLE plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    description TEXT,
    image TEXT,
    ideal_temp_min REAL,
    ideal_temp_max REAL,
    ideal_humidity_min REAL,
    ideal_humidity_max REAL,
    care_level TEXT
);

DROP TABLE IF EXISTS user_plants;

CREATE TABLE user_plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    plant_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(plant_id) REFERENCES plants(id)
);

CREATE TABLE IF NOT EXISTS plant_requirements (
    plant_id INTEGER,
    water_frequency TEXT,
    sunlight TEXT,
    soil_type TEXT
);

CREATE TABLE IF NOT EXISTS pests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    solution TEXT
);

CREATE TABLE IF NOT EXISTS plant_pests (
    plant_id INTEGER,
    pest_id INTEGER
);
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER
);