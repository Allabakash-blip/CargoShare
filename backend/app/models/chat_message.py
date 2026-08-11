from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    message_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    conversation_id = Column(
        Integer,
        ForeignKey(
            "chat_conversations.conversation_id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    sender_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    message = Column(
        Text,
        nullable=False
    )

    message_type = Column(
        String(20),
        nullable=False,
        default="TEXT"
    )

    attachment_url = Column(
        String(500),
        nullable=True
    )

    attachment_name = Column(
        String(255),
        nullable=True
    )

    is_read = Column(
        Boolean,
        nullable=False,
        default=False
    )

    created_at = Column(
        DateTime,
        server_default=func.current_timestamp()
    )