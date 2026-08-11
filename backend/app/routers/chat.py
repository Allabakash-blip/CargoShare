from datetime import datetime, timedelta
import os
import uuid

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form
)

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.booking import Booking
from app.models.logistics import Logistics
from app.models.chat_conversation import ChatConversation
from app.models.chat_participant import ChatParticipant
from app.models.chat_message import ChatMessage
from app.models.chat_typing import ChatTyping

from app.schemas.chat import (
    ChatConversationCreate,
    ChatConversationResponse,
    ChatMessageCreate,
    ChatMessageResponse,
    ChatTypingRequest,
    ChatTypingResponse,
)


router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)


# ============================================================
# Database
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# Chat Upload Directory
# ============================================================

CHAT_UPLOAD_DIR = "uploads/chat"

os.makedirs(
    CHAT_UPLOAD_DIR,
    exist_ok=True
)


# ============================================================
# Create Conversation
# ============================================================

@router.post(
    "/conversations",
    response_model=ChatConversationResponse
)
def create_conversation(
    conversation: ChatConversationCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    # ==================================================
    # BOOKING CHAT
    # ==================================================

    if conversation.conversation_type == "BOOKING":

        if not conversation.booking_id:
            raise HTTPException(
                status_code=400,
                detail="Booking ID is required for booking chat"
            )

        booking = db.query(Booking).filter(
            Booking.booking_id == conversation.booking_id
        ).first()

        if not booking:
            raise HTTPException(
                status_code=404,
                detail="Booking not found"
            )

        logistics = None

        if booking.logistics_id:

            logistics = db.query(Logistics).filter(
                Logistics.logistics_id ==
                booking.logistics_id
            ).first()

        is_trader = (
            booking.trader_id == user_id
        )

        is_logistics = (
            logistics is not None
            and logistics.user_id == user_id
        )

        is_admin = (
            current_user.get("role") == "Admin"
        )

        if not (
            is_trader
            or is_logistics
            or is_admin
        ):
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to access this booking chat"
            )

        existing = db.query(ChatConversation).filter(
            ChatConversation.booking_id ==
            booking.booking_id,

            ChatConversation.conversation_type ==
            "BOOKING"
        ).first()

        if existing:

            trader_participant = db.query(
                ChatParticipant
            ).filter(
                ChatParticipant.conversation_id ==
                existing.conversation_id,

                ChatParticipant.user_id ==
                booking.trader_id
            ).first()

            if not trader_participant:

                db.add(
                    ChatParticipant(
                        conversation_id=
                            existing.conversation_id,

                        user_id=
                            booking.trader_id
                    )
                )

            if logistics:

                logistics_participant = db.query(
                    ChatParticipant
                ).filter(
                    ChatParticipant.conversation_id ==
                    existing.conversation_id,

                    ChatParticipant.user_id ==
                    logistics.user_id
                ).first()

                if not logistics_participant:

                    db.add(
                        ChatParticipant(
                            conversation_id=
                                existing.conversation_id,

                            user_id=
                                logistics.user_id
                        )
                    )

            current_participant = db.query(
                ChatParticipant
            ).filter(
                ChatParticipant.conversation_id ==
                existing.conversation_id,

                ChatParticipant.user_id ==
                user_id
            ).first()

            if not current_participant:

                db.add(
                    ChatParticipant(
                        conversation_id=
                            existing.conversation_id,

                        user_id=
                            user_id
                    )
                )

            db.commit()
            db.refresh(existing)

            return existing

        new_conversation = ChatConversation(
            booking_id=booking.booking_id,
            conversation_type="BOOKING",
            title=f"Booking #{booking.booking_id} Chat",
            status="ACTIVE"
        )

        db.add(new_conversation)

        db.flush()

        db.add(
            ChatParticipant(
                conversation_id=
                    new_conversation.conversation_id,

                user_id=
                    booking.trader_id
            )
        )

        if logistics:

            db.add(
                ChatParticipant(
                    conversation_id=
                        new_conversation.conversation_id,

                    user_id=
                        logistics.user_id
                )
            )

        if (
            user_id != booking.trader_id
            and (
                not logistics
                or user_id != logistics.user_id
            )
        ):

            db.add(
                ChatParticipant(
                    conversation_id=
                        new_conversation.conversation_id,

                    user_id=
                        user_id
                )
            )

        db.commit()
        db.refresh(new_conversation)

        return new_conversation

    # ==================================================
    # NON-BOOKING CONVERSATION
    # ==================================================

    new_conversation = ChatConversation(
        booking_id=conversation.booking_id,
        conversation_type=conversation.conversation_type,
        title=conversation.title,
        status="ACTIVE"
    )

    db.add(new_conversation)
    db.flush()

    db.add(
        ChatParticipant(
            conversation_id=
                new_conversation.conversation_id,

            user_id=
                user_id
        )
    )

    db.commit()
    db.refresh(new_conversation)

    return new_conversation


# ============================================================
# Get My Conversations
# ============================================================

@router.get(
    "/conversations",
    response_model=list[ChatConversationResponse]
)
def get_my_conversations(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    conversations = (
        db.query(ChatConversation)
        .join(
            ChatParticipant,
            ChatParticipant.conversation_id
            == ChatConversation.conversation_id
        )
        .filter(
            ChatParticipant.user_id == user_id
        )
        .order_by(
            ChatConversation.updated_at.desc()
        )
        .all()
    )

    response = []

    for conversation in conversations:

        participant = (
            db.query(ChatParticipant)
            .filter(
                ChatParticipant.conversation_id ==
                conversation.conversation_id,

                ChatParticipant.user_id ==
                user_id
            )
            .first()
        )

        latest_message = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.conversation_id ==
                conversation.conversation_id
            )
            .order_by(
                ChatMessage.created_at.desc()
            )
            .first()
        )

        unread_query = (
            db.query(ChatMessage)
            .filter(
                ChatMessage.conversation_id ==
                conversation.conversation_id,

                ChatMessage.sender_id != user_id
            )
        )

        if participant and participant.last_read_at:

            unread_query = unread_query.filter(
                ChatMessage.created_at >
                participant.last_read_at
            )

        unread_count = unread_query.count()

        response.append(
            ChatConversationResponse(
                conversation_id=
                    conversation.conversation_id,

                booking_id=
                    conversation.booking_id,

                conversation_type=
                    conversation.conversation_type,

                title=
                    conversation.title,

                status=
                    conversation.status,

                created_at=
                    conversation.created_at,

                updated_at=
                    conversation.updated_at,

                last_message=(
                    latest_message.message
                    if latest_message
                    else None
                ),

                last_message_at=(
                    latest_message.created_at
                    if latest_message
                    else None
                ),

                unread_count=
                    unread_count
            )
        )

    return response


# ============================================================
# Get Conversation
# ============================================================

@router.get(
    "/conversations/{conversation_id}",
    response_model=ChatConversationResponse
)
def get_conversation(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    participant = db.query(ChatParticipant).filter(
        ChatParticipant.conversation_id == conversation_id,
        ChatParticipant.user_id == user_id
    ).first()

    if not participant:

        user = db.query(User).filter(
            User.user_id == user_id
        ).first()

        if not user or user.role != "Admin":
            raise HTTPException(
                status_code=403,
                detail="You are not a participant in this conversation"
            )

    conversation = db.query(ChatConversation).filter(
        ChatConversation.conversation_id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    return conversation


# ============================================================
# Update Typing Status
# ============================================================

@router.post(
    "/conversations/{conversation_id}/typing"
)
def update_typing_status(
    conversation_id: int,
    typing_data: ChatTypingRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    participant = (
        db.query(ChatParticipant)
        .filter(
            ChatParticipant.conversation_id ==
            conversation_id,

            ChatParticipant.user_id ==
            user_id
        )
        .first()
    )

    if not participant:

        user = db.query(User).filter(
            User.user_id == user_id
        ).first()

        if not user or user.role != "Admin":
            raise HTTPException(
                status_code=403,
                detail="You are not a participant"
            )

    typing_record = (
        db.query(ChatTyping)
        .filter(
            ChatTyping.conversation_id ==
            conversation_id,

            ChatTyping.user_id ==
            user_id
        )
        .first()
    )

    # ----------------------------------------------
    # START TYPING
    # ----------------------------------------------

    if typing_data.is_typing:

        if typing_record:

            typing_record.last_typing_at = datetime.now()

        else:

            typing_record = ChatTyping(
                conversation_id=
                    conversation_id,

                user_id=
                    user_id,

                last_typing_at=
                    datetime.now()
            )

            db.add(typing_record)

        db.commit()

        return {
            "success": True,
            "user_id": user_id,
            "is_typing": True
        }

    # ----------------------------------------------
    # STOP TYPING
    # ----------------------------------------------

    if typing_record:

        db.delete(
            typing_record
        )

        db.commit()

    return {
        "success": True,
        "user_id": user_id,
        "is_typing": False
    }


# ============================================================
# Get Typing Status
# ============================================================

@router.get(
    "/conversations/{conversation_id}/typing",
    response_model=list[ChatTypingResponse]
)
def get_typing_status(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    participant = (
        db.query(ChatParticipant)
        .filter(
            ChatParticipant.conversation_id ==
            conversation_id,

            ChatParticipant.user_id ==
            user_id
        )
        .first()
    )

    if not participant:

        user = db.query(User).filter(
            User.user_id == user_id
        ).first()

        if not user or user.role != "Admin":
            raise HTTPException(
                status_code=403,
                detail="You are not a participant"
            )

    expiry_time = (
        datetime.now()
        - timedelta(seconds=4)
    )

    (
        db.query(ChatTyping)
        .filter(
            ChatTyping.conversation_id ==
            conversation_id,

            ChatTyping.last_typing_at <
            expiry_time
        )
        .delete(
            synchronize_session=False
        )
    )

    db.commit()

    typing_records = (
        db.query(ChatTyping)
        .filter(
            ChatTyping.conversation_id ==
            conversation_id,

            ChatTyping.user_id != user_id
        )
        .all()
    )

    return [
        ChatTypingResponse(
            user_id=
                record.user_id,

            is_typing=True
        )

        for record in typing_records
    ]


# ============================================================
# Send Text Message
# ============================================================

@router.post(
    "/conversations/{conversation_id}/messages",
    response_model=ChatMessageResponse
)
def send_message(
    conversation_id: int,
    message_data: ChatMessageCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    conversation = db.query(ChatConversation).filter(
        ChatConversation.conversation_id == conversation_id
    ).first()

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    participant = db.query(ChatParticipant).filter(
        ChatParticipant.conversation_id == conversation_id,
        ChatParticipant.user_id == user_id
    ).first()

    if not participant:

        user = db.query(User).filter(
            User.user_id == user_id
        ).first()

        if not user or user.role != "Admin":
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to send messages in this conversation"
            )

    message_text = message_data.message.strip()

    if not message_text:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty"
        )

    # ----------------------------------------------
    # Stop typing
    # ----------------------------------------------

    typing_record = (
        db.query(ChatTyping)
        .filter(
            ChatTyping.conversation_id ==
            conversation_id,

            ChatTyping.user_id ==
            user_id
        )
        .first()
    )

    if typing_record:

        db.delete(
            typing_record
        )

    # ----------------------------------------------
    # Create message
    # ----------------------------------------------

    new_message = ChatMessage(
        conversation_id=conversation_id,
        sender_id=user_id,
        message=message_text,
        message_type="TEXT",
        attachment_url=None,
        attachment_name=None,
        is_read=False
    )

    db.add(new_message)

    db.commit()
    db.refresh(new_message)

    conversation.updated_at = new_message.created_at

    db.commit()

    return new_message


# ============================================================
# Upload Attachment / Send Message With Attachment
# ============================================================

@router.post(
    "/conversations/{conversation_id}/messages/upload",
    response_model=ChatMessageResponse
)
async def upload_chat_attachment(
    conversation_id: int,
    file: UploadFile = File(...),
    message: str = Form(""),
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    # ----------------------------------------------
    # Check conversation
    # ----------------------------------------------

    conversation = db.query(ChatConversation).filter(
        ChatConversation.conversation_id ==
        conversation_id
    ).first()

    if not conversation:

        raise HTTPException(
            status_code=404,
            detail="Conversation not found"
        )

    # ----------------------------------------------
    # Check participant
    # ----------------------------------------------

    participant = (
        db.query(ChatParticipant)
        .filter(
            ChatParticipant.conversation_id ==
            conversation_id,

            ChatParticipant.user_id ==
            user_id
        )
        .first()
    )

    if not participant:

        user = db.query(User).filter(
            User.user_id == user_id
        ).first()

        if not user or user.role != "Admin":

            raise HTTPException(
                status_code=403,
                detail="You are not allowed to send messages in this conversation"
            )

    # ----------------------------------------------
    # Validate file
    # ----------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    # ----------------------------------------------
    # File size limit: 10 MB
    # ----------------------------------------------

    MAX_FILE_SIZE = 10 * 1024 * 1024

    file_content = await file.read()

    if len(file_content) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=400,
            detail="File size cannot exceed 10 MB"
        )

    # ----------------------------------------------
    # Generate safe unique filename
    # ----------------------------------------------

    original_filename = os.path.basename(
        file.filename
    )

    file_extension = os.path.splitext(
        original_filename
    )[1]

    unique_filename = (
        f"{uuid.uuid4().hex}"
        f"{file_extension}"
    )

    file_path = os.path.join(
        CHAT_UPLOAD_DIR,
        unique_filename
    )

    # ----------------------------------------------
    # Save file
    # ----------------------------------------------

    try:

        with open(
            file_path,
            "wb"
        ) as buffer:

            buffer.write(
                file_content
            )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save file: {str(e)}"
        )

    # ----------------------------------------------
    # Stop typing
    # ----------------------------------------------

    typing_record = (
        db.query(ChatTyping)
        .filter(
            ChatTyping.conversation_id ==
            conversation_id,

            ChatTyping.user_id ==
            user_id
        )
        .first()
    )

    if typing_record:

        db.delete(
            typing_record
        )

    # ----------------------------------------------
    # Prepare message
    # ----------------------------------------------

    message_text = message.strip()

    # ----------------------------------------------
    # Create attachment URL
    # ----------------------------------------------

    attachment_url = (
        f"/uploads/chat/{unique_filename}"
    )

    # ----------------------------------------------
    # Create database message
    # ----------------------------------------------

    new_message = ChatMessage(
        conversation_id=conversation_id,

        sender_id=user_id,

        message=message_text,

        message_type="FILE",

        attachment_url=attachment_url,

        attachment_name=original_filename,

        is_read=False
    )

    db.add(new_message)

    db.commit()
    db.refresh(new_message)

    conversation.updated_at = new_message.created_at

    db.commit()

    return new_message


# ============================================================
# Get Messages
# ============================================================

@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=list[ChatMessageResponse]
)
def get_messages(
    conversation_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user_id = current_user["user_id"]

    participant = (
        db.query(ChatParticipant)
        .filter(
            ChatParticipant.conversation_id ==
            conversation_id,

            ChatParticipant.user_id ==
            user_id
        )
        .first()
    )

    if not participant:

        raise HTTPException(
            status_code=403,
            detail="You are not a participant"
        )

    messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.conversation_id ==
            conversation_id
        )
        .order_by(
            ChatMessage.created_at.asc()
        )
        .all()
    )

    for message in messages:

        if message.sender_id != user_id:
            message.is_read = True

    participant.last_read_at = datetime.now()

    db.commit()

    return messages