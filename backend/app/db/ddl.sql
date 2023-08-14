CREATE TABLE t_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Male', 'Female')),
    age INTEGER NOT NULL CHECK (age >= 0 AND age <= 150),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    profile_image TEXT,
    user_metadata JSONB
);

-- Sessions Table
CREATE TABLE t_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_users(user_id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    session_metadata JSONB
);

-- ChatLogs Table
CREATE TABLE t_chatlogs (
    log_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES t_sessions(session_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    direction VARCHAR(50) CHECK (direction IN ('user', 'ai')),
    content TEXT,
    sentiment VARCHAR(5000),
    topic VARCHAR(255),
    is_suicidal VARCHAR(50)
);

-- AIInteractions Table
CREATE TABLE t_aiinteractions (
    interaction_id SERIAL PRIMARY KEY,
    log_id INTEGER REFERENCES t_chatlogs(log_id),
    model_used VARCHAR(255),
	prediction VARCHAR(255),
    response_time FLOAT,
    confidence_score FLOAT
);

-- Feedback Table
CREATE TABLE t_feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_users(user_id),
    session_id INTEGER REFERENCES t_sessions(session_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5)
);

-- EmergencyContacts Table
CREATE TABLE t_emergencycontacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_users(user_id),
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(255),
    phone_number VARCHAR(50),
    email VARCHAR(255)
);

-- WebsocketSessions Table
CREATE TABLE t_websocketsessions (
    ws_session_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES t_users(user_id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP
);

-- Indices for common queries
CREATE INDEX idx_user_email ON t_users(email);
CREATE INDEX idx_sessions_userid ON t_sessions(user_id);
CREATE INDEX idx_chatlogs_sessionid ON t_chatlogs(session_id);

DROP TABLE t_aiinteractions;
DROP TABLE t_feedback;
DROP TABLE t_emergencycontacts;
DROP TABLE t_websocketsessions;
DROP TABLE t_chatlogs;
DROP TABLE t_sessions;
DROP TABLE t_users;



select * from t_users;
select * from t_sessions;
select * from t_chatlogs;
select * from t_aiinteractions;
select * from t_websocketsessions;