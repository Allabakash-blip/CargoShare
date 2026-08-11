from pydantic import BaseModel
from datetime import datetime


class DocumentResponse(BaseModel):
    document_id: int
    booking_id: int
    file_name: str
    file_path: str
    uploaded_by: str
    uploaded_at: datetime

    class Config:
        from_attributes = True