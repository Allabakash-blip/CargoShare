from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    pickup_location: str
    delivery_location: str
    goods_description: str

    weight: float = Field(
        gt=0,
        description="Weight must be greater than 0"
    )

    amount: float = Field(
        gt=0,
        description="Amount must be greater than 0"
    )


class BookingUpdate(BaseModel):
    logistics_id: int
    status: str


class BookingAssign(BaseModel):
    logistics_id: int


class BookingResponse(BaseModel):
    booking_id: int
    trader_id: int
    logistics_id: int | None

    pickup_location: str
    delivery_location: str
    goods_description: str
    weight: float
    amount: float
    status: str

    class Config:
        from_attributes = True