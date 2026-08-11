import os
import shutil

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.models.booking import Booking
from app.dependencies.auth import get_current_user
from app.schemas.document import DocumentResponse
from fastapi.responses import FileResponse
router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post(
    "/{booking_id}",
    response_model=DocumentResponse,
)
def upload_document(
    booking_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename,
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    document = Document(
        booking_id=booking_id,
        file_name=file.filename,
        file_path=file_path,
        uploaded_by=current_user["email"],
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    return document

@router.get(
    "/{booking_id}",
    response_model=list[DocumentResponse],
)
def get_documents(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    documents = (
        db.query(Document)
        .filter(Document.booking_id == booking_id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return documents
@router.get("/download/{document_id}")
def download_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(Document.document_id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    return FileResponse(
        path=document.file_path,
        filename=document.file_name,
        media_type="application/octet-stream",
    )

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(Document.document_id == document_id)
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    # Delete physical file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }