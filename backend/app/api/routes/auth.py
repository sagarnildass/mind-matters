# backend/app/api/routes/auth.py

from typing import Annotated, Optional
import logging
import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Header, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jwt
from sqlalchemy.orm import Session
from pytz import timezone
from app.core.database import get_db
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.api.models.model import UserModel
from app.core.authentication import get_current_user
from app.api.utils.user_utils import get_user
from app.services.user import create_user
from app.core.models import User

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Configure log format
log_format = {
    "timestamp": "%(asctime)s",
    "level": "%(levelname)s",
    "message": "%(message)s",
    "module": "%(module)s",
    "function": "%(funcName)s",
    "line_number": "%(lineno)d",
    "logger_name": "%(name)s",
}

formatter = logging.Formatter(json.dumps(log_format))

# Create a handler and set the formatter
handler = logging.StreamHandler()
handler.setFormatter(formatter)

# Add the handler to the logger
logger.addHandler(handler)



router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(db, username: str, password: str):
    user = get_user(username, db)
    #print(user.username)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def update_last_login(user_id: int, db: Session = Depends(get_db)):
    ist = timezone('Asia/Kolkata')
    current_time = datetime.now(ist)

    # Query for the user and update the last_login field
    db_user = db.query(User).filter(User.user_id == user_id).first()
    if db_user:
        db_user.last_login = current_time
        db.commit()


@router.post("/login", tags=["Authentication"], response_model=dict)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    remember_me: Optional[bool] = Form(False)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Set the token expiration time based on the "Remember me" checkbox
    if remember_me:
        access_token_expires = timedelta(days=30)  # Set a longer expiration time
    else:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    update_last_login(user.user_id, db)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", tags=["Authentication"])
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.post("/register", tags=["Authentication"], response_model=UserModel)
def register_user(user: UserModel, db=Depends(get_db)):
    logger.info("Registering user")
    # logger.info(user.username, user.email, user.password)
    existing_user = get_user(user.username, db)
    print(existing_user)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    created_user = create_user(user, db)
    # print(created_user)

    # Convert the created_user object to a dictionary before returning
    created_user_dict = created_user.__dict__
    created_user_dict.pop("_sa_instance_state", None)
    print(created_user_dict)
    return created_user_dict