from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: str = Field(
        min_length=10,
        max_length=10,
        description="10-digit phone number"
    )
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str
    role: str


class UserResponse(BaseModel):
    user_id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str
    status: str

    class Config:
        from_attributes = True