# app/core/models.py

from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Float, Text, CheckConstraint
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB

Base = declarative_base()

# User model
class User(Base):
    __tablename__ = "t_users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(Text, nullable=False)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    gender = Column(String(50), nullable=False)
    age = Column(Integer, nullable=False)
    registration_date = Column(DateTime(timezone=True), server_default=func.now())
    last_login = Column(DateTime(timezone=True))
    profile_image = Column(Text)
    user_metadata = Column(Text)  # Stored as JSON-formatted string

    sessions = relationship("Session", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="user")
    contacts = relationship("EmergencyContact", back_populates="user")
    ws_sessions = relationship("WebSocketSession", back_populates="user")

# Session model
class Session(Base):
    __tablename__ = "t_sessions"

    session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("t_users.user_id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))
    session_metadata = Column(Text)  # Stored as JSON-formatted string

    user = relationship("User", back_populates="sessions")
    chatlogs = relationship("ChatLog", back_populates="session")

# ChatLog model
class ChatLog(Base):
    __tablename__ = "t_chatlogs"

    log_id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("t_sessions.session_id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    direction = Column(String(50), CheckConstraint("direction IN ('user', 'ai')"))
    content = Column(Text)
    sentiment = Column(JSONB)
    topic = Column(JSONB)
    is_suicidal = Column(String(50))

    session = relationship("Session", back_populates="chatlogs")
    ai_interaction = relationship("AIInteraction", uselist=False, back_populates="chatlog")

# AIInteraction model
class AIInteraction(Base):
    __tablename__ = "t_aiinteractions"

    interaction_id = Column(Integer, primary_key=True, index=True)
    log_id = Column(Integer, ForeignKey("t_chatlogs.log_id"))
    model_used = Column(String(255))
    prediction = Column(String(255))
    response_time = Column(String)  # Represented as a string in the format "HH:MM:SS"
    confidence_score = Column(Float)

    chatlog = relationship("ChatLog", back_populates="ai_interaction")

# Feedback model
class Feedback(Base):
    __tablename__ = "t_feedback"

    feedback_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("t_users.user_id"))
    session_id = Column(Integer, ForeignKey("t_sessions.session_id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    content = Column(Text)
    rating = Column(Integer, CheckConstraint("rating >= 1 AND rating <= 5"))

    user = relationship("User", back_populates="feedbacks")

# EmergencyContact model
class EmergencyContact(Base):
    __tablename__ = "t_emergencycontacts"

    contact_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("t_users.user_id"))
    name = Column(String(255), nullable=False)
    phone_number = Column(String(50))
    email = Column(String(255))
    relation = Column(String(255))

    user = relationship("User", back_populates="contacts")

# WebSocketSession model
class WebSocketSession(Base):
    __tablename__ = "t_websocketsessions"

    ws_session_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("t_users.user_id"))
    start_time = Column(DateTime(timezone=True), server_default=func.now())
    end_time = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="ws_sessions")

class ContentMetadata(Base):
    __tablename__ = "t_content_metadata"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text)
    description = Column(Text)
    link = Column(Text)
    content_type = Column(String(255))

class SentimentScores(Base):
    __tablename__ = "v_sentiment_scores"

    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer, primary_key=True)
    log_id = Column(Integer, primary_key=True)
    sentiment_label = Column(String, primary_key=True)
    sentiment_score = Column(Float)
    timestamp = Column(DateTime(timezone=True), primary_key=True)

# v_avg_sentiment_scores model
class AvgSentimentScores(Base):
    __tablename__ = "v_avg_sentiment_scores"
    
    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer, primary_key=True)
    sentiment_label = Column(String, primary_key=True)
    avg_sentiment_score = Column(Float)

# v_dominant_sentiment model
class DominantSentiment(Base):
    __tablename__ = "v_dominant_sentiment"
    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer, primary_key=True)
    log_id = Column(Integer, primary_key=True)
    sentiment_label = Column(String)
    max_score = Column(Float)

# v_avg_ai_response_time model
class AvgAIResponseTime(Base):
    __tablename__ = "v_avg_ai_response_time"
    model_used = Column(String, primary_key=True)
    avg_response_time = Column(Float)


# v_avg_confidence_score model
class AvgConfidenceScore(Base):
    __tablename__ = "v_avg_confidence_score"
    model_used = Column(String, primary_key=True)
    avg_confidence = Column(Float)

# v_daily_mental_health model
class DailyMentalHealth(Base):
    __tablename__ = "v_daily_mental_health"
    interaction_date = Column(DateTime(timezone=True))
    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer, primary_key=True)
    dominant_sentiment = Column(String, primary_key=True)
    total_interactions = Column(Integer)
    avg_confidence = Column(Float)
    avg_response_time = Column(Float)

# v_recent_chat_summary model
class RecentChatSummary(Base):
    __tablename__ = "v_recent_chat_summary"
    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer, primary_key=True)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    content = Column(Text, primary_key=True)
    sentiment = Column(JSONB)

# v_feedback_reminder model
class FeedbackReminder(Base):
    __tablename__ = "v_feedback_reminder"
    user_id = Column(Integer, primary_key=True)
    session_id = Column(Integer)
    feedback_content = Column(Text)

# v_user_activity_summary_7d model
class UserActivitySummary7D(Base):
    __tablename__ = "v_user_activity_summary_7d"
    user_id = Column(Integer, primary_key=True)
    total_sessions = Column(Integer)
    total_chat_logs = Column(Integer)
    total_ai_interactions = Column(Integer)

# v_user_profile model
class UserProfile(Base):
    __tablename__ = "v_user_profile"
    user_id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    gender = Column(String)
    age = Column(Integer)
    profile_image = Column(Text)
    emergency_contact_name = Column(String)
    emergency_contact_relation = Column(String)
    emergency_contact_phone = Column(String)
    emergency_contact_email = Column(String)

# v_recommended_articles model
class RecommendedArticles(Base):
    __tablename__ = "v_recommended_articles"
    title = Column(Text, primary_key=True)
    description = Column(Text)
    link = Column(Text)
    content_type = Column(String)

class MotivationalQuote(Base):
    __tablename__ = "t_motivational_quotes"

    quote_id = Column(Integer, primary_key=True, index=True)
    quote = Column(Text, nullable=False)
    author = Column(Text, nullable=False)
    category = Column(Text)
    date_added = Column(DateTime(timezone=True), server_default=func.now())

class DailyChallenge(Base):
    __tablename__ = 't_daily_challenges'

    challenge_id = Column(Integer, primary_key=True, index=True)
    challenge_name = Column(Text, nullable=False)
    challenge_description = Column(Text)
    image_url = Column(Text)
    category = Column(String)
    date_added = Column(DateTime)