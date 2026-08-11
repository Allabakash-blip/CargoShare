from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin

from app.security import hash_password, verify_password
from app.auth import create_access_token

from app.dependencies.auth import (
    get_current_user,
    admin_only,
    trader_only,
    logistics_only
)

router = APIRouter(prefix="/users", tags=["Users"])


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- REGISTER ----------------

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    status = "Pending"

    if user.role == "Admin":
        status = "Approved"

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password),
        phone=user.phone,
        role=user.role,
        status=status
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "user_id": new_user.user_id
    }

# ---------------- LOGIN ----------------

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Password"
        )

    # Check selected role
    if db_user.role != user.role:
        raise HTTPException(
            status_code=401,
            detail=f"This account is registered as {db_user.role}."
        )

    # Check approval
    if db_user.status != "Approved":
        raise HTTPException(
            status_code=403,
            detail="Your account is waiting for Admin approval."
        )

    token = create_access_token(
    {
        "user_id": db_user.user_id,
        "full_name": db_user.full_name,
        "email": db_user.email,
        "role": db_user.role,
    }
)

    return {
        "access_token": token,
        "token_type": "bearer",
    }


# ---------------- PROFILE ----------------

@router.get("/profile")
def profile(current_user=Depends(get_current_user)):
    return {
        "message": "Welcome",
        "user": current_user
    }


# ---------------- GET LOGISTICS USERS ----------------

@router.get("/logistics-users")
def get_logistics_users(
    db: Session = Depends(get_db),
    current_user=Depends(admin_only)
):
    users = db.query(User).filter(
        User.role == "Logistics",
        User.status == "Approved"
    ).all()

    return users


# ---------------- TEST ROUTES ----------------

@router.get("/admin-test")
def admin_test(current_user=Depends(admin_only)):
    return {"message": "Welcome Admin"}


@router.get("/trader-test")
def trader_test(current_user=Depends(trader_only)):
    return {"message": "Welcome Trader"}


@router.get("/logistics-test")
def logistics_test(current_user=Depends(logistics_only)):
    return {"message": "Welcome Logistics"}