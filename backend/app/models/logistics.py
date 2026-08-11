from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database import Base


class Logistics(Base):
    __tablename__ = "logistics"

    logistics_id = Column(Integer, primary_key=True, index=True)

    # Link to Users table
    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False,
        unique=True
    )

    company_name = Column(String(100), nullable=False)
    contact_person = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    vehicle_type = Column(String(50), nullable=False)
    vehicle_number = Column(String(30), unique=True, nullable=False)
    capacity = Column(String(30), nullable=False)
    status = Column(String(20), default="Available")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )