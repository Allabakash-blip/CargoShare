from sqlalchemy import Column, Integer, String, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(15))

    profile_picture = Column(String(500), nullable=True)

    role = Column(Enum("Admin", "Trader", "Logistics"))
    status = Column(Enum("Pending", "Approved", "Rejected"))
    created_at = Column(TIMESTAMP, server_default=func.now())