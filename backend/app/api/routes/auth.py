# backend/app/api/routes/auth.py

from typing import Annotated, Optional
import logging
import json
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Header, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
import jwt
import boto3
from botocore.exceptions import ClientError
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
    existing_user = get_user(user.username, db)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    created_user = create_user(user, db)

    # Send welcome email
    send_email(user.email, user.first_name)

    # Convert the created_user object to a dictionary before returning
    created_user_dict = created_user.__dict__
    created_user_dict.pop("_sa_instance_state", None)
    return created_user_dict


def send_email(recipient_email, first_name):
    SENDER = "mindmatters@artelus.in"
    RECIPIENT = recipient_email
    AWS_REGION = "ap-south-1" # e.g., "us-west-2"
    SUBJECT = "Welcome to Mind Matters"
    
    # The HTML body of the email
    BODY_TEMPLATE = """
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Mind Matters!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 40px 0;
            }

            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #fff;
                padding: 40px;
                border-radius: 5px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }

            .button {
                display: inline-block;
                padding: 12px 24px;
                margin: 20px 0;
                color: #ffffff;  /* Updated text color to white */
                background-color: #405cf5;
                border: none;
                border-radius: 25px;
                text-align: center;
                text-decoration: none;
                transition: background-color 0.3s ease, transform 0.3s ease;
                box-shadow: 0px 4px 15px rgba(64, 92, 245, 0.2);
            }

            .button:hover {
                background-color: #3044d8;
                transform: translateY(-2px);
                box-shadow: 0px 6px 20px rgba(64, 92, 245, 0.3);
            }

            .button:active {
                transform: translateY(0);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Dear [USERNAME],</h2>
            <p>
                We're genuinely thrilled you've decided to join our community. Mental health is a journey, and every step you take is crucial. Remember, it's okay to seek help, share your feelings, and most importantly, to prioritize your well-being.
            </p>
            <p>
                By being a part of our platform, you've taken a significant step in understanding and enhancing your mental health. Together, we can create a space filled with empathy, understanding, and support.
            </p>
            <a href="https://mindmatters.artelus.in/" class="button" style="color: #ffffff;">Visit App</a>
            <p>
                If you have any questions, concerns, or feedback, please don't hesitate to reach out. We're here for you every step of the way.
            </p>
            <p>
                Stay strong, stay hopeful!
            </p>
            <p>Warm regards,</p>
            <p>Your Mind Matters Team</p>
        </div>
    </body>
    </html>
    """  
    BODY_HTML = BODY_TEMPLATE.replace("[USERNAME]", first_name)
    CHARSET = "UTF-8"

    # Create a new SES client
    client = boto3.client('ses',region_name=AWS_REGION)

    try:
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    RECIPIENT,
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER,
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])