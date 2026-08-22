from sqlalchemy import Column, Integer, Float, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id"),
        nullable=False
    )

    amount = Column(
        Float,
        nullable=False
    )

    # Payment method is selected when the trader actually pays.
    # It is NULL when the payment is automatically created.
    payment_method = Column(
        String(50),
        nullable=True
    )

    payment_status = Column(
        String(20),
        default="Pending",
        nullable=False
    )

    booking = relationship(
        "Booking"
    )