from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class ChatConversation(Base):
    __tablename__ = "chat_conversations"

    conversation_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.booking_id", ondelete="CASCADE"),
        nullable=True,
        index=True
    )

    conversation_type = Column(
        String(20),
        nullable=False,
        default="BOOKING"
    )

    title = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(20),
        nullable=False,
        default="ACTIVE"
    )

    created_at = Column(
        DateTime,
        server_default=func.current_timestamp()
    )

    updated_at = Column(
        DateTime,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )