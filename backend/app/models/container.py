from sqlalchemy import Column, Integer, String
from app.database import Base


class Container(Base):
    __tablename__ = "containers"

    container_id = Column(Integer, primary_key=True, index=True)
    container_number = Column(String(50), unique=True, nullable=False)
    container_type = Column(String(50), nullable=False)
    capacity = Column(String(50), nullable=False)
    status = Column(String(30), default="Available")