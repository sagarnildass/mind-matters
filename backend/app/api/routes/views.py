from fastapi import APIRouter, Depends, HTTPException
from fastapi.exceptions import ResponseValidationError

from sqlalchemy.orm import Session
from sqlalchemy.sql.expression import func

from typing import List
from app.core.database import get_db
from app.core.authentication import get_current_user
from app.api.models.model import (AvgSentimentScoresModel, DominantSentimentModel, 
                                  AvgAIResponseTimeModel, AvgConfidenceScoreModel, 
                                  DailyMentalHealthModel, RecentChatSummaryModel, 
                                  FeedbackReminderModel, UserActivitySummary7DModel, 
                                  UserProfileModel, RecommendedArticlesModel, MotivationalQuoteModel)
from app.core.models import (AvgSentimentScores, DominantSentiment, AvgAIResponseTime, 
                             AvgConfidenceScore, DailyMentalHealth, RecentChatSummary, 
                             FeedbackReminder, UserActivitySummary7D, UserProfile, 
                             RecommendedArticles, MotivationalQuote)

router = APIRouter()


@router.get("/avg_sentiment_scores/", response_model=List[AvgSentimentScoresModel])
def get_avg_sentiment_scores(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        results = db.query(AvgSentimentScores).filter(AvgSentimentScores.user_id == user.user_id).all()
        return [AvgSentimentScoresModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/dominant_sentiment/", response_model=List[DominantSentimentModel])
def get_dominant_sentiment(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        results = db.query(DominantSentiment).filter(DominantSentiment.user_id == user.user_id).all()
        return [DominantSentimentModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/avg_ai_response_time/", response_model=List[AvgAIResponseTimeModel])
def get_avg_ai_response_time(db: Session = Depends(get_db)):
    try:
        results = db.query(AvgAIResponseTime).all()
        return [AvgAIResponseTimeModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/avg_confidence_score/", response_model=List[AvgConfidenceScoreModel])
def get_avg_confidence_score(db: Session = Depends(get_db)):
    try:
        results = db.query(AvgConfidenceScore).all()
        return [AvgConfidenceScoreModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/daily_mental_health/", response_model=List[DailyMentalHealthModel])
def get_daily_mental_health(user=Depends(get_current_user), db: Session = Depends(get_db)):
        try:
            results = db.query(DailyMentalHealth).filter(DailyMentalHealth.user_id == user.user_id).all()
            return [DailyMentalHealthModel(**result.__dict__) for result in results]
        except ResponseValidationError as e:
            raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/recent_chat_summary/", response_model=List[RecentChatSummaryModel])
def get_recent_chat_summary(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        results = db.query(RecentChatSummary).filter(RecentChatSummary.user_id == user.user_id).all()
        return [RecentChatSummaryModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/feedback_reminder/", response_model=List[FeedbackReminderModel])
def get_feedback_reminder(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        results = db.query(FeedbackReminder).filter(FeedbackReminder.user_id == user.user_id).all()
        return [FeedbackReminderModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/user_activity_summary_7d/", response_model=UserActivitySummary7DModel)
def get_user_activity_7d(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        results = db.query(UserActivitySummary7D).filter(UserActivitySummary7D.user_id == user.user_id).all()[0]
        return UserActivitySummary7DModel(**results.__dict__)
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/user_profile/", response_model=UserProfileModel)
def get_user_profile(user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        result = db.query(UserProfile).filter(UserProfile.user_id == user.user_id).first()
        return UserProfileModel(**result.__dict__)
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/recommended_articles/", response_model=List[RecommendedArticlesModel])
def get_recommended_articles(db: Session = Depends(get_db)):
    try:
        results = db.query(RecommendedArticles).all()
        return [RecommendedArticlesModel(**result.__dict__) for result in results]
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))

@router.get("/random_quote/", response_model=MotivationalQuoteModel)
def get_random_quote(db: Session = Depends(get_db)):
    try:
        result = db.query(MotivationalQuote).order_by(func.random()).first()
        if not result:
            raise HTTPException(status_code=404, detail="No quotes available.")
        return MotivationalQuoteModel(**result.__dict__)
    except ResponseValidationError as e:
        raise HTTPException(status_code=400, detail=str(e.errors()))