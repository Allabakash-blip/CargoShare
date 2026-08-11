import api from "../api/axios";


// ============================================================
// Get All Conversations
// ============================================================

export const getConversations = async () => {
  const response = await api.get(
    "/chat/conversations"
  );

  return response.data;
};


// ============================================================
// Get Single Conversation
// ============================================================

export const getConversation = async (
  conversationId
) => {
  const response = await api.get(
    `/chat/conversations/${conversationId}`
  );

  return response.data;
};


// ============================================================
// Create Conversation
// ============================================================

export const createConversation = async (
  data
) => {
  const response = await api.post(
    "/chat/conversations",
    data
  );

  return response.data;
};


// ============================================================
// Get Messages
// ============================================================

export const getMessages = async (
  conversationId
) => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/messages`
  );

  return response.data;
};


// ============================================================
// Send Text Message
// ============================================================

export const sendMessage = async (
  conversationId,
  message
) => {
  const response = await api.post(
    `/chat/conversations/${conversationId}/messages`,
    {
      message,
    }
  );

  return response.data;
};


// ============================================================
// Upload Attachment + Optional Message
// ============================================================

export const uploadChatAttachment = async (
  conversationId,
  file,
  message = ""
) => {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  formData.append(
    "message",
    message
  );

  const response = await api.post(
    `/chat/conversations/${conversationId}/messages/upload`,
    formData
  );

  return response.data;
};


// ============================================================
// Update Typing Status
// ============================================================

export const updateTypingStatus = async (
  conversationId,
  isTyping
) => {
  const response = await api.post(
    `/chat/conversations/${conversationId}/typing`,
    {
      is_typing: isTyping,
    }
  );

  return response.data;
};


// ============================================================
// Get Typing Status
// ============================================================

export const getTypingStatus = async (
  conversationId
) => {
  const response = await api.get(
    `/chat/conversations/${conversationId}/typing`
  );

  return response.data;
};

// ============================================================
// CHAT PRESENCE
// ============================================================

export const updatePresence = async (isOnline) => {
  const response = await api.post(
    `/chat/presence/status?is_online=${isOnline}`
  );

  return response.data;
};


export const getUserPresence = async (userId) => {
  const response = await api.get(
    `/chat/presence/${userId}`
  );

  return response.data;
};