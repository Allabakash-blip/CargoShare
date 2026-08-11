from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class TrackingHistory(Base):
    __tablename__ = "tracking_history"

    history_id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id"),
        nullable=False
    )

    location = Column(String(200), nullable=False)

    status = Column(String(50), nullable=False)

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )