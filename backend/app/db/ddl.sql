select * from t_users;
select * from t_sessions;
select * from t_chatlogs;
select * from t_aiinteractions;
select * from t_websocketsessions;
select * from t_content_metadata;
SELECT * FROM v_avg_sentiment_scores;
SELECT * FROM v_dominant_sentiment;
SELECT * FROM v_avg_ai_response_time;
SELECT * FROM v_avg_confidence_score;
SELECT * FROM v_daily_mental_health;
SELECT * FROM v_recent_chat_summary;
SELECT * FROM v_feedback_reminder;
SELECT * FROM v_user_activity_summary_7d;
SELECT * FROM v_user_profile;
SELECT * FROM v_recommended_articles;

-----------------------

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
    sentiment JSONB,
    topic JSONB,
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

CREATE TABLE t_motivational_quotes (
    quote_id SERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    category TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster querying by category
CREATE INDEX idx_quotes_category ON t_motivational_quotes(category);
-- Indices for common queries
CREATE INDEX idx_user_email ON t_users(email);
CREATE INDEX idx_sessions_userid ON t_sessions(user_id);
CREATE INDEX idx_chatlogs_sessionid ON t_chatlogs(session_id);

-----------------------

CREATE VIEW v_avg_sentiment_scores AS
SELECT
    s.user_id,
    c.session_id,
    c.log_id,
    (jsonb_array_elements(c.sentiment::jsonb) -> 'label')::text AS sentiment_label,
    CAST((jsonb_array_elements(c.sentiment::jsonb) -> 'score')::text AS FLOAT) AS sentiment_score,
    c.timestamp
FROM
    t_chatlogs c
JOIN 
    t_sessions s ON c.session_id = s.session_id
WHERE c.direction = 'user' AND c.content != 'Chat Initiated';


	
CREATE VIEW v_dominant_sentiment AS
SELECT
    vs.user_id,
	vs.session_id,
    vs.log_id,
    vs.sentiment_label,
    vs.sentiment_score AS max_score
FROM
    v_avg_sentiment_scores vs
JOIN (
    SELECT
	    user_id,
		session_id,
        log_id,
        MAX(sentiment_score) AS max_sentiment_score
    FROM
        v_avg_sentiment_scores
    GROUP BY
        user_id, session_id, log_id
) subq ON vs.user_id = subq.user_id AND vs.log_id = subq.log_id AND vs.session_id = subq.session_id AND vs.sentiment_score = subq.max_sentiment_score;

	
CREATE VIEW v_avg_ai_response_time AS
SELECT
    model_used,
    AVG(response_time) AS avg_response_time
FROM
    t_aiinteractions
GROUP BY
    model_used;
	
CREATE VIEW v_avg_confidence_score AS
SELECT
    model_used,
    AVG(confidence_score) AS avg_confidence
FROM
    t_aiinteractions
WHERE
    confidence_score IS NOT NULL
GROUP BY
    model_used;
	
CREATE VIEW v_daily_mental_health AS
SELECT
    DATE(vs.timestamp) AS interaction_date,
	vs.user_id,
    vs.session_id,
    ds.sentiment_label AS dominant_sentiment,
    COUNT(vs.log_id) AS total_interactions,
    AVG(ai.confidence_score) AS avg_confidence,
    AVG(ai.response_time) AS avg_response_time
FROM
    v_avg_sentiment_scores vs
JOIN
    v_dominant_sentiment ds ON vs.log_id = ds.log_id
LEFT JOIN
    t_aiinteractions ai ON vs.log_id = ai.log_id
GROUP BY
    DATE(vs.timestamp),
	vs.user_id,
    vs.session_id,
    ds.sentiment_label;
	
CREATE VIEW v_recent_chat_summary AS
SELECT
    t_sessions.user_id,
    t_sessions.session_id,
    t_sessions.start_time,
    t_sessions.end_time,
    t_chatlogs.content,
    t_chatlogs.sentiment
FROM
    t_sessions
JOIN t_chatlogs ON t_sessions.session_id = t_chatlogs.session_id
WHERE
    t_sessions.start_time = (SELECT MAX(start_time) FROM t_sessions WHERE user_id = t_sessions.user_id);
	
CREATE VIEW v_feedback_reminder AS
SELECT
    t_sessions.user_id,
    t_sessions.session_id,
    t_feedback.content AS feedback_content
FROM
    t_sessions
LEFT JOIN t_feedback ON t_sessions.session_id = t_feedback.session_id
WHERE
    t_sessions.start_time = (SELECT MAX(start_time) FROM t_sessions WHERE user_id = t_sessions.user_id);
	
CREATE VIEW v_user_activity_summary_7d AS
SELECT
    user_id,
    COUNT(DISTINCT t_sessions.session_id) AS total_sessions,
    COUNT(DISTINCT t_chatlogs.log_id) AS total_chat_logs,
    COUNT(DISTINCT interaction_id) AS total_ai_interactions
FROM
    t_sessions
JOIN t_chatlogs ON t_sessions.session_id = t_chatlogs.session_id
JOIN t_aiinteractions ON t_chatlogs.log_id = t_aiinteractions.log_id
WHERE
    t_sessions.start_time BETWEEN NOW() - INTERVAL '7 days' AND NOW()
GROUP BY
    user_id;
	
CREATE VIEW v_user_profile AS
SELECT
    t_users.user_id,
    t_users.username,
    t_users.email,
    t_users.first_name,
    t_users.last_name,
    t_users.gender,
    t_users.age,
    t_users.profile_image,
    t_emergencycontacts.name AS emergency_contact_name,
    t_emergencycontacts.relation AS emergency_contact_relation,
    t_emergencycontacts.phone_number AS emergency_contact_phone,
    t_emergencycontacts.email AS emergency_contact_email
FROM
    t_users
LEFT JOIN t_emergencycontacts ON t_users.user_id = t_emergencycontacts.user_id;

CREATE VIEW v_recommended_articles AS
SELECT
    title,
    description,
    link,
    content_type
FROM
    t_content_metadata
ORDER BY
    RANDOM()
LIMIT 5;



-----------------

DROP VIEW IF EXISTS v_daily_mental_health;
DROP VIEW IF EXISTS v_dominant_sentiment;
DROP VIEW IF EXISTS v_avg_sentiment_scores;
DROP VIEW IF EXISTS v_avg_ai_response_time;
DROP VIEW IF EXISTS v_avg_confidence_score;
DROP VIEW IF EXISTS v_recent_chat_summary;
DROP VIEW IF EXISTS v_feedback_reminder;
DROP VIEW IF EXISTS v_user_activity_summary_7d;
DROP VIEW IF EXISTS v_user_profile;
DROP VIEW IF EXISTS v_recommended_articles;
DROP TABLE t_aiinteractions;
DROP TABLE t_feedback;
DROP TABLE t_emergencycontacts;
DROP TABLE t_websocketsessions;
DROP TABLE t_chatlogs;
DROP TABLE t_sessions;
DROP TABLE t_users;
