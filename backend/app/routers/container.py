from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.container import Container
from app.schemas.container import (
    ContainerCreate,
    ContainerUpdate,
    ContainerResponse
)

from app.dependencies.auth import (
    logistics_only,
    admin_or_logistics,
)

router = APIRouter(
    prefix="/container",
    tags=["Container"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -----------------------------
# Create Container
# Logistics Only
# -----------------------------
@router.post("/", response_model=ContainerResponse)
def create_container(
    container: ContainerCreate,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):
    new_container = Container(
        container_number=container.container_number,
        container_type=container.container_type,
        capacity=container.capacity,
        status="Available"
    )

    db.add(new_container)
    db.commit()
    db.refresh(new_container)

    return new_container


# -----------------------------
# View All Containers
# Admin + Logistics
# -----------------------------
@router.get("/", response_model=list[ContainerResponse])
def get_all_containers(
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_logistics)
):
    return db.query(Container).all()


# -----------------------------
# View Single Container
# Admin + Logistics
# -----------------------------
@router.get("/{container_id}", response_model=ContainerResponse)
def get_container_by_id(
    container_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(admin_or_logistics)
):
    container = db.query(Container).filter(
        Container.container_id == container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container Not Found"
        )

    return container


# -----------------------------
# Update Container
# Logistics Only
# -----------------------------
@router.put("/{container_id}", response_model=ContainerResponse)
def update_container(
    container_id: int,
    container: ContainerUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):
    db_container = db.query(Container).filter(
        Container.container_id == container_id
    ).first()

    if not db_container:
        raise HTTPException(
            status_code=404,
            detail="Container Not Found"
        )

    db_container.container_number = container.container_number
    db_container.container_type = container.container_type
    db_container.capacity = container.capacity
    db_container.status = container.status

    db.commit()
    db.refresh(db_container)

    return db_container


# -----------------------------
# Delete Container
# Logistics Only
# -----------------------------
@router.delete("/{container_id}")
def delete_container(
    container_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(logistics_only)
):
    container = db.query(Container).filter(
        Container.container_id == container_id
    ).first()

    if not container:
        raise HTTPException(
            status_code=404,
            detail="Container Not Found"
        )

    db.delete(container)
    db.commit()

    return {
        "message": "Container Deleted Successfully"
    }