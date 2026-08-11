from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User
from app.models.notification import Notification

from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
    PaymentResponse
)

from app.services.email_service import (
    send_payment_completed_email
)


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


# --------------------------------------------------
# Database
# --------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# Create Payment
# --------------------------------------------------

@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db)
):

    # Check booking exists
    booking = db.query(Booking).filter(
        Booking.booking_id == payment.booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    new_payment = Payment(
        booking_id=payment.booking_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        payment_status="Pending"
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment


# --------------------------------------------------
# Get All Payments
# --------------------------------------------------

@router.get("/", response_model=list[PaymentResponse])
def get_all_payments(
    db: Session = Depends(get_db)
):

    payments = db.query(Payment).all()

    return payments


# --------------------------------------------------
# Get Payment By ID
# --------------------------------------------------

@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment_by_id(
    payment_id: int,
    db: Session = Depends(get_db)
):

    payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment Not Found"
        )

    return payment


# --------------------------------------------------
# Update Payment
# --------------------------------------------------

@router.put(
    "/{payment_id}",
    response_model=PaymentResponse
)
async def update_payment(
    payment_id: int,
    payment: PaymentUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):

    db_payment = db.query(Payment).filter(
        Payment.id == payment_id
    ).first()

    if not db_payment:
        raise HTTPException(
            status_code=404,
            detail="Payment Not Found"
        )

    # Keep old status
    old_status = db_payment.payment_status

    # Update status
    db_payment.payment_status = payment.payment_status

    db.commit()
    db.refresh(db_payment)

    # --------------------------------------------------
    # Payment Completed / Paid
    # --------------------------------------------------

    if (
        db_payment.payment_status in ["Paid", "Completed"]
        and old_status not in ["Paid", "Completed"]
    ):

        booking = db.query(Booking).filter(
            Booking.booking_id == db_payment.booking_id
        ).first()

        if booking:

            # --------------------------------------------------
            # Notify Trader
            # --------------------------------------------------

            trader = db.query(User).filter(
                User.user_id == booking.trader_id
            ).first()

            if trader:

                db.add(
                    Notification(
                        user_id=trader.user_id,
                        message=(
                            f"Payment for Booking "
                            f"#{booking.booking_id} has been completed."
                        ),
                        status="Unread"
                    )
                )

                # Email to Trader
                background_tasks.add_task(
                    send_payment_completed_email,
                    trader.email,
                    db_payment.id,
                    db_payment.amount
                )

            # --------------------------------------------------
            # Notify Admins
            # --------------------------------------------------

            admins = db.query(User).filter(
                User.role == "Admin"
            ).all()

            for admin in admins:

                db.add(
                    Notification(
                        user_id=admin.user_id,
                        message=(
                            f"Payment for Booking "
                            f"#{booking.booking_id} has been completed."
                        ),
                        status="Unread"
                    )
                )

            # Save notifications
            db.commit()

    return db_payment