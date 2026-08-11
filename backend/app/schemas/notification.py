from pydantic import BaseModel
from datetime import datetime


class NotificationCreate(BaseModel):
    user_id: int
    message: str


class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True