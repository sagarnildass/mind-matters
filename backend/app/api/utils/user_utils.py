# backend/app/api/utils/user_utils.py

from sqlalchemy.orm import Session
from fastapi import Depends
from app.api.models.model import UserModel
from app.core.database import get_db
from app.core.models import User

def get_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if user:
        return UserModel(
            user_id=user.user_id,
            username=user.username,
            email=user.email,
            password=user.password,
            first_name=user.first_name,
            last_name=user.last_name,
            gender=user.gender,
            age=user.age,
            registration_date=user.registration_date,
            last_login=user.last_login,
            profile_image=user.profile_image,
            user_metadata=user.user_metadata,
        )
    return None
