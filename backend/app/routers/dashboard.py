from fastapi import APIRouter, Depends, Query
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import SessionLocal
from app.models.user import User
from app.models.logistics import Logistics
from app.models.booking import Booking
from app.models.container import Container
from app.models.payment import Payment
from app.schemas.dashboard import DashboardResponse
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=DashboardResponse)
def get_dashboard(
    filter: str = Query("today"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    role = current_user["role"]
    user_id = current_user["user_id"]
    today = datetime.now()

    start_date = None

    if filter == "today":
        start_date = today.replace(
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    elif filter == "7days":
        start_date = today - timedelta(days=7)

    elif filter == "30days":
        start_date = today - timedelta(days=30)

    elif filter == "month":
        start_date = today.replace(
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )

    elif filter == "year":
        start_date = today.replace(
        month=1,
        day=1,
        hour=0,
        minute=0,
        second=0,
        microsecond=0
    )
    # ===========================================
    # ADMIN DASHBOARD
    # ===========================================
    if role == "Admin":

        total_users = db.query(User).count()

        total_logistics = db.query(Logistics).count()

        total_bookings = db.query(Booking).count()

        pending_bookings = db.query(Booking).filter(
            Booking.status == "Pending"
        ).count()

        assigned_bookings = db.query(Booking).filter(
            Booking.status == "Assigned"
        ).count()

        in_transit_bookings = db.query(Booking).filter(
            Booking.status == "In Transit"
        ).count()

        completed_bookings = db.query(Booking).filter(
            Booking.status == "Paid"
        ).count()

        total_containers = db.query(Container).count()

        total_payments = db.query(Payment).count()

        completed_payments = db.query(Payment).filter(
            Payment.payment_status == "Completed"
        ).count()

        total_revenue = db.query(
            func.sum(Payment.amount)
        ).scalar() or 0
        recent_bookings = (
            db.query(Booking)
            .order_by(Booking.booking_id.desc())
            .limit(5)
            .all()
        )

    # ===========================================
    # TRADER DASHBOARD
    # ===========================================
    elif role == "Trader":

        total_users = 0

        total_logistics = 0

        total_bookings = db.query(Booking).filter(
            Booking.trader_id == user_id
        ).count()

        pending_bookings = db.query(Booking).filter(
            Booking.trader_id == user_id,
            Booking.status == "Pending"
        ).count()

        assigned_bookings = db.query(Booking).filter(
            Booking.trader_id == user_id,
            Booking.status == "Assigned"
        ).count()

        in_transit_bookings = db.query(Booking).filter(
            Booking.trader_id == user_id,
            Booking.status == "In Transit"
        ).count()

        completed_bookings = db.query(Booking).filter(
            Booking.trader_id == user_id,
            Booking.status == "Completed"
        ).count()

        total_containers = 0

        total_payments = (
            db.query(Payment)
            .join(Booking, Payment.booking_id == Booking.booking_id)
            .filter(Booking.trader_id == user_id)
            .count()
        )

        completed_payments = (
            db.query(Payment)
            .join(Booking, Payment.booking_id == Booking.booking_id)
            .filter(
                Booking.trader_id == user_id,
                Payment.payment_status == "Paid"
            )
            .count()
        )

        total_revenue = (
            db.query(func.sum(Payment.amount))
            .join(Booking, Payment.booking_id == Booking.booking_id)
            .filter(Booking.trader_id == user_id)
            .scalar()
            or 0
        )
        recent_bookings = (
            db.query(Booking)
            .filter(Booking.trader_id == user_id)
            .order_by(Booking.booking_id.desc())
            .limit(5)
            .all()
        )

    # ===========================================
    # LOGISTICS DASHBOARD
    # ===========================================
    else:

        logistics = db.query(Logistics).filter(
            Logistics.user_id == user_id
        ).first()

        if logistics:

            total_bookings = db.query(Booking).filter(
                Booking.logistics_id == logistics.logistics_id
            ).count()

            pending_bookings = db.query(Booking).filter(
                Booking.logistics_id == logistics.logistics_id,
                Booking.status == "Pending"
            ).count()

            assigned_bookings = db.query(Booking).filter(
                Booking.logistics_id == logistics.logistics_id,
                Booking.status == "Assigned"
            ).count()

            in_transit_bookings = db.query(Booking).filter(
                Booking.logistics_id == logistics.logistics_id,
                Booking.status == "In Transit"
            ).count()

            completed_bookings = db.query(Booking).filter(
                Booking.logistics_id == logistics.logistics_id,
                Booking.status == "Completed"
            ).count()
            if logistics:
                recent_bookings = (
                    db.query(Booking)
                    .filter(Booking.logistics_id == logistics.logistics_id)
                    .order_by(Booking.booking_id.desc())
                    .limit(5)
                    .all()
                )
    
            else:
                recent_bookings = []

        else:

            total_bookings = 0
            pending_bookings = 0
            assigned_bookings = 0
            in_transit_bookings = 0
            completed_bookings = 0

        total_users = 0
        total_logistics = 0
        total_containers = db.query(Container).count()
        total_payments = 0
        completed_payments = 0
        total_revenue = 0

    return DashboardResponse(
        total_users=total_users,
        total_logistics=total_logistics,
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        assigned_bookings=assigned_bookings,
        in_transit_bookings=in_transit_bookings,
        completed_bookings=completed_bookings,
        total_containers=total_containers,
        total_payments=total_payments,
        completed_payments=completed_payments,
        total_revenue=total_revenue,
        recent_bookings=recent_bookings
    )