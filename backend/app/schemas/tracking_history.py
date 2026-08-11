from pydantic import BaseModel
from datetime import datetime


class TrackingHistoryCreate(BaseModel):
    booking_id: int
    location: str
    status: str


class TrackingHistoryResponse(BaseModel):
    history_id: int
    booking_id: int
    location: str
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True