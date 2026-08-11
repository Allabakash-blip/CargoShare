from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies.auth import get_current_user

from app.models.chat_presence import ChatPresence
from app.models.user import User


router = APIRouter(
    prefix="/chat/presence",
    tags=["Chat Presence"]
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# UPDATE CURRENT USER PRESENCE
# ============================================================

@router.post("/status")
def update_presence(
    is_online: bool,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]

    # --------------------------------------------------------
    # Check whether presence record already exists
    # --------------------------------------------------------

    presence = (
        db.query(ChatPresence)
        .filter(
            ChatPresence.user_id == user_id
        )
        .first()
    )

    # --------------------------------------------------------
    # Create presence record if it doesn't exist
    # --------------------------------------------------------

    if not presence:

        presence = ChatPresence(
            user_id=user_id,
            is_online=is_online
        )

        if not is_online:
            presence.last_seen = datetime.utcnow()

        db.add(presence)

    else:

        presence.is_online = is_online

        if not is_online:
            presence.last_seen = datetime.utcnow()

        presence.updated_at = datetime.utcnow()

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    db.commit()
    db.refresh(presence)

    return {
        "success": True,
        "user_id": user_id,
        "is_online": presence.is_online,
        "last_seen": presence.last_seen
    }


# ============================================================
# GET USER PRESENCE
# ============================================================

@router.get("/{user_id}")
def get_user_presence(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):

    # --------------------------------------------------------
    # Check user exists
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.user_id == user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Find presence
    # --------------------------------------------------------

    presence = (
        db.query(ChatPresence)
        .filter(
            ChatPresence.user_id == user_id
        )
        .first()
    )

    # --------------------------------------------------------
    # No presence record yet
    # --------------------------------------------------------

    if not presence:

        return {
            "success": True,
            "user_id": user_id,
            "is_online": False,
            "last_seen": None
        }

    # --------------------------------------------------------
    # Return presence
    # --------------------------------------------------------

    return {
        "success": True,
        "user_id": user_id,
        "is_online": presence.is_online,
        "last_seen": presence.last_seen
    }