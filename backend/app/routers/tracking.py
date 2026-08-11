from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.tracking import Tracking
from app.schemas.tracking import (
    TrackingCreate,
    TrackingUpdate,
    TrackingResponse
)
from app.models.booking import Booking
from app.models.notification import Notification

router = APIRouter(
    prefix="/tracking",
    tags=["Tracking"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=TrackingResponse)
def create_tracking(
    tracking: TrackingCreate,
    db: Session = Depends(get_db)
):
    new_tracking = Tracking(
        booking_id=tracking.booking_id,
        current_location=tracking.current_location,
        shipment_status=tracking.shipment_status
    )

    db.add(new_tracking)
    db.commit()
    db.refresh(new_tracking)

    return new_tracking


@router.get("/", response_model=list[TrackingResponse])
def get_all_tracking(db: Session = Depends(get_db)):
    return db.query(Tracking).all()

# --------------------------------------------------
# Get Tracking History by Booking
# --------------------------------------------------
@router.get("/booking/{booking_id}", response_model=list[TrackingResponse])
def get_tracking_by_booking(
    booking_id: int,
    db: Session = Depends(get_db)
):
    tracking = db.query(Tracking).filter(
        Tracking.booking_id == booking_id
    ).order_by(Tracking.tracking_id.asc()).all()

    if not tracking:
        raise HTTPException(
            status_code=404,
            detail="No tracking records found for this booking."
        )

    return tracking


@router.get("/{tracking_id}", response_model=TrackingResponse)
def get_tracking_by_id(
    tracking_id: int,
    db: Session = Depends(get_db)
):
    tracking = db.query(Tracking).filter(
        Tracking.tracking_id == tracking_id
    ).first()

    if not tracking:
        raise HTTPException(
            status_code=404,
            detail="Tracking record not found"
        )

    return tracking


@router.put("/{tracking_id}", response_model=TrackingResponse)
def update_tracking(
    tracking_id: int,
    tracking: TrackingUpdate,
    db: Session = Depends(get_db)
):
    db_tracking = db.query(Tracking).filter(
        Tracking.tracking_id == tracking_id
    ).first()

    if not db_tracking:
        raise HTTPException(
            status_code=404,
            detail="Tracking record not found"
        )

    # Update tracking details
    db_tracking.current_location = tracking.current_location
    db_tracking.shipment_status = tracking.shipment_status

    # Find the related booking
    booking = db.query(Booking).filter(
        Booking.booking_id == db_tracking.booking_id
    ).first()

    if booking:

        # Keep booking status in sync
        if tracking.shipment_status == "In Transit":
            booking.status = "In Transit"

            db.add(
                Notification(
                    user_id=booking.trader_id,
                    message=f"Your Booking #{booking.booking_id} is now In Transit.",
                    status="Unread"
                )
            )

        elif tracking.shipment_status == "Completed":
            booking.status = "Completed"

            db.add(
                Notification(
                    user_id=booking.trader_id,
                    message=f"Your Booking #{booking.booking_id} has been delivered successfully.",
                    status="Unread"
                )
            )

    db.commit()
    db.refresh(db_tracking)

    return db_tracking


@router.delete("/{tracking_id}")
def delete_tracking(
    tracking_id: int,
    db: Session = Depends(get_db)
):
    tracking = db.query(Tracking).filter(
        Tracking.tracking_id == tracking_id
    ).first()

    if not tracking:
        raise HTTPException(
            status_code=404,
            detail="Tracking record not found"
        )

    db.delete(tracking)
    db.commit()

    return {
        "message": "Tracking deleted successfully"
    }