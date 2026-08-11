from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db

from app.models.booking import Booking
from app.models.container import Container
from app.models.logistics import Logistics
from app.models.payment import Payment
from app.models.tracking import Tracking

router = APIRouter(
    prefix="/search",
    tags=["Global Search"]
)


@router.get("/")
def global_search(q: str, db: Session = Depends(get_db)):
    results = []

    # ---------------------------
    # Booking Search
    # ---------------------------
    bookings = db.query(Booking).filter(
        or_(
            Booking.pickup_location.ilike(f"%{q}%"),
            Booking.delivery_location.ilike(f"%{q}%"),
            Booking.goods_description.ilike(f"%{q}%"),
            Booking.status.ilike(f"%{q}%")
        )
    ).all()

    for booking in bookings:
        results.append({
            "type": "Booking",
            "id": booking.booking_id,
            "title": f"Booking #{booking.booking_id}",
            "subtitle": f"{booking.pickup_location} → {booking.delivery_location}",
            "route": f"/dashboard/bookings?highlight={booking.booking_id}"
        })

    # ---------------------------
    # Container Search
    # ---------------------------
    containers = db.query(Container).filter(
        or_(
            Container.container_number.ilike(f"%{q}%"),
            Container.container_type.ilike(f"%{q}%"),
            Container.status.ilike(f"%{q}%")
        )
    ).all()

    for container in containers:
        results.append({
            "type": "Container",
            "id": container.container_id,
            "title": container.container_number,
            "subtitle": container.status,
            "route": f"/dashboard/containers?highlight={container.container_id}"
        })

    # ---------------------------
    # Logistics Search
    # ---------------------------
    logistics = db.query(Logistics).filter(
        or_(
            Logistics.company_name.ilike(f"%{q}%"),
            Logistics.contact_person.ilike(f"%{q}%"),
            Logistics.vehicle_number.ilike(f"%{q}%"),
            Logistics.vehicle_type.ilike(f"%{q}%")
        )
    ).all()

    for item in logistics:
        results.append({
            "type": "Logistics",
            "id": item.logistics_id,
            "title": item.company_name,
            "subtitle": item.vehicle_number,
            "route": f"/dashboard/logistics?highlight={item.logistics_id}"
        })

    # ---------------------------
    # Payment Search
    # ---------------------------
    payments = db.query(Payment).all()

    for payment in payments:
        if (
            q.lower() in str(payment.id).lower()
            or q.lower() in str(payment.booking_id).lower()
            or q.lower() in str(payment.amount).lower()
            or q.lower() in payment.payment_method.lower()
            or q.lower() in payment.payment_status.lower()
        ):
            results.append({
                "type": "Payment",
                "id": payment.id,
                "title": f"Payment #{payment.id}",
                "subtitle": f"Booking #{payment.booking_id} • {payment.payment_status}",
                "route": f"/dashboard/payments?highlight={payment.id}"
            })

    # ---------------------------
    # Tracking Search
    # ---------------------------
    tracking = db.query(Tracking).filter(
        or_(
            Tracking.current_location.ilike(f"%{q}%"),
            Tracking.shipment_status.ilike(f"%{q}%")
        )
    ).all()

    for track in tracking:
        results.append({
            "type": "Tracking",
            "id": track.tracking_id,
            "title": f"Tracking #{track.tracking_id}",
            "subtitle": track.shipment_status,
            "route": f"/dashboard/tracking?highlight={track.tracking_id}"
        })

    return {
        "query": q,
        "count": len(results),
        "results": results
    }