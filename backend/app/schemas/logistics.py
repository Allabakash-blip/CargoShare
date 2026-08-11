from pydantic import BaseModel, EmailStr


class LogisticsCreate(BaseModel):
    user_id: int
    company_name: str
    contact_person: str
    phone: str
    email: EmailStr
    vehicle_type: str
    vehicle_number: str
    capacity: str


class LogisticsUpdate(BaseModel):
    user_id: int
    company_name: str
    contact_person: str
    phone: str
    email: EmailStr
    vehicle_type: str
    vehicle_number: str
    capacity: str
    status: str


class LogisticsResponse(BaseModel):
    logistics_id: int
    user_id: int
    company_name: str
    contact_person: str
    phone: str
    email: EmailStr
    vehicle_type: str
    vehicle_number: str
    capacity: str
    status: str

    class Config:
        from_attributes = True