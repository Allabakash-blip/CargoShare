from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base


class Tracking(Base):
    __tablename__ = "tracking"

    tracking_id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id"),
        nullable=False
    )

    current_location = Column(String(200), nullable=False)

    shipment_status = Column(
        String(50),
        default="Picked Up"
    )