from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)

    trader_id = Column(Integer, nullable=False)
    logistics_id = Column(Integer, nullable=True)

    pickup_location = Column(String(200), nullable=False)
    delivery_location = Column(String(200), nullable=False)

    goods_description = Column(String(255), nullable=False)
    weight = Column(Float, nullable=False)

    # Booking amount
    amount = Column(Float, nullable=False, default=0)

    status = Column(String(30), default="Pending")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )