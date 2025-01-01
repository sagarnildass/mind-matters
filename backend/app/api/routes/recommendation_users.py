from fastapi import APIRouter, Depends, HTTPException
from sklearn.preprocessing import MinMaxScaler, RobustScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import euclidean
import numpy as np
from collections import defaultdict
from datetime import datetime, timedelta
import math
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.authentication import get_current_user
from app.core.models import Session as DBSession, User, ChatLog, AIInteraction, AvgSentimentScores

router = APIRouter()

# Step 1: Feature Engineering
def extract_features(user_id, db: Session):
    user = db.query(User).filter(User.user_id == user_id).first()
    avg_sentiments = db.query(AvgSentimentScores).filter(AvgSentimentScores.user_id == user_id).all()

    # Extract demographic features
    age = user.age
    gender = 1 if user.gender == 'Male' else 0  # Male: 1, Female: 0

    # Initialize feature vector with demographic info
    feature_vector = [age, gender]

    # Pre-define possible sentiments
    possible_sentiments = [
        "admiration", "amusement", "anger", "annoyance", "approval", "caring",
        "confusion", "curiosity", "desire", "disappointment", "disapproval", 
        "disgust", "embarrassment", "excitement", "fear", "gratitude", "grief",
        "joy", "love", "nervousness", "optimism", "pride", "realization",
        "relief", "remorse", "sadness", "surprise", "neutral"
    ]

    # Initialize a dictionary to store average scores for each sentiment
    avg_scores = {sentiment: 0 for sentiment in possible_sentiments}

    # Grouping by sentiment labels within a 7-day window
    sentiment_groups = defaultdict(list)
    current_time = datetime.now()
    seven_days_ago = current_time - timedelta(days=7)

    for s in avg_sentiments:
        session = db.query(DBSession).filter(DBSession.session_id == s.session_id).first()
        if session is not None:
            session_time = session.start_time
            # Check if the session is within the last 7 days
            if session_time >= seven_days_ago:
                sentiment_groups[s.sentiment_label].append(s.avg_sentiment_score)

    # Calculate average scores for each sentiment label
    for label, scores in sentiment_groups.items():
        avg_scores[label] = np.mean(scores)

    # Append the average scores to the feature vector in a fixed order
    feature_vector.extend([avg_scores[sentiment] for sentiment in possible_sentiments])

    if not avg_sentiments:
        return None

    return np.array(feature_vector).reshape(1, -1)




# Step 2: User Profiling
def create_user_profiles(user_ids, db: Session, min_sessions=1):
    user_profiles = {}
    for user_id in user_ids:
        features = extract_features(user_id, db)
        if features is not None and np.sum(features) > min_sessions:
            user_profiles[user_id] = features

    if user_profiles:
        all_features = np.vstack([features for features in user_profiles.values()])
        scaler = RobustScaler()
        all_features_scaled = scaler.fit_transform(all_features)

        # Add a small constant to avoid zero vectors
        all_features_scaled += 1e-6

        for i, user_id in enumerate(user_profiles.keys()):
            user_profiles[user_id] = all_features_scaled[i].reshape(1, -1)

        return user_profiles
    else:
        return None
    

# Step 3: Model Building
def find_similar_users(user_id, user_profiles, measure='euclidean'):
    similarities = {}
    target_profile = user_profiles[user_id].reshape(-1)  # Reshape to 1D array
    
    for id_, profile in user_profiles.items():
        profile = profile.reshape(-1)  # Reshape to 1D array
        if id_ != user_id:
            if measure == 'cosine':
                sim = cosine_similarity([target_profile], [profile])  # Keep as 2D array for cosine_similarity
            elif measure == 'euclidean':
                sim = euclidean(target_profile, profile)  # Now both are 1D arrays
                sim = 1 / (1 + sim)  # Convert distance to similarity
            similarities[id_] = sim[0][0] if measure == 'cosine' else sim

    sorted_similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    return sorted_similar_users


def get_all_user_ids(db: Session):
    user_ids = db.query(User.user_id).all()
    return [u[0] for u in user_ids]


@router.get("/similar_users/{user_id}")
def get_similar_users(user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all user IDs, including the current user
    user_ids = get_all_user_ids(db)

    # Create user profiles
    user_profiles = create_user_profiles(user_ids, db)
    
    if user_profiles:
        similar_users = find_similar_users(user.user_id, user_profiles)
        
        # Fetch additional details for similar users
        detailed_similar_users = []
        for user_id, similarity in similar_users:
            user_details = db.query(User).filter(User.user_id == user_id).first()
            if user_details:
                detailed_similar_users.append({
                    "user_id": user_id,
                    "similarity": similarity,
                    "first_name": user_details.first_name,
                    "last_name": user_details.last_name,
                    "gender": user_details.gender,
                    "age": user_details.age,
                    "profile_image": user_details.profile_image
                })
        
        return {"similar_users": detailed_similar_users}
    else:
        raise HTTPException(status_code=404, detail="No similar users found")