from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os

from sqlalchemy import text

from app.database import engine, Base

# ============================================================
# Import all models
# ============================================================

from app.models.user import User
from app.models.logistics import Logistics
from app.models.container import Container
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.tracking import Tracking
from app.models.tracking_history import TrackingHistory
from app.models.notification import Notification
from app.models.activity_log import ActivityLog
from app.models.document import Document
from app.models.chat_presence import ChatPresence
from app.models.chat_typing import ChatTyping


# ============================================================
# Import routers
# ============================================================

from app.routers.user import router as user_router
from app.routers.admin import router as admin_router
from app.routers.container import router as container_router
from app.routers.logistics import router as logistics_router
from app.routers.booking import router as booking_router
from app.routers.payment import router as payment_router
from app.routers.dashboard import router as dashboard_router
from app.routers.tracking import router as tracking_router
from app.routers.activity_log import router as activity_log_router
# from app.routers.tracking_history import router as tracking_history_router

from app.routers.notification import router as notification_router
from app.routers.search import router as search_router
from app.routers import analytics
from app.routers.document import router as document_router
from app.routers.email_test import router as email_test_router
from app.routers.profile import router as profile_router
from app.routers import chat
from app.routers import chat_presence

from app.exceptions.handlers import register_exception_handlers
from fastapi.middleware.cors import CORSMiddleware


# ============================================================
# Create all database tables
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# Swagger Tags
# ============================================================

tags_metadata = [
    {
        "name": "Users",
        "description": "User Registration and Login"
    },
    {
        "name": "Admin",
        "description": "Admin Approval APIs"
    },
    {
        "name": "Booking",
        "description": "Cargo Booking APIs"
    },
    {
        "name": "Logistics",
        "description": "Logistics Provider APIs"
    },
    {
        "name": "Container",
        "description": "Container Management APIs"
    },
    {
        "name": "Payment",
        "description": "Payment APIs"
    },
    {
        "name": "Tracking",
        "description": "Live Shipment Tracking"
    },
    {
        "name": "Tracking History",
        "description": "Shipment Tracking History"
    },
    {
        "name": "Notifications",
        "description": "User Notifications"
    },
    {
        "name": "Dashboard",
        "description": "Dashboard Statistics"
    }
]


# ============================================================
# FastAPI Application
# ============================================================

app = FastAPI(
    title="CargoShare API",
    description=(
        "A logistics and cargo booking platform "
        "with Admin, Trader, and Logistics roles."
    ),
    version="1.0.0",
    contact={
        "name": "P Allabakash Khan",
        "email": "farhanfaru0321@gmail.com"
    },
    license_info={
        "name": "MITS"
    }
)


# ============================================================
# Static Files - Profile Pictures / Documents
# ============================================================

# Create upload directories if they don't already exist
os.makedirs(
    "uploads/profile_pictures",
    exist_ok=True
)

os.makedirs(
    "uploads",
    exist_ok=True
)

# Serve files through:
# http://127.0.0.1:8000/uploads/...
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ============================================================
# Exception Handlers
# ============================================================

register_exception_handlers(app)


# ============================================================
# CORS Configuration
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Include Routers
# ============================================================

app.include_router(activity_log_router)

app.include_router(admin_router)

app.include_router(user_router)

app.include_router(logistics_router)

app.include_router(booking_router)

app.include_router(container_router)

app.include_router(payment_router)

app.include_router(dashboard_router)

app.include_router(chat.router)

app.include_router(chat_presence.router)

app.include_router(tracking_router)

# Tracking History
# app.include_router(tracking_history_router)

app.include_router(notification_router)

app.include_router(search_router)

app.include_router(analytics.router)

app.include_router(document_router)

app.include_router(email_test_router)

app.include_router(profile_router)


# ============================================================
# Root Endpoint
# ============================================================

@app.get("/")
def home():
    return {
        "message": "CargoShare Backend is Running"
    }


# ============================================================
# Database Test Endpoint
# ============================================================

@app.get("/test-db")
def test_database():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "message": "Database Connected Successfully!"
        }

    except Exception as e:
        return {
            "error": str(e)
        }