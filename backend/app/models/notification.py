from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    message = Column(String(255), nullable=False)

    status = Column(String(20), default="Unread")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )