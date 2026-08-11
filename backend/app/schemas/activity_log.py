from datetime import datetime

from pydantic import BaseModel


class ActivityLogResponse(BaseModel):
    log_id: int

    user_email: str

    user_role: str

    action: str

    created_at: datetime

    class Config:
        from_attributes = True