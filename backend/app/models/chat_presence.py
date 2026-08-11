from sqlalchemy import Column, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class ChatPresence(Base):
    __tablename__ = "chat_presence"

    presence_id = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.user_id",
            ondelete="CASCADE"
        ),
        nullable=False,
        unique=True,
        index=True
    )

    is_online = Column(
        Boolean,
        nullable=False,
        default=False
    )

    last_seen = Column(
        DateTime,
        nullable=True
    )

    updated_at = Column(
        DateTime,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp()
    )