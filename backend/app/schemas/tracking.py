from pydantic import BaseModel


class TrackingCreate(BaseModel):
    booking_id: int
    current_location: str
    shipment_status: str


class TrackingUpdate(BaseModel):
    current_location: str
    shipment_status: str


class TrackingResponse(BaseModel):
    tracking_id: int
    booking_id: int
    current_location: str
    shipment_status: str

    class Config:
        from_attributes = True