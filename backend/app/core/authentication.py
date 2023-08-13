# backend/app/core/authentication.py

from sqlalchemy.orm import Session
from fastapi import HTTPException, Security, Depends
from fastapi.security import OAuth2PasswordBearer
from jwt import decode, PyJWTError
from app.api.utils.user_utils import get_user
from app.core.database import get_db
from app.core.config import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_user(username, db)
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")