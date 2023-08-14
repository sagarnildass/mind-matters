from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Float, Text, CheckConstraint
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

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
    sentiment = Column(String(50))
    topic = Column(String(255))
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
