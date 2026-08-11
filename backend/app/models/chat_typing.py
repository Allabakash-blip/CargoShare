from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func

from app.database import Base


class ChatTyping(Base):

    __tablename__ = "chat_typing"

    typing_id = Column(
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

    user_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    last_typing_at = Column(
        DateTime,
        nullable=False,
        server_default=func.current_timestamp()
    )

    __table_args__ = (
        UniqueConstraint(
            "conversation_id",
            "user_id",
            name="uq_chat_typing_conversation_user"
        ),
    )