from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract

from app.database import get_db

from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.booking import Booking
from app.models.logistics import Logistics
from app.models.payment import Payment
from app.models.container import Container

from app.schemas.analytics import AnalyticsResponse

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/", response_model=AnalyticsResponse)
def get_analytics(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):

    total_users = db.query(User).count()

    total_logistics = db.query(Logistics).count()

    total_bookings = db.query(Booking).count()

    pending_bookings = (
        db.query(Booking)
        .filter(Booking.status == "Pending")
        .count()
    )

    assigned_bookings = (
        db.query(Booking)
        .filter(Booking.status == "Assigned")
        .count()
    )

    in_transit_bookings = (
        db.query(Booking)
        .filter(Booking.status == "In Transit")
        .count()
    )

    completed_bookings = (
        db.query(Booking)
        .filter(Booking.status == "Completed")
        .count()
    )

    total_payments = db.query(Payment).count()

    completed_payments = (
        db.query(Payment)
        .filter(Payment.payment_status == "Completed")
        .count()
    )

    total_revenue = (
        db.query(func.sum(Payment.amount)).scalar() or 0
    )

    total_containers = db.query(Container).count()

    booking_status = [
        {
            "name": "Pending",
            "value": pending_bookings,
        },
        {
            "name": "Assigned",
            "value": assigned_bookings,
        },
        {
            "name": "In Transit",
            "value": in_transit_bookings,
        },
        {
            "name": "Completed",
            "value": completed_bookings,
        },
    ]
    pending_payments = (
        db.query(Payment)
        .filter(Payment.payment_status == "Pending")
        .count()
    )

    payment_status = [
    {
        "name": "Completed",
        "value": completed_payments,
    },
    {
        "name": "Pending",
        "value": pending_payments,
    },
]

    monthly_data = (
        db.query(
            extract("month", Booking.created_at).label("month"),
            func.count(Booking.booking_id).label("bookings"),
        )
        .group_by(extract("month", Booking.created_at))
        .order_by(extract("month", Booking.created_at))
        .all()
    )

    month_names = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]

    monthly_bookings = [
        {
            "month": month_names[int(item.month)],
            "bookings": item.bookings,
        }
        for item in monthly_data
    ]

    top_logistics_data = (
    db.query(
        Logistics.company_name,
        func.count(Booking.booking_id).label("bookings"),
    )
    .join(
        Booking,
        Booking.logistics_id == Logistics.logistics_id,
    )
    .group_by(
        Logistics.company_name,
    )
    .order_by(
        func.count(Booking.booking_id).desc()
    )
    .limit(5)
    .all()
)

    top_logistics = [
    {
        "name": item.company_name,
        "bookings": item.bookings,
    }
    for item in top_logistics_data
]

    return AnalyticsResponse(
        total_users=total_users,
        total_logistics=total_logistics,
        total_bookings=total_bookings,
        pending_bookings=pending_bookings,
        assigned_bookings=assigned_bookings,
        in_transit_bookings=in_transit_bookings,
        completed_bookings=completed_bookings,
        total_payments=total_payments,
        completed_payments=completed_payments,
        total_revenue=total_revenue,
        total_containers=total_containers,
        booking_status=booking_status,
        payment_status=payment_status,
        monthly_bookings=monthly_bookings,
        top_logistics=top_logistics,
    )