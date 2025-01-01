from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.models import Session, AIInteraction, ChatLog, Feedback
from app.core.database import get_db
from app.core.authentication import get_current_user

router = APIRouter()

@router.delete("/delete_session/{session_id}/", status_code=204)
def delete_session(session_id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        # Fetch the session to ensure it exists and belongs to the current user
        session = db.query(Session).filter(Session.session_id == session_id, Session.user_id == user.user_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or doesn't belong to the user.")

        # 1. Delete AI interactions linked to chatlogs of the session
        db.query(AIInteraction).filter(AIInteraction.log_id.in_(
            db.query(ChatLog.log_id).filter(ChatLog.session_id == session_id)
        )).delete(synchronize_session=False)

        # 2. Delete chat logs linked to the session
        db.query(ChatLog).filter(ChatLog.session_id == session_id).delete(synchronize_session=False)

        # 3. Delete feedback linked to the session
        db.query(Feedback).filter(Feedback.session_id == session_id).delete(synchronize_session=False)

        # 4. Delete the session
        db.delete(session)
        db.commit()

        return None  # Return 204 No Content status
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal Server Error")