# backend/app/services/chat.py

from sqlalchemy.orm import Session
from app.core.models import Session as DBSession, ChatLog
from datetime import datetime
from app.core.models import WebSocketSession


async def initiate_chat(user_id: int, db: Session, session_id: int = None):
    if session_id:
        # Fetch existing session and associated chat logs
        session = db.query(DBSession).filter(DBSession.session_id == session_id).first()
        ws_session = db.query(WebSocketSession).filter(WebSocketSession.user_id == user_id).first()
        chat_log = db.query(ChatLog).filter(ChatLog.session_id == session_id).order_by(ChatLog.timestamp).all()
    else:
        # Create a new session
        session = DBSession(user_id=user_id)
        print(session.session_id)
        db.add(session)
        db.commit()
        db.refresh(session)

        # Create a new WebSocket session
        ws_session = WebSocketSession(user_id=user_id)
        db.add(ws_session)
        db.commit()
        db.refresh(ws_session)

        # Create the first chat log entry (optional)
        chat_log = ChatLog(session_id=session.session_id, direction="user", content="Chat Initiated")
        db.add(chat_log)
        db.commit()
        db.refresh(chat_log)

    return session, ws_session, chat_log