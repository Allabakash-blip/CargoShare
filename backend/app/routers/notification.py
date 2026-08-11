from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
)
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# Create Notification
# -----------------------------
@router.post("/", response_model=NotificationResponse)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.user_id == notification.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User Not Found"
        )

    new_notification = Notification(
        user_id=notification.user_id,
        message=notification.message,
        status="Unread"
    )

    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    return new_notification


# -----------------------------
# Logged-in User Notifications
# -----------------------------
@router.get("/", response_model=list[NotificationResponse])
def get_my_notifications(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user["user_id"])
        .order_by(Notification.created_at.desc())
        .all()
    )

# -----------------------------
# Recent Notifications
# -----------------------------
@router.get("/recent", response_model=list[NotificationResponse])
def get_recent_notifications(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(Notification)
        .filter(Notification.user_id == current_user["user_id"])
        .order_by(Notification.created_at.desc())
        .limit(5)
        .all()
    )


# -----------------------------
# Unread Count
# -----------------------------
@router.get("/count")
def unread_count(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    count = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user["user_id"],
            Notification.status == "Unread"
        )
        .count()
    )

    return {"count": count}


# -----------------------------
# Mark One Notification Read
# -----------------------------
@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.notification_id == notification_id,
            Notification.user_id == current_user["user_id"]
        )
        .first()
    )

    if not notification:
        raise HTTPException(
            status_code=404,
            detail="Notification Not Found"
        )

    notification.status = "Read"

    db.commit()

    return {
        "message": "Notification marked as read."
    }


# -----------------------------
# Mark All Notifications Read
# -----------------------------
@router.put("/read-all")
def mark_all_read(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notifications = (
        db.query(Notification)
        .filter(
            Notification.user_id == current_user["user_id"],
            Notification.status == "Unread"
        )
        .all()
    )

    for notification in notifications:
        notification.status = "Read"

    db.commit()

    return {
        "message": "All notifications marked as read."
    }