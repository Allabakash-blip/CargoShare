from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.booking import Booking
from app.models.payment import Payment
from app.models.logistics import Logistics
from app.models.notification import Notification
from app.models.tracking import Tracking
from app.models.user import User
from app.models.chat_conversation import ChatConversation
from app.models.chat_participant import ChatParticipant

from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingAssign,
    BookingResponse
)

from app.dependencies.auth import (
    trader_only,
    logistics_only,
    admin_only,
    admin_or_trader,
)

from app.logs.logger import logger
from app.services.activity_logger import log_activity

from app.services.email_service import (
    send_booking_created_email,
    send_booking_assigned_email,
)

from fastapi import BackgroundTasks


router = APIRouter(
    prefix="/booking",
    tags=["Booking"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# Create Booking
# Trader Only
# --------------------------------------------------
@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(trader_only)
):

    new_booking = Booking(
    trader_id=current_user["user_id"],
    pickup_location=booking.pickup_location,
    delivery_location=booking.delivery_location,
    goods_description=booking.goods_description,
    weight=booking.weight,
    amount=booking.amount,
    status="Pending"
)

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # ----------------------------------------------
    # Find all Admins
    # ----------------------------------------------
    admins = (
        db.query(User)
        .filter(User.role == "Admin")
        .all()
    )

    # ----------------------------------------------
    # Send booking-created email to Admins
    # ----------------------------------------------
    for admin in admins:
        background_tasks.add_task(
            send_booking_created_email,
            admin.email,
            new_booking.booking_id,
            current_user["email"],
        )

    # ----------------------------------------------
    # Activity Log
    # ----------------------------------------------
    log_activity(
        db=db,
        user_email=current_user["email"],
        user_role=current_user["role"],
        action=f"Created Booking #{new_booking.booking_id}",
    )

    # ----------------------------------------------
    # Notification to Admins
    # ----------------------------------------------
    for admin in admins:

        db.add(
            Notification(
                user_id=admin.user_id,
                message=f"New Booking #{new_booking.booking_id} has been created.",
                status="Unread"
            )
        )

    # ----------------------------------------------
    # Notification to Trader
    # ----------------------------------------------
    db.add(
        Notification(
            user_id=current_user["user_id"],
            message=f"Your Booking #{new_booking.booking_id} has been created successfully.",
            status="Unread"
        )
    )

    db.commit()

    logger.info(
        f"Booking Created | Booking ID={new_booking.booking_id}"
    )

    return new_booking


# --------------------------------------------------
# View Bookings
# Admin -> All Bookings
# Trader -> Own Bookings
# --------------------------------------------------
@router.get("/", response_model=list[BookingResponse])
def get_all_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_trader)
):

    if current_user["role"] == "Admin":
        return db.query(Booking).all()

    return db.query(Booking).filter(
        Booking.trader_id == current_user["user_id"]
    ).all()


# --------------------------------------------------
# My Assigned Bookings
# Logistics Only
# --------------------------------------------------
@router.get("/my-bookings", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):

    logistics = db.query(Logistics).filter(
        Logistics.user_id == current_user["user_id"]
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics profile not found."
        )

    return db.query(Booking).filter(
        Booking.logistics_id == logistics.logistics_id
    ).all()


# --------------------------------------------------
# View Single Booking
# --------------------------------------------------
@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking_by_id(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_trader)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    if (
        current_user["role"] == "Trader"
        and booking.trader_id != current_user["user_id"]
    ):
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    return booking


# --------------------------------------------------
# Logistics Update Booking
# --------------------------------------------------
@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking: BookingUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):

    db_booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not db_booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    db_booking.logistics_id = booking.logistics_id
    db_booking.status = booking.status

    db.commit()
    db.refresh(db_booking)

    return db_booking


# --------------------------------------------------
# Assign Logistics
# Admin Only
# --------------------------------------------------
@router.put("/{booking_id}/assign", response_model=BookingResponse)
async def assign_logistics(
    booking_id: int,
    assignment: BookingAssign,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):

    # ----------------------------------------------
    # Find Booking
    # ----------------------------------------------

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    # ----------------------------------------------
    # Find Logistics Provider
    # ----------------------------------------------

    logistics = db.query(Logistics).filter(
        Logistics.logistics_id == assignment.logistics_id
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics Provider Not Found"
        )

    # ----------------------------------------------
    # Store previous Logistics
    # ----------------------------------------------

    previous_logistics_id = booking.logistics_id

    # ----------------------------------------------
    # Assign Logistics
    # ----------------------------------------------

    booking.logistics_id = logistics.logistics_id
    booking.status = "Assigned"

    # ==================================================
    # CREATE / GET BOOKING CHAT
    # ==================================================

    chat_conversation = db.query(ChatConversation).filter(
        ChatConversation.booking_id == booking.booking_id,
        ChatConversation.conversation_type == "BOOKING"
    ).first()

    # ----------------------------------------------
    # Create conversation if it doesn't exist
    # ----------------------------------------------

    if not chat_conversation:

        chat_conversation = ChatConversation(
            booking_id=booking.booking_id,
            conversation_type="BOOKING",
            title=f"Booking #{booking.booking_id} Chat",
            status="ACTIVE"
        )

        db.add(chat_conversation)

        # Flush so conversation_id becomes available
        db.flush()

    # ==================================================
    # TRADER PARTICIPANT
    # ==================================================

    trader_participant = db.query(ChatParticipant).filter(
        ChatParticipant.conversation_id ==
        chat_conversation.conversation_id,
        ChatParticipant.user_id ==
        booking.trader_id
    ).first()

    if not trader_participant:

        db.add(
            ChatParticipant(
                conversation_id=
                    chat_conversation.conversation_id,
                user_id=booking.trader_id
            )
        )

    # ==================================================
    # LOGISTICS PARTICIPANT
    # ==================================================

    logistics_participant = db.query(ChatParticipant).filter(
        ChatParticipant.conversation_id ==
        chat_conversation.conversation_id,
        ChatParticipant.user_id ==
        logistics.user_id
    ).first()

    if not logistics_participant:

        db.add(
            ChatParticipant(
                conversation_id=
                    chat_conversation.conversation_id,
                user_id=logistics.user_id
            )
        )

    # ==================================================
    # REMOVE PREVIOUS LOGISTICS PARTICIPANT
    # ==================================================

    if (
        previous_logistics_id
        and previous_logistics_id != logistics.logistics_id
    ):

        previous_logistics = db.query(Logistics).filter(
            Logistics.logistics_id ==
            previous_logistics_id
        ).first()

        if previous_logistics:

            previous_participant = db.query(
                ChatParticipant
            ).filter(
                ChatParticipant.conversation_id ==
                chat_conversation.conversation_id,

                ChatParticipant.user_id ==
                previous_logistics.user_id
            ).first()

            if previous_participant:

                db.delete(previous_participant)

    # ==================================================
    # NOTIFICATION TO LOGISTICS
    # ==================================================

    db.add(
        Notification(
            user_id=logistics.user_id,
            message=
                f"You have been assigned Booking #{booking.booking_id}.",
            status="Unread"
        )
    )

    # ==================================================
    # NOTIFICATION TO TRADER
    # ==================================================

    db.add(
        Notification(
            user_id=booking.trader_id,
            message=
                f"Your Booking #{booking.booking_id} has been assigned to {logistics.company_name}.",
            status="Unread"
        )
    )

    # ==================================================
    # SAVE DATABASE CHANGES
    # ==================================================

    db.commit()
    db.refresh(booking)

    # ==================================================
    # SEND EMAIL
    # ==================================================

    background_tasks.add_task(
    send_booking_assigned_email,
    logistics.email,
    booking.booking_id,
)

    # ==================================================
    # ACTIVITY LOG
    # ==================================================

    log_activity(
        db=db,
        user_email=current_user["email"],
        user_role=current_user["role"],
        action=
            f"Assigned Booking #{booking.booking_id} to Logistics #{logistics.logistics_id}",
    )

    logger.info(
        f"Booking {booking.booking_id} assigned to Logistics {logistics.logistics_id}"
    )

    return booking


# --------------------------------------------------
# Delete Booking
# Trader Only
# --------------------------------------------------
@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(trader_only)
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    if booking.trader_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own bookings."
        )

    tracking = db.query(Tracking).filter(
        Tracking.booking_id == booking_id
    ).first()

    if tracking:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete booking because tracking records exist."
        )

    db.delete(booking)
    db.commit()

    log_activity(
        db=db,
        user_email=current_user["email"],
        user_role=current_user["role"],
        action=f"Deleted Booking #{booking_id}",
    )

    logger.info(
        f"Booking Deleted | Booking ID={booking.booking_id}"
    )

    return {
        "message": "Booking Deleted Successfully"
    }


# --------------------------------------------------
# Update Booking Status
# Logistics Only
# --------------------------------------------------
@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):

    # ----------------------------------------------
    # Find booking
    # ----------------------------------------------
    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking Not Found"
        )

    # ----------------------------------------------
    # Find logged-in Logistics profile
    # ----------------------------------------------
    logistics = db.query(Logistics).filter(
        Logistics.user_id == current_user["user_id"]
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics profile not found."
        )

    # ----------------------------------------------
    # Verify assignment
    # ----------------------------------------------
    if booking.logistics_id != logistics.logistics_id:
        raise HTTPException(
            status_code=403,
            detail="You are not assigned to this booking."
        )

    # ----------------------------------------------
    # Allowed status transitions
    # ----------------------------------------------
    allowed_transitions = {
        "Assigned": "In Transit",
        "In Transit": "Completed",
    }

    current_status = booking.status

    if current_status not in allowed_transitions:
        raise HTTPException(
            status_code=400,
            detail="Booking cannot be updated anymore."
        )

    expected_status = allowed_transitions[current_status]

    if status != expected_status:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Status can only change from "
                f"'{current_status}' to '{expected_status}'."
            )
        )

    # ----------------------------------------------
    # Update booking status
    # ----------------------------------------------
    booking.status = status

    # ----------------------------------------------
    # Start shipment
    # ----------------------------------------------
    if status == "In Transit":

        existing_tracking = db.query(Tracking).filter(
            Tracking.booking_id == booking.booking_id
        ).first()

        if not existing_tracking:

            tracking = Tracking(
                booking_id=booking.booking_id,
                current_location="Shipment Picked Up",
                shipment_status="In Transit"
            )

            db.add(tracking)

    # ----------------------------------------------
    # Shipment Completed
    # ----------------------------------------------
    elif status == "Completed":

        tracking = db.query(Tracking).filter(
            Tracking.booking_id == booking.booking_id
        ).first()

        if tracking:
            tracking.current_location = "Delivered"
            tracking.shipment_status = "Completed"

        # ------------------------------------------
        # AUTOMATICALLY CREATE PAYMENT
        # ------------------------------------------

        existing_payment = db.query(Payment).filter(
            Payment.booking_id == booking.booking_id
        ).first()

        if not existing_payment:

            new_payment = Payment(
                booking_id=booking.booking_id,
                amount=booking.amount,
                payment_method="Auto",
                payment_status="Pending"
            )

            db.add(new_payment)

            logger.info(
                f"Automatic payment created for "
                f"Booking #{booking.booking_id}"
            )

        # ------------------------------------------
        # Notify Trader
        # ------------------------------------------
        db.add(
            Notification(
                user_id=booking.trader_id,
                message=(
                    f"Shipment/Booking #{booking.booking_id} "
                    f"has been completed. "
                    f"Payment has been created and is Pending."
                ),
                status="Unread"
            )
        )

        # ------------------------------------------
        # Notify ALL Admins
        # ------------------------------------------
        admins = (
            db.query(User)
            .filter(User.role == "Admin")
            .all()
        )

        for admin in admins:

            db.add(
                Notification(
                    user_id=admin.user_id,
                    message=(
                        f"Shipment/Booking #{booking.booking_id} "
                        f"has been completed. "
                        f"Payment has been created."
                    ),
                    status="Unread"
                )
            )

        logger.info(
            f"Completion notifications created for "
            f"Booking #{booking.booking_id}"
        )

    # ----------------------------------------------
    # Save everything
    # ----------------------------------------------
    db.commit()
    db.refresh(booking)

    # ----------------------------------------------
    # Activity Log
    # ----------------------------------------------
    log_activity(
        db=db,
        user_email=current_user["email"],
        user_role=current_user["role"],
        action=(
            f"Updated Booking #{booking.booking_id} "
            f"status to {status}"
        ),
    )

    logger.info(
        f"Booking {booking.booking_id} "
        f"status updated to {status}"
    )

    return booking