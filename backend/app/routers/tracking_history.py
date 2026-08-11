from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.tracking_history import TrackingHistory
from app.models.booking import Booking
from app.schemas.tracking_history import (
    TrackingHistoryCreate,
    TrackingHistoryResponse,
)
print("Loading tracking_history router...")
router = APIRouter(
    prefix="/tracking-history",
    tags=["Tracking History"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TrackingHistoryResponse)
def add_tracking_history(
    history: TrackingHistoryCreate,
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(
        Booking.booking_id == history.booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    new_history = TrackingHistory(
        booking_id=history.booking_id,
        location=history.location,
        status=history.status
    )

    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return new_history


@router.get("/{booking_id}", response_model=list[TrackingHistoryResponse])
def get_tracking_history(
    booking_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(TrackingHistory)
        .filter(TrackingHistory.booking_id == booking_id)
        .order_by(TrackingHistory.updated_at.asc())
        .all()
    )