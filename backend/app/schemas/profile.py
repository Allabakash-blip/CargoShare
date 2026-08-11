from pydantic import BaseModel, EmailStr
from typing import Optional


class ProfileResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    role: str
    status: Optional[str] = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: str
    phone: str