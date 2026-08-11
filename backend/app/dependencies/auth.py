from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from app.auth import SECRET_KEY, ALGORITHM

security = HTTPBearer()


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    print("Authorization Header:", request.headers.get("authorization"))
    print("Credentials:", credentials)

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("Decoded Payload:", payload)

        if "user_id" not in payload or "role" not in payload:
            raise HTTPException(
                status_code=401,
                detail="Invalid token payload"
            )

        return payload

    except JWTError as e:
        print("JWT ERROR:", repr(e))

        raise HTTPException(
            status_code=401,
            detail=f"Invalid Token: {str(e)}"
        )


# -------------------------
# Single-role permissions
# -------------------------

def admin_only(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "Admin":
        raise HTTPException(
            status_code=403,
            detail="Admins only"
        )
    return current_user


def trader_only(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "Trader":
        raise HTTPException(
            status_code=403,
            detail="Traders only"
        )
    return current_user


def logistics_only(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "Logistics":
        raise HTTPException(
            status_code=403,
            detail="Logistics providers only"
        )
    return current_user


# -------------------------
# Multi-role permissions
# -------------------------

# Admin or Logistics
# (Used for viewing containers)
def admin_or_logistics(
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["Admin", "Logistics"]:
        raise HTTPException(
            status_code=403,
            detail="Admins or Logistics providers only"
        )
    return current_user


# Admin or Trader
# (Used for viewing bookings)
def admin_or_trader(
    current_user: dict = Depends(get_current_user)
):
    if current_user["role"] not in ["Admin", "Trader"]:
        raise HTTPException(
            status_code=403,
            detail="Admins or Traders only"
        )
    return current_user