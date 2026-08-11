from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.logistics import Logistics
from app.models.user import User

from app.dependencies.auth import admin_only, logistics_only
from app.schemas.logistics import (
    LogisticsCreate,
    LogisticsUpdate,
    LogisticsResponse
)

router = APIRouter(
    prefix="/logistics",
    tags=["Logistics"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------ CREATE ------------------

@router.post("/", response_model=LogisticsResponse)
def add_logistics(
    logistics: LogisticsCreate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    # Check if user exists
    user = db.query(User).filter(
        User.user_id == logistics.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Ensure user has Logistics role
    if user.role != "Logistics":
        raise HTTPException(
            status_code=400,
            detail="Selected user is not a Logistics user"
        )

    # Prevent duplicate logistics assignment
    existing = db.query(Logistics).filter(
        Logistics.user_id == logistics.user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This Logistics user is already assigned."
        )

    new_logistics = Logistics(
        user_id=logistics.user_id,
        company_name=logistics.company_name,
        contact_person=logistics.contact_person,
        phone=logistics.phone,
        email=logistics.email,
        vehicle_type=logistics.vehicle_type,
        vehicle_number=logistics.vehicle_number,
        capacity=logistics.capacity
    )

    db.add(new_logistics)
    db.commit()
    db.refresh(new_logistics)

    return new_logistics


# ------------------ GET ALL ------------------

@router.get("/", response_model=list[LogisticsResponse])
def get_all_logistics(
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    return db.query(Logistics).all()


# ------------------ GET BY ID ------------------

@router.get("/{logistics_id}", response_model=LogisticsResponse)
def get_logistics_by_id(
    logistics_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):
    logistics = db.query(Logistics).filter(
        Logistics.logistics_id == logistics_id
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics Provider Not Found"
        )

    return logistics


# ------------------ UPDATE ------------------

@router.put("/{logistics_id}", response_model=LogisticsResponse)
def update_logistics(
    logistics_id: int,
    logistics: LogisticsUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    db_logistics = db.query(Logistics).filter(
        Logistics.logistics_id == logistics_id
    ).first()

    if not db_logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics Provider Not Found"
        )

    # Validate user
    user = db.query(User).filter(
        User.user_id == logistics.user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role != "Logistics":
        raise HTTPException(
            status_code=400,
            detail="Selected user is not a Logistics user"
        )

    existing = db.query(Logistics).filter(
        Logistics.user_id == logistics.user_id,
        Logistics.logistics_id != logistics_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="This Logistics user is already assigned."
        )

    db_logistics.user_id = logistics.user_id
    db_logistics.company_name = logistics.company_name
    db_logistics.contact_person = logistics.contact_person
    db_logistics.phone = logistics.phone
    db_logistics.email = logistics.email
    db_logistics.vehicle_type = logistics.vehicle_type
    db_logistics.vehicle_number = logistics.vehicle_number
    db_logistics.capacity = logistics.capacity
    db_logistics.status = logistics.status

    db.commit()
    db.refresh(db_logistics)

    return db_logistics


# ------------------ DELETE ------------------

@router.delete("/{logistics_id}")
def delete_logistics(
    logistics_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    logistics = db.query(Logistics).filter(
        Logistics.logistics_id == logistics_id
    ).first()

    if not logistics:
        raise HTTPException(
            status_code=404,
            detail="Logistics Provider Not Found"
        )

    db.delete(logistics)
    db.commit()

    return {
        "message": "Logistics Provider Deleted Successfully"
    }