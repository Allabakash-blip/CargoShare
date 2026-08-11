from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database import get_db

from app.dependencies.auth import admin_only

from app.models.activity_log import ActivityLog

from app.schemas.activity_log import ActivityLogResponse


router = APIRouter(
    prefix="/activity-logs",
    tags=["Activity Logs"],
)


@router.get(
    "/",
    response_model=list[ActivityLogResponse],
)
def get_activity_logs(
    db: Session = Depends(get_db),
    current_user=Depends(admin_only),
):

    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .all()
    )

    return logs

# -----------------------------
# Recent Activity Logs
# -----------------------------
@router.get(
    "/recent",
    response_model=list[ActivityLogResponse],
)
def get_recent_activity_logs(
    db: Session = Depends(get_db),
    current_user=Depends(admin_only),
):
    logs = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(5)
        .all()
    )

    return logs