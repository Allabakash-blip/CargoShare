from pydantic import BaseModel
from typing import List


class RecentBooking(BaseModel):
    booking_id: int
    pickup_location: str
    delivery_location: str
    goods_description: str
    status: str

    class Config:
        from_attributes = True


class DashboardResponse(BaseModel):
    total_users: int
    total_logistics: int

    total_bookings: int

    pending_bookings: int
    assigned_bookings: int
    in_transit_bookings: int
    completed_bookings: int

    total_containers: int

    total_payments: int
    completed_payments: int

    total_revenue: float

    recent_bookings: List[RecentBooking]