from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.dependencies.auth import admin_only
from app.utils.email import send_approval_email
router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)
from app.services.email_service import send_approval_email
from app.schemas.user import UserResponse

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.put("/approve/{user_id}")
async def approve_user(
    user_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    user = db.query(User).filter(
        User.user_id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.status = "Approved"

    db.commit()
    db.refresh(user)

    background_tasks.add_task(
    send_approval_email,
    user.email,
)

    return {
        "message": "User Approved Successfully"
    }
@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    return db.query(User).order_by(User.user_id.desc()).all()