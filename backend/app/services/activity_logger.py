from sqlalchemy.orm import Session

from app.models.activity_log import ActivityLog


def log_activity(
    db: Session,
    user_email: str,
    user_role: str,
    action: str,
):
    log = ActivityLog(
        user_email=user_email,
        user_role=user_role,
        action=action,
    )

    db.add(log)
    db.commit()