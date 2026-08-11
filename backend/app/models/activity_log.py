from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
)
from sqlalchemy.sql import func

from app.database import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    log_id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_email = Column(
        String(255),
        nullable=False,
    )

    user_role = Column(
        String(50),
        nullable=False,
    )

    action = Column(
        String(255),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )