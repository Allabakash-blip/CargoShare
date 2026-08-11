from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# Create Conversation
# ============================================================

class ChatConversationCreate(BaseModel):
    booking_id: Optional[int] = None
    conversation_type: str = "BOOKING"
    title: Optional[str] = None


# ============================================================
# Conversation Response
# ============================================================

class ChatConversationResponse(BaseModel):
    conversation_id: int
    booking_id: Optional[int]
    conversation_type: str
    title: Optional[str]
    status: str
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    # Latest message information
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None

    # Number of unread messages for current user
    unread_count: int = 0

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# Send Message
# ============================================================

class ChatMessageCreate(BaseModel):
    message: str


# ============================================================
# Message Response
# ============================================================

class ChatMessageResponse(BaseModel):
    message_id: int
    conversation_id: int
    sender_id: int
    message: str
    message_type: str
    attachment_url: Optional[str]
    attachment_name: Optional[str]
    is_read: bool
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# Participant Response
# ============================================================

class ChatParticipantResponse(BaseModel):
    participant_id: int
    conversation_id: int
    user_id: int
    joined_at: Optional[datetime]
    last_read_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# Typing Status Request
# ============================================================

class ChatTypingRequest(BaseModel):
    is_typing: bool = False


# ============================================================
# Typing Status Response
# ============================================================

class ChatTypingResponse(BaseModel):
    user_id: int
    is_typing: bool