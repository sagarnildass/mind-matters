# backend/app/api/models/model.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from typing import List, Dict

# User model
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class UserModel(BaseModel):
    user_id: int
    username: str
    email: str
    password: str
    first_name: str
    last_name: str
    gender: str
    age: int
    registration_date: Optional[datetime] = None
    last_login: Optional[datetime] = None
    profile_image: Optional[str] = None
    user_metadata: Optional[dict] = None

    class Config:
        orm_mode = True


# Session model
class SessionBase(BaseModel):
    user_id: int

class SessionCreate(SessionBase):
    pass

class SessionModel(SessionBase):
    session_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    session_metadata: Optional[dict] = None

    class Config:
        orm_mode = True

# ChatLog model
class ChatLogBase(BaseModel):
    session_id: int
    direction: str
    content: str

class ChatLogCreate(ChatLogBase):
    pass

class ChatLogModel(ChatLogBase):
    log_id: int
    timestamp: Optional[datetime] = None
    sentiment: Optional[List[Dict[str, float]]] = None
    topic: Optional[Dict] = None
    is_suicidal: Optional[str] = None

    class Config:
        orm_mode = True

# AIInteraction model
class AIInteractionBase(BaseModel):
    log_id: int
    model_used: str

class AIInteractionCreate(AIInteractionBase):
    pass

class AIInteractionModel(AIInteractionBase):
    interaction_id: int
    prediction: Optional[str] = None
    response_time: Optional[str] = None  # Represented as a string in the format "HH:MM:SS"
    confidence_score: Optional[float] = None

    class Config:
        orm_mode = True

# Feedback model
class FeedbackBase(BaseModel):
    user_id: int
    session_id: int
    content: str
    rating: int

class FeedbackCreate(FeedbackBase):
    pass

class FeedbackModel(FeedbackBase):
    feedback_id: int
    timestamp: Optional[datetime] = None

    class Config:
        orm_mode = True

# EmergencyContact model
class EmergencyContactBase(BaseModel):
    user_id: int
    name: str
    phone_number: str
    email: Optional[str] = None
    relation: Optional[str] = None

class EmergencyContactCreate(EmergencyContactBase):
    pass

class EmergencyContactModel(EmergencyContactBase):
    contact_id: int

    class Config:
        orm_mode = True

# WebSocketSession model
class WebSocketSessionBase(BaseModel):
    user_id: int

class WebSocketSessionCreate(WebSocketSessionBase):
    pass

class WebSocketSessionModel(WebSocketSessionBase):
    ws_session_id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

    class Config:
        orm_mode = True


# ContentMetadata model
class ContentMetadataBase(BaseModel):
    title: str
    description: str
    link: str
    content_type: str

class ContentMetadataCreate(ContentMetadataBase):
    pass

class ContentMetadataModel(ContentMetadataBase):
    id: int

    class Config:
        orm_mode = True

# v_avg_sentiment_scores model
class AvgSentimentScoresModel(BaseModel):
    user_id: int
    session_id: int
    log_id: int
    sentiment_label: str
    sentiment_score: float
    timestamp: datetime

# v_dominant_sentiment model
class DominantSentimentModel(BaseModel):
    user_id: int
    session_id: int
    log_id: int
    sentiment_label: str
    max_score: float

# v_avg_ai_response_time model
class AvgAIResponseTimeModel(BaseModel):
    avg_response_time: float
    model_used: str
    

# v_avg_confidence_score model
class AvgConfidenceScoreModel(BaseModel):
    model_used: str
    avg_confidence: float

# v_daily_mental_health model
class DailyMentalHealthModel(BaseModel):
    interaction_date: date
    user_id: int
    session_id: int
    dominant_sentiment: str
    total_interactions: int
    avg_confidence: Optional[float]
    avg_response_time: Optional[float]

# v_recent_chat_summary model
class RecentChatSummaryModel(BaseModel):
    user_id: int
    session_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    content: str
    sentiment: Optional[List] = None

# v_feedback_reminder model
class FeedbackReminderModel(BaseModel):
    user_id: int
    session_id: int
    feedback_content: Optional[str]

# v_user_activity_summary_7d model
class UserActivitySummary7DModel(BaseModel):
    user_id: int
    total_sessions: int
    total_chat_logs: int
    total_ai_interactions: int

# v_user_profile model
class UserProfileModel(BaseModel):
    user_id: int
    username: str
    email: str
    first_name: str
    last_name: str
    gender: str
    age: int
    profile_image: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_relation: Optional[str]
    emergency_contact_phone: Optional[str]
    emergency_contact_email: Optional[str]

# v_recommended_articles model
class RecommendedArticlesModel(BaseModel):
    title: str
    description: str
    link: str
    content_type: str

class MotivationalQuoteModel(BaseModel):
    quote_id: int
    quote: str
    author: str
    category: Optional[str] = None
    date_added: Optional[datetime] = None

    class Config:
        orm_mode = True