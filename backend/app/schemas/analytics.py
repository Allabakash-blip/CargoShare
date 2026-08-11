from pydantic import BaseModel


class ChartItem(BaseModel):
    name: str
    value: int


class MonthlyBooking(BaseModel):
    month: str
    bookings: int

class LogisticsStat(BaseModel):
    name: str
    bookings: int


class AnalyticsResponse(BaseModel):
    total_users: int
    total_logistics: int

    total_bookings: int

    pending_bookings: int
    assigned_bookings: int
    in_transit_bookings: int
    completed_bookings: int

    total_payments: int
    completed_payments: int

    total_revenue: float

    total_containers: int

    booking_status: list[ChartItem]

    payment_status: list[ChartItem]

    monthly_bookings: list[MonthlyBooking]

    top_logistics: list[LogisticsStat]