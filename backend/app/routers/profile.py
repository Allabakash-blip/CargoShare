from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session

import os
import shutil
import uuid

from app.database import SessionLocal
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.schemas.profile import ProfileUpdate, ProfileResponse
from app.schemas.change_password import ChangePassword
from app.security import verify_password, hash_password
from app.auth import create_access_token


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# --------------------------------------------------
# Database
# --------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# Get Profile
# --------------------------------------------------

@router.get(
    "/",
    response_model=ProfileResponse
)
def get_profile(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


# --------------------------------------------------
# Update Profile
# --------------------------------------------------

@router.put("/")
def update_profile(
    profile: ProfileUpdate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.full_name = profile.full_name
    user.phone = profile.phone

    db.commit()
    db.refresh(user)

    access_token = create_access_token(
        {
            "user_id": user.user_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        }
    )

    return {
        "message": "Profile updated successfully",

        "access_token": access_token,

        "user": {
            "full_name": user.full_name,
            "email": user.email,
            "phone": user.phone,
            "role": user.role,
            "status": user.status,
            "profile_picture": user.profile_picture,
        },
    }


# --------------------------------------------------
# Change Password
# --------------------------------------------------

@router.put("/change-password")
def change_password(
    password: ChangePassword,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not verify_password(
        password.current_password,
        user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    if (
        password.new_password
        != password.confirm_password
    ):
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    user.password = hash_password(
        password.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }


# --------------------------------------------------
# Upload Profile Picture
# --------------------------------------------------

@router.post("/profile-picture")
def upload_profile_picture(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Allowed image types
    allowed_types = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed."
        )

    # Upload directory
    upload_dir = "uploads/profile_pictures"

    os.makedirs(
        upload_dir,
        exist_ok=True
    )

    # Delete previous profile picture
    if user.profile_picture:

        old_file = user.profile_picture

        if os.path.exists(old_file):
            try:
                os.remove(old_file)
            except OSError:
                pass

    # Generate unique filename
    extension = os.path.splitext(
        file.filename or ""
    )[1].lower()

    if not extension:
        extension = ".jpg"

    filename = (
        f"{user.user_id}_"
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )

    file_path = os.path.join(
        upload_dir,
        filename
    )

    # Save image
    with open(
        file_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )

    # Save path in database
    user.profile_picture = file_path.replace(
        "\\",
        "/"
    )

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile picture uploaded successfully",
        "profile_picture": user.profile_picture
    }


# --------------------------------------------------
# Remove Profile Picture
# --------------------------------------------------

@router.delete("/profile-picture")
def remove_profile_picture(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.user_id == current_user["user_id"]
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check if user has a profile picture
    if not user.profile_picture:
        return {
            "message": "No profile picture to remove",
            "profile_picture": None
        }

    # Get existing image path
    old_file = user.profile_picture

    # Delete physical image
    if os.path.exists(old_file):
        try:
            os.remove(old_file)
        except OSError as e:
            print(
                f"Could not delete profile picture: {e}"
            )

    # Remove image path from database
    user.profile_picture = None

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile picture removed successfully",
        "profile_picture": None
    }