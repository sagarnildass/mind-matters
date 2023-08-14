# backend/app/services/user.py

from sqlalchemy.orm import Session
from fastapi import Depends
from passlib.context import CryptContext
from pytz import timezone
from datetime import datetime
from app.core.models import User
from app.api.models.model import UserModel
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(user: UserModel, db: Session = Depends(get_db)):
    ist = timezone('Asia/Kolkata')
    creation_date = datetime.now(ist)
    hashed_password = pwd_context.hash(user.password)
    
    # Create a new User instance with the provided details
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        gender=user.gender,
        age=user.age,
        registration_date=creation_date
    )
    
    # Add the new user to the database session and commit
    db.add(db_user)
    db.commit()
    
    # Refresh the user instance to get any updated fields from the database
    db.refresh(db_user)
    
    # Return the newly created user
    return db_user
