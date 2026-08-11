from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    booking_id: int

    amount: float = Field(
        gt=0,
        description="Amount must be greater than 0"
    )

    payment_method: str


class PaymentUpdate(BaseModel):
    payment_status: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    payment_method: str
    payment_status: str

    class Config:
        from_attributes = True