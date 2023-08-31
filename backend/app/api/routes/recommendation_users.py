from fastapi import APIRouter, Depends, HTTPException
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.authentication import get_current_user
from app.core.models import User, ChatLog, AIInteraction, AvgSentimentScores

router = APIRouter()

# Step 1: Feature Engineering
def extract_features(user_id, db: Session):
    user = db.query(User).filter(User.user_id == user_id).first()
    avg_sentiments = db.query(AvgSentimentScores).filter(AvgSentimentScores.user_id == user_id).all()

    # Extract demographic features
    age = user.age
    gender = 1 if user.gender == 'Male' else 0  # Male: 1, Female: 0
    print('age', age)
    print('gender', gender)
    # Extract features from chat history
    avg_sentiment = np.mean([s.avg_sentiment_score for s in avg_sentiments]) if avg_sentiments else 0
    #print(avg_sentiment)
    # Add more features like topic, suicidal_rate, etc.

    feature_vector = [age, gender, avg_sentiment]  # Extend this list based on your features
    print('feature_vector', feature_vector)
    return np.array(feature_vector).reshape(1, -1)

# Step 2: User Profiling
def create_user_profiles(user_ids, db: Session):
    user_profiles = {}
    for user_id in user_ids:
        user_profiles[user_id] = extract_features(user_id, db)

    # Step 2.1: Normalize features
    all_features = np.vstack([features for features in user_profiles.values()])
    scaler = MinMaxScaler()
    all_features_scaled = scaler.fit_transform(all_features)

    # Update user profiles with normalized features
    for i, user_id in enumerate(user_ids):
        user_profiles[user_id] = all_features_scaled[i].reshape(1, -1)

    return user_profiles

# Step 3: Model Building
def find_similar_users(user_id, user_profiles):
    similarities = {}
    target_profile = user_profiles[user_id]

    for id_, profile in user_profiles.items():
        if id_ != user_id:
            sim = cosine_similarity(target_profile, profile)
            similarities[id_] = sim[0][0]

    # Sort by similarity score
    sorted_similar_users = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
    return sorted_similar_users

def get_all_user_ids(db: Session):
    user_ids = db.query(User.user_id).all()
    return [u[0] for u in user_ids]


@router.get("/similar_users/{user_id}")
def get_similar_users(user=Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all user IDs, including the current user
    user_ids = get_all_user_ids(db)
    #print(user_ids)

    # Create user profiles
    user_profiles = create_user_profiles(user_ids, db)
    print(user_profiles)
    
    # Find similar users to the given user
    similar_users = find_similar_users(user.user_id, user_profiles)

    if similar_users:
        return {"similar_users": similar_users}
    else:
        raise HTTPException(status_code=404, detail="No similar users found")
