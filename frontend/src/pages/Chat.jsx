import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import {
  MessageCircle,
  Send,
  Paperclip,
  X,
  Wifi,
  WifiOff,
  Bell,
  Check,
} from "lucide-react";

import { toast } from "react-toastify";

import { getUser } from "../utils/auth";

import {
  getConversations,
  getMessages,
  sendMessage,
  uploadChatAttachment,
  updateTypingStatus,
  getTypingStatus,
  updatePresence,
  getUserPresence,
} from "../services/chatService";

import PageHeader from "../components/ui/PageHeader";


export default function Chat() {

  const user = getUser();

  const [searchParams] =
    useSearchParams();

  const bookingIdFromUrl =
    Number(
      searchParams.get("booking")
    );


  // ============================================================
  // REFS
  // ============================================================

  const messagesContainerRef =
    useRef(null);

  const fileInputRef =
    useRef(null);

  const previousMessageIdsRef =
    useRef(new Set());

  const typingTimerRef =
    useRef(null);

  const typingSentRef =
    useRef(false);


  // ============================================================
  // STATE
  // ============================================================

  const [
    conversations,
    setConversations,
  ] = useState([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState(null);

  const [
    messages,
    setMessages,
  ] = useState([]);

  const [
    messageText,
    setMessageText,
  ] = useState("");

  const [
    loadingConversations,
    setLoadingConversations,
  ] = useState(true);

  const [
    loadingMessages,
    setLoadingMessages,
  ] = useState(false);

  const [
    sending,
    setSending,
  ] = useState(false);


  // ============================================================
  // NEW MESSAGE
  // ============================================================

  const [
    hasNewMessages,
    setHasNewMessages,
  ] = useState(false);


  // ============================================================
  // TYPING
  // ============================================================

  const [
    isTyping,
    setIsTyping,
  ] = useState(false);

  const [
    otherUserTyping,
    setOtherUserTyping,
  ] = useState(false);


  // ============================================================
  // ATTACHMENT
  // ============================================================

  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);


  // ============================================================
  // ONLINE / OFFLINE
  // ============================================================

  const [
    isOnline,
    setIsOnline,
  ] = useState(
    navigator.onLine
  );


  // ============================================================
  // REAL USER PRESENCE
  // ============================================================

  const [
    otherUserOnline,
    setOtherUserOnline,
  ] = useState(false);

  const [
    otherUserLastSeen,
    setOtherUserLastSeen,
  ] = useState(null);

  const [
    otherUserId,
    setOtherUserId,
  ] = useState(null);


  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(
    typeof Notification !==
      "undefined" &&
    Notification.permission ===
      "granted"
  );


  // ============================================================
  // SCROLL HELPERS
  // ============================================================

  const scrollToBottom = () => {

    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    requestAnimationFrame(() => {

      container.scrollTop =
        container.scrollHeight;

    });
  };


  const isNearBottom = () => {

    const container =
      messagesContainerRef.current;

    if (!container) {
      return true;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    return (
      distanceFromBottom < 120
    );
  };


  // ============================================================
  // BROWSER NOTIFICATIONS
  // ============================================================

  const enableNotifications =
    async () => {

      if (
        typeof Notification ===
        "undefined"
      ) {

        toast.info(
          "Browser notifications are not supported."
        );

        return;
      }

      try {

        const permission =
          await Notification.requestPermission();

        if (
          permission ===
          "granted"
        ) {

          setNotificationsEnabled(
            true
          );

          toast.success(
            "Chat notifications enabled."
          );

        } else {

          setNotificationsEnabled(
            false
          );

          toast.info(
            "Browser notifications are disabled."
          );

        }

      } catch (error) {

        console.error(
          "Notification permission error:",
          error
        );

      }

    };


  // ============================================================
  // NEW MESSAGE NOTIFICATION
  // ============================================================

  const notifyNewMessage = (
    message,
    conversation
  ) => {

    const preview =
      message?.message?.trim() ||
      (
        message?.attachment_name
          ? `📎 ${message.attachment_name}`
          : "New message"
      );


    toast.info(
      `${
        conversation?.title ||
        "Chat"
      }: ${preview}`,
      {
        autoClose: 4000,
      }
    );


    if (
      typeof Notification !==
        "undefined" &&
      Notification.permission ===
        "granted"
    ) {

      try {

        new Notification(
          conversation?.title ||
            "New Chat Message",
          {
            body: preview,
            icon: "/favicon.ico",
          }
        );

      } catch (error) {

        console.error(
          "Browser notification error:",
          error
        );

      }

    }

  };


  // ============================================================
  // LOAD CONVERSATIONS
  // ============================================================

  const fetchConversations =
    async () => {

      try {

        setLoadingConversations(
          true
        );


        const data =
          await getConversations();

        const conversationList =
          data || [];


        setConversations(
          conversationList
        );


        // ==================================================
        // SPECIFIC BOOKING FROM URL
        // ==================================================

        if (
          bookingIdFromUrl &&
          !Number.isNaN(
            bookingIdFromUrl
          )
        ) {

          const bookingConversation =
            conversationList.find(
              (conversation) =>
                Number(
                  conversation.booking_id
                ) ===
                Number(
                  bookingIdFromUrl
                )
            );


          if (
            bookingConversation
          ) {

            setSelectedConversation(
              bookingConversation
            );

            return;

          }


          setSelectedConversation(
            null
          );


          toast.error(
            `No chat conversation found for Booking #${bookingIdFromUrl}.`
          );

          return;

        }


        // ==================================================
        // NORMAL CHAT PAGE
        // ==================================================

        if (
          conversationList.length >
          0
        ) {

          setSelectedConversation(
            (current) => {

              if (current) {

                return (
                  conversationList.find(
                    (item) =>
                      item.conversation_id ===
                      current.conversation_id
                  ) ||
                  conversationList[0]
                );

              }

              return conversationList[0];

            }
          );

        } else {

          setSelectedConversation(
            null
          );

        }

      } catch (err) {

        console.error(err);

        setSelectedConversation(
          null
        );

        toast.error(
          err.response?.data?.detail ||
            "Failed to load conversations"
        );

      } finally {

        setLoadingConversations(
          false
        );

      }

    };


  // ============================================================
  // LOAD MESSAGES
  // ============================================================

  const fetchMessages = async (
    conversationId,
    options = {}
  ) => {

    if (!conversationId) {
      return;
    }


    const {
      showNotification = true,
    } = options;


    try {

      setLoadingMessages(
        true
      );


      const data =
        await getMessages(
          conversationId
        );


      const incomingMessages =
        data || [];


      const isFirstLoad =
        previousMessageIdsRef.current
          .size === 0;


      const newMessages =
        incomingMessages.filter(
          (message) =>
            !previousMessageIdsRef.current.has(
              message.message_id
            )
        );


      const receivedNewMessages =
        newMessages.filter(
          (message) =>
            Number(
              message.sender_id
            ) !==
            Number(
              user?.user_id
            )
        );


      const wasNearBottom =
        isNearBottom();


      previousMessageIdsRef.current =
        new Set(
          incomingMessages.map(
            (message) =>
              message.message_id
          )
        );


      setMessages(
        incomingMessages
      );


      // ========================================================
      // FIND OTHER CHAT USER
      // ========================================================

      const otherMessage =
        incomingMessages.find(
          (message) =>
            Number(
              message.sender_id
            ) !==
            Number(
              user?.user_id
            )
        );


      if (otherMessage) {

        setOtherUserId(
          Number(
            otherMessage.sender_id
          )
        );

      }


      // ========================================================
      // INCOMING MESSAGE
      // ========================================================

      if (
        !isFirstLoad &&
        receivedNewMessages.length >
          0
      ) {

        const latestIncomingMessage =
          receivedNewMessages[
            receivedNewMessages.length -
              1
          ];


        if (
          wasNearBottom
        ) {

          requestAnimationFrame(
            () => {
              scrollToBottom();
            }
          );

          setHasNewMessages(
            false
          );

        } else {

          setHasNewMessages(
            true
          );

        }


        if (
          showNotification
        ) {

          notifyNewMessage(
            latestIncomingMessage,
            selectedConversation
          );

        }

      }


      // ========================================================
      // REFRESH CONVERSATIONS
      // ========================================================

      const updatedConversations =
        await getConversations();


      setConversations(
        updatedConversations ||
          []
      );


      // ========================================================
      // TOTAL UNREAD COUNT
      // ========================================================

      const totalUnread =
        (
          updatedConversations ||
          []
        ).reduce(
          (
            total,
            conversation
          ) =>
            total +
            (
              Number(
                conversation.unread_count
              ) || 0
            ),
          0
        );


      window.dispatchEvent(
        new CustomEvent(
          "chat-unread-updated",
          {
            detail: {
              unreadCount:
                totalUnread,
            },
          }
        )
      );


    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to load messages"
      );

    } finally {

      setLoadingMessages(
        false
      );

    }

  };


  // ============================================================
  // TYPING STATUS
  // ============================================================

  const fetchTypingStatus =
    async (
      conversationId
    ) => {

      if (!conversationId) {
        return;
      }


      try {

        const data =
          await getTypingStatus(
            conversationId
          );


        const otherTyping =
          (
            data || []
          ).some(
            (item) =>
              Number(
                item.user_id
              ) !==
              Number(
                user?.user_id
              ) &&
              item.is_typing ===
                true
          );


        setOtherUserTyping(
          otherTyping
        );


      } catch (err) {

        console.error(
          "Typing status error:",
          err
        );

      }

    };
      // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {

    fetchConversations();

  }, [
    bookingIdFromUrl,
  ]);


  // ============================================================
  // UPDATE MY PRESENCE
  // ============================================================

  useEffect(() => {

    // Mark current user online
    updatePresence(true).catch(
      (err) => {

        console.error(
          "Failed to update online status:",
          err
        );

      }
    );


    // ----------------------------------------------------------
    // HEARTBEAT
    // ----------------------------------------------------------

    const heartbeat =
      setInterval(() => {

        updatePresence(true).catch(
          (err) => {

            console.error(
              "Presence heartbeat error:",
              err
            );

          }
        );

      }, 20000);


    // ----------------------------------------------------------
    // MARK OFFLINE WHEN LEAVING
    // ----------------------------------------------------------

    const handleBeforeUnload =
      () => {

        updatePresence(false).catch(
          () => {}
        );

      };


    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );


    // ----------------------------------------------------------
    // CLEANUP
    // ----------------------------------------------------------

    return () => {

      clearInterval(
        heartbeat
      );


      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );


      updatePresence(false).catch(
        () => {}
      );

    };

  }, []);


  // ============================================================
  // LOAD MESSAGES WHEN CONVERSATION CHANGES
  // ============================================================

  useEffect(() => {

    if (
      !selectedConversation
    ) {

      return;

    }


    setHasNewMessages(
      false
    );

    setOtherUserTyping(
      false
    );

    setOtherUserOnline(
      false
    );

    setOtherUserLastSeen(
      null
    );

    setOtherUserId(
      null
    );

    setMessageText(
      ""
    );

    setIsTyping(
      false
    );

    setSelectedFile(
      null
    );


    if (
      fileInputRef.current
    ) {

      fileInputRef.current.value =
        "";

    }


    typingSentRef.current =
      false;


    previousMessageIdsRef.current =
      new Set();


    fetchMessages(
      selectedConversation.conversation_id,
      {
        showNotification:
          false,
      }
    );


    updateTypingStatus(
      selectedConversation.conversation_id,
      false
    ).catch(() => {});


    if (
      typingTimerRef.current
    ) {

      clearTimeout(
        typingTimerRef.current
      );

    }

  }, [
    selectedConversation,
  ]);


  // ============================================================
  // MESSAGE POLLING
  // ============================================================

  useEffect(() => {

    if (
      !selectedConversation
    ) {

      return;

    }


    const conversationId =
      selectedConversation.conversation_id;


    const interval =
      setInterval(() => {

        fetchMessages(
          conversationId,
          {
            showNotification:
              true,
          }
        );

      }, 5000);


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    selectedConversation,
  ]);


  // ============================================================
  // TYPING POLLING
  // ============================================================

  useEffect(() => {

    if (
      !selectedConversation
    ) {

      return;

    }


    const conversationId =
      selectedConversation.conversation_id;


    fetchTypingStatus(
      conversationId
    );


    const interval =
      setInterval(() => {

        fetchTypingStatus(
          conversationId
        );

      }, 1000);


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    selectedConversation,
  ]);


  // ============================================================
  // OTHER USER PRESENCE POLLING
  // ============================================================

  useEffect(() => {

    if (!otherUserId) {

      return;

    }


    const fetchPresence =
      async () => {

        try {

          const data =
            await getUserPresence(
              otherUserId
            );


          setOtherUserOnline(
            data?.is_online === true
          );


          setOtherUserLastSeen(
            data?.last_seen || null
          );


        } catch (err) {

          console.error(
            "Presence status error:",
            err
          );

        }

      };


    // Initial check
    fetchPresence();


    // Check every 5 seconds
    const interval =
      setInterval(
        fetchPresence,
        5000
      );


    return () => {

      clearInterval(
        interval
      );

    };

  }, [
    otherUserId,
  ]);


  // ============================================================
  // ONLINE / OFFLINE - BROWSER CONNECTION
  // ============================================================

  useEffect(() => {

    const handleOnline =
      () => {

        setIsOnline(
          true
        );


        // Update backend presence
        updatePresence(
          true
        ).catch(
          (err) => {

            console.error(
              "Failed to update presence:",
              err
            );

          }
        );


        toast.success(
          "You are back online."
        );

      };


    const handleOffline =
      () => {

        setIsOnline(
          false
        );


        // Update backend presence
        updatePresence(
          false
        ).catch(
          () => {}
        );


        toast.warning(
          "You are offline. Chat updates may be delayed."
        );

      };


    window.addEventListener(
      "online",
      handleOnline
    );


    window.addEventListener(
      "offline",
      handleOffline
    );


    return () => {

      window.removeEventListener(
        "online",
        handleOnline
      );


      window.removeEventListener(
        "offline",
        handleOffline
      );

    };

  }, []);


  // ============================================================
  // CLEANUP TYPING
  // ============================================================

  useEffect(() => {

    return () => {

      if (
        typingTimerRef.current
      ) {

        clearTimeout(
          typingTimerRef.current
        );

      }


      if (
        selectedConversation
      ) {

        updateTypingStatus(
          selectedConversation.conversation_id,
          false
        ).catch(() => {});

      }

    };

  }, [
    selectedConversation,
  ]);


  // ============================================================
  // MESSAGE INPUT / TYPING
  // ============================================================

  const handleMessageChange =
    async (e) => {

      const value =
        e.target.value;


      setMessageText(
        value
      );


      if (
        !selectedConversation
      ) {

        return;

      }


      const conversationId =
        selectedConversation.conversation_id;


      if (
        value.trim().length >
        0
      ) {

        setIsTyping(
          true
        );


        if (
          !typingSentRef.current
        ) {

          typingSentRef.current =
            true;


          try {

            await updateTypingStatus(
              conversationId,
              true
            );

          } catch (err) {

            console.error(
              "Failed to update typing status:",
              err
            );

          }

        }


        if (
          typingTimerRef.current
        ) {

          clearTimeout(
            typingTimerRef.current
          );

        }


        typingTimerRef.current =
          setTimeout(
            async () => {

              setIsTyping(
                false
              );


              typingSentRef.current =
                false;


              try {

                await updateTypingStatus(
                  conversationId,
                  false
                );

              } catch (err) {

                console.error(
                  "Failed to stop typing status:",
                  err
                );

              }

            },
            1500
          );

      } else {

        setIsTyping(
          false
        );


        typingSentRef.current =
          false;


        if (
          typingTimerRef.current
        ) {

          clearTimeout(
            typingTimerRef.current
          );

        }


        try {

          await updateTypingStatus(
            conversationId,
            false
          );

        } catch (err) {

          console.error(
            "Failed to stop typing status:",
            err
          );

        }

      }

    };


  // ============================================================
  // FILE SELECTION
  // ============================================================

  const handleAttachmentClick =
    () => {

      fileInputRef.current?.click();

    };


  const handleFileSelect =
    (e) => {

      const file =
        e.target.files?.[0];


      if (!file) {

        return;

      }


      const maxSize =
        10 * 1024 * 1024;


      if (
        file.size >
        maxSize
      ) {

        toast.error(
          "File size must be 10 MB or less."
        );


        e.target.value =
          "";


        return;

      }


      setSelectedFile(
        file
      );


      toast.info(
        `${file.name} selected.`
      );

    };


  const removeSelectedFile =
    () => {

      setSelectedFile(
        null
      );


      if (
        fileInputRef.current
      ) {

        fileInputRef.current.value =
          "";

      }

    };


  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage =
    async () => {

      const trimmedMessage =
        messageText.trim();


      if (
        !trimmedMessage &&
        !selectedFile
      ) {

        return;

      }


      if (
        !selectedConversation
      ) {

        toast.error(
          "Please select a conversation"
        );

        return;

      }


      try {

        setSending(
          true
        );


        const conversationId =
          selectedConversation.conversation_id;


        // ------------------------------------------------------
        // STOP TYPING
        // ------------------------------------------------------

        setIsTyping(
          false
        );


        typingSentRef.current =
          false;


        if (
          typingTimerRef.current
        ) {

          clearTimeout(
            typingTimerRef.current
          );

        }


        try {

          await updateTypingStatus(
            conversationId,
            false
          );

        } catch (typingError) {

          console.error(
            "Failed to stop typing:",
            typingError
          );

        }


        // ------------------------------------------------------
        // FILE + OPTIONAL TEXT
        // ------------------------------------------------------

        if (
          selectedFile
        ) {

          await uploadChatAttachment(
            conversationId,
            selectedFile,
            trimmedMessage
          );


          toast.success(
            "Attachment sent successfully."
          );


        } else {

          // ----------------------------------------------------
          // NORMAL TEXT MESSAGE
          // ----------------------------------------------------

          await sendMessage(
            conversationId,
            trimmedMessage
          );

        }


        // ------------------------------------------------------
        // CLEAR INPUT
        // ------------------------------------------------------

        setMessageText(
          ""
        );


        setSelectedFile(
          null
        );


        if (
          fileInputRef.current
        ) {

          fileInputRef.current.value =
            "";

        }


        setHasNewMessages(
          false
        );


        // ------------------------------------------------------
        // REFRESH
        // ------------------------------------------------------

        await fetchMessages(
          conversationId,
          {
            showNotification:
              false,
          }
        );


        requestAnimationFrame(
          () => {

            scrollToBottom();

          }
        );


      } catch (err) {

        console.error(
          "Send message error:",
          err
        );


        toast.error(
          err.response?.data?.detail ||
            "Failed to send message"
        );

      } finally {

        setSending(
          false
        );

      }

    };


  // ============================================================
  // ENTER KEY
  // ============================================================

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        handleSendMessage();

      }

    };


  // ============================================================
  // DATE FORMAT
  // ============================================================

  const formatDate = (date) => {

  if (!date) {
    return "";
  }

  // Backend stores timestamps in UTC
  // but returns them without timezone information.
  // Explicitly treat timezone-less timestamps as UTC.
  let dateString = String(date);

  if (
    !dateString.endsWith("Z") &&
    !/[+-]\d{2}:\d{2}$/.test(dateString)
  ) {
    dateString += "Z";
  }

  const messageDate =
    new Date(dateString);

  if (Number.isNaN(messageDate.getTime())) {
    return "";
  }

  const now =
    new Date();

  const isToday =
    messageDate.toLocaleDateString() ===
    now.toLocaleDateString();

  if (isToday) {

    return messageDate.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );

  }

  return (
    messageDate.toLocaleDateString(
      [],
      {
        month: "short",
        day: "numeric",
      }
    ) +
    ", " +
    messageDate.toLocaleTimeString(
      [],
      {
        hour: "numeric",
        minute: "2-digit",
      }
    )
  );

};


  // ============================================================
  // LAST MESSAGE PREVIEW
  // ============================================================

  const formatLastMessage =
    (conversation) => {

      if (
        !conversation.last_message
      ) {

        return "No messages yet";

      }


      const message =
        conversation.last_message.trim();


      if (
        message.length <=
        38
      ) {

        return message;

      }


      return `${message.substring(
        0,
        38
      )}...`;

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="space-y-6">

      <PageHeader
        title="Chat"
        subtitle="Communicate with Traders and Logistics Providers."
      >

        <div className="flex items-center gap-3">

          {/* ==================================================
              MY CONNECTION STATUS
          ================================================== */}

          <div
            className={`
              flex
              items-center
              gap-2
              rounded-full
              px-3
              py-1.5
              text-xs
              font-semibold

              ${
                isOnline
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
              }
            `}
          >

            {isOnline ? (
              <Wifi
                size={14}
              />
            ) : (
              <WifiOff
                size={14}
              />
            )}

            {isOnline
              ? "Online"
              : "Offline"}

          </div>


          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <button
            type="button"
            onClick={
              enableNotifications
            }
            title={
              notificationsEnabled
                ? "Notifications enabled"
                : "Enable chat notifications"
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white
              text-slate-600
              transition
              hover:bg-slate-100
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-300
              dark:hover:bg-slate-800
            "
          >

            <Bell
              size={19}
              className={
                notificationsEnabled
                  ? "text-blue-600"
                  : ""
              }
            />

          </button>


          <MessageCircle
            size={34}
            className="text-blue-600"
          />

        </div>

      </PageHeader>


      {/* ==========================================================
          MAIN CHAT
      ========================================================== */}

      <div
        className="
          flex
          h-[calc(100vh-220px)]
          min-h-[600px]
          min-w-0
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          shadow-lg
        "
      >


        {/* ========================================================
            CONVERSATIONS
        ======================================================== */}

        <div
          className="
            w-full
            md:w-80
            lg:w-96
            flex-shrink-0
            min-h-0
            border-r
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-950
          "
        >

          <div
            className="
              border-b
              border-slate-200
              dark:border-slate-700
              px-5
              py-5
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  dark:bg-blue-900
                "
              >

                <MessageCircle
                  size={22}
                  className="
                    text-blue-600
                    dark:text-blue-300
                  "
                />

              </div>


              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-slate-800
                    dark:text-white
                  "
                >
                  Conversations
                </h2>

                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {conversations.length} conversation
                  {conversations.length !==
                  1
                    ? "s"
                    : ""}
                </p>

              </div>

            </div>

          </div>


          <div
            className="
              h-[calc(100%-89px)]
              overflow-y-auto
            "
          >

            {loadingConversations ? (

              <div
                className="
                  flex
                  min-h-[300px]
                  items-center
                  justify-center
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Loading conversations...
              </div>

            ) : conversations.length ===
              0 ? (

              <div
                className="
                  flex
                  min-h-[300px]
                  flex-col
                  items-center
                  justify-center
                  px-6
                  text-center
                "
              >

                <MessageCircle
                  size={50}
                  className="
                    text-slate-300
                    dark:text-slate-600
                  "
                />

                <p
                  className="
                    mt-4
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  No Conversations
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Your conversations will appear here.
                </p>

              </div>

            ) : (

              conversations.map(
                (
                  conversation
                ) => {

                  const isSelected =
                    selectedConversation?.conversation_id ===
                    conversation.conversation_id;


                  const unreadCount =
                    Number(
                      conversation.unread_count
                    ) || 0;


                  return (
                    <button
                      key={
                        conversation.conversation_id
                      }
                      onClick={() => {

                        setSelectedConversation(
                          conversation
                        );

                        setHasNewMessages(
                          false
                        );

                        setOtherUserTyping(
                          false
                        );

                      }}
                      className={`
                        w-full
                        border-b
                        border-slate-200
                        dark:border-slate-800
                        px-5
                        py-4
                        text-left
                        transition-all

                        ${
                          isSelected
                            ? "bg-blue-100 dark:bg-blue-950"
                            : "hover:bg-white dark:hover:bg-slate-900"
                        }
                      `}
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >

                        <div
                          className="
                            relative
                            flex
                            h-11
                            w-11
                            flex-shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-100
                            dark:bg-blue-900
                          "
                        >

                          <MessageCircle
                            size={20}
                            className="
                              text-blue-600
                              dark:text-blue-300
                            "
                          />


                          {unreadCount >
                            0 && (

                            <span
                              className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                h-5
                                min-w-5
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                px-1
                                text-[10px]
                                font-bold
                                text-white
                                shadow
                              "
                            >

                              {unreadCount >
                              99
                                ? "99+"
                                : unreadCount}

                            </span>

                          )}

                        </div>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >

                            <p
                              className={`
                                truncate
                                ${
                                  unreadCount >
                                  0
                                    ? "font-bold"
                                    : "font-semibold"
                                }
                                text-slate-800
                                dark:text-white
                              `}
                            >
                              {
                                conversation.title
                              }
                            </p>


                            {conversation.last_message_at && (

                              <span
                                className="
                                  flex-shrink-0
                                  text-[10px]
                                  text-slate-400
                                  dark:text-slate-500
                                "
                              >
                                {formatDate(
                                  conversation.last_message_at
                                )}
                              </span>

                            )}

                          </div>


                          <div
                            className="
                              mt-1
                              flex
                              items-center
                              justify-between
                              gap-2
                            "
                          >

                            <p
                              className={`
                                truncate
                                text-xs
                                ${
                                  unreadCount >
                                  0
                                    ? "font-semibold text-slate-700 dark:text-slate-200"
                                    : "text-slate-500 dark:text-slate-400"
                                }
                              `}
                            >
                              {formatLastMessage(
                                conversation
                              )}
                            </p>


                            {unreadCount >
                              0 && (

                              <span
                                className="
                                  flex-shrink-0
                                  text-[10px]
                                  font-semibold
                                  text-red-500
                                "
                              >
                                New
                              </span>

                            )}

                          </div>


                          <p
                            className="
                              mt-1
                              text-[11px]
                              text-slate-400
                              dark:text-slate-500
                            "
                          >
                            Booking #
                            {
                              conversation.booking_id
                            }
                          </p>

                        </div>

                      </div>

                    </button>
                  );
                }
              )

            )}

          </div>

        </div>


        {/* ========================================================
            MESSAGE AREA
        ======================================================== */}

        <div
          className="
            flex
            min-w-0
            min-h-0
            flex-1
            flex-col
          "
        >

          {!selectedConversation ? (

            <div
              className="
                flex
                min-h-0
                flex-1
                flex-col
                items-center
                justify-center
                text-center
              "
            >

              <MessageCircle
                size={64}
                className="
                  text-slate-300
                  dark:text-slate-600
                "
              />

              <h2
                className="
                  mt-5
                  text-xl
                  font-bold
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Select a conversation
              </h2>

              <p
                className="
                  mt-2
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Choose a conversation from the left.
              </p>

            </div>

          ) : (
                        <>
              {/* ======================================================
                  CHAT HEADER
              ====================================================== */}

              <div
                className="
                  flex-shrink-0
                  border-b
                  border-slate-200
                  dark:border-slate-700
                  px-6
                  py-5
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        relative
                        flex
                        h-11
                        w-11
                        flex-shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-100
                        dark:bg-blue-900
                      "
                    >

                      <MessageCircle
                        size={21}
                        className="
                          text-blue-600
                          dark:text-blue-300
                        "
                      />

                      {/* OTHER USER ONLINE DOT */}

                      {otherUserOnline && (
                        <span
                          className="
                            absolute
                            bottom-0
                            right-0
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-white
                            bg-emerald-500
                            dark:border-slate-900
                          "
                        />
                      )}

                    </div>


                    <div>

                      <h2
                        className="
                          font-bold
                          text-slate-800
                          dark:text-white
                        "
                      >
                        {
                          selectedConversation.title
                        }
                      </h2>


                      <div
                        className="
                          mt-1
                          flex
                          items-center
                          gap-2
                        "
                      >

                        <p
                          className="
                            text-sm
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          Booking #
                          {
                            selectedConversation.booking_id
                          }
                        </p>


                        <span
                          className="
                            text-slate-300
                            dark:text-slate-600
                          "
                        >
                          •
                        </span>


                        {/* ==================================================
                            REAL USER PRESENCE
                        ================================================== */}

                        <span
                          className="
                            flex
                            items-center
                            gap-1.5
                            text-xs
                            font-medium
                          "
                        >

                          <span
                            className={`
                              h-2
                              w-2
                              rounded-full

                              ${
                                otherUserOnline
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }
                            `}
                          />


                          {otherUserOnline ? (

                            <span
                              className="
                                text-emerald-600
                                dark:text-emerald-400
                              "
                            >
                              Online
                            </span>

                          ) : otherUserLastSeen ? (

                            <span
                              className="
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              Last seen{" "}
                              {formatDate(
                                otherUserLastSeen
                              )}
                            </span>

                          ) : (

                            <span
                              className="
                                text-slate-500
                                dark:text-slate-400
                              "
                            >
                              Offline
                            </span>

                          )}

                        </span>

                      </div>

                    </div>

                  </div>


                  {/* ==================================================
                      OTHER USER TYPING
                  ================================================== */}

                  {otherUserTyping && (

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                        text-blue-600
                        dark:text-blue-400
                      "
                    >

                      <span
                        className="
                          flex
                          gap-1
                        "
                      >

                        <span
                          className="
                            h-1.5
                            w-1.5
                            animate-bounce
                            rounded-full
                            bg-blue-500
                          "
                        />

                        <span
                          className="
                            h-1.5
                            w-1.5
                            animate-bounce
                            rounded-full
                            bg-blue-500
                            [animation-delay:150ms]
                          "
                        />

                        <span
                          className="
                            h-1.5
                            w-1.5
                            animate-bounce
                            rounded-full
                            bg-blue-500
                            [animation-delay:300ms]
                          "
                        />

                      </span>

                      Typing...

                    </div>

                  )}

                </div>

              </div>


              {/* ======================================================
                  MESSAGES
              ====================================================== */}

              <div
                ref={
                  messagesContainerRef
                }
                className="
                  relative
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  bg-slate-50
                  dark:bg-slate-950
                  px-5
                  py-6
                "
              >

                {/* ==================================================
                    NEW MESSAGE BUTTON
                ================================================== */}

                {hasNewMessages && (

                  <button
                    type="button"
                    onClick={() => {

                      scrollToBottom();

                      setHasNewMessages(
                        false
                      );

                    }}
                    className="
                      sticky
                      top-3
                      z-20
                      mx-auto
                      mb-3
                      flex
                      items-center
                      gap-2
                      rounded-full
                      bg-blue-600
                      px-4
                      py-2
                      text-xs
                      font-semibold
                      text-white
                      shadow-lg
                      transition
                      hover:bg-blue-700
                    "
                  >

                    ↓ New message

                  </button>

                )}


                {/* ==================================================
                    LOADING
                ================================================== */}

                {loadingMessages &&
                messages.length === 0 ? (

                  <div
                    className="
                      flex
                      h-full
                      items-center
                      justify-center
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    Loading messages...
                  </div>

                ) : messages.length === 0 ? (

                  <div
                    className="
                      flex
                      h-full
                      flex-col
                      items-center
                      justify-center
                      text-center
                    "
                  >

                    <MessageCircle
                      size={50}
                      className="
                        text-slate-300
                        dark:text-slate-600
                      "
                    />

                    <p
                      className="
                        mt-4
                        font-semibold
                        text-slate-600
                        dark:text-slate-300
                      "
                    >
                      No messages yet
                    </p>

                    <p
                      className="
                        mt-1
                        text-sm
                        text-slate-500
                        dark:text-slate-400
                      "
                    >
                      Start the conversation.
                    </p>

                  </div>

                ) : (

                  <div
                    className="
                      space-y-4
                    "
                  >

                    {messages.map(
                      (message) => {

                        const isMine =
                          Number(
                            message.sender_id
                          ) ===
                          Number(
                            user?.user_id
                          );


                        const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

const attachmentUrl =
  message.attachment_url
    ? message.attachment_url.startsWith("http")
      ? message.attachment_url
      : `${API_BASE_URL}${message.attachment_url}`
    : null;


                        return (

                          <div
                            key={
                              message.message_id
                            }
                            className={`
                              flex
                              ${
                                isMine
                                  ? "justify-end"
                                  : "justify-start"
                              }
                            `}
                          >

                            <div
                              className={`
                                max-w-[75%]
                                rounded-2xl
                                px-4
                                py-3
                                shadow-sm

                                ${
                                  isMine
                                    ? `
                                      rounded-br-md
                                      bg-blue-600
                                      text-white
                                    `
                                    : `
                                      rounded-bl-md
                                      bg-white
                                      dark:bg-slate-800
                                      text-slate-800
                                      dark:text-slate-100
                                    `
                                }
                              `}
                            >

                              {/* ==================================================
                                  ATTACHMENT
                              ================================================== */}

                              {message.attachment_name &&
                              attachmentUrl && (

                                <a
                                  href={
                                    attachmentUrl
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`
                                    mb-2
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    px-3
                                    py-3
                                    text-xs
                                    transition

                                    ${
                                      isMine
                                        ? "bg-blue-500 hover:bg-blue-400"
                                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                                    }
                                  `}
                                >

                                  <div
                                    className="
                                      flex
                                      h-9
                                      w-9
                                      flex-shrink-0
                                      items-center
                                      justify-center
                                      rounded-lg
                                      bg-white/20
                                    "
                                  >

                                    <Paperclip
                                      size={17}
                                    />

                                  </div>


                                  <div
                                    className="
                                      min-w-0
                                      flex-1
                                    "
                                  >

                                    <p
                                      className="
                                        truncate
                                        font-semibold
                                      "
                                    >
                                      {
                                        message.attachment_name
                                      }
                                    </p>

                                    <p
                                      className={`
                                        mt-0.5
                                        text-[10px]

                                        ${
                                          isMine
                                            ? "text-blue-100"
                                            : "text-slate-400 dark:text-slate-400"
                                        }
                                      `}
                                    >
                                      Click to open
                                    </p>

                                  </div>


                                  <span
                                    className="
                                      flex-shrink-0
                                      text-sm
                                    "
                                  >
                                    ↗
                                  </span>

                                </a>

                              )}


                              {/* ==================================================
                                  MESSAGE TEXT
                              ================================================== */}

                              {message.message && (

                                <p
                                  className="
                                    whitespace-pre-wrap
                                    break-words
                                    text-sm
                                    leading-6
                                  "
                                >
                                  {
                                    message.message
                                  }
                                </p>

                              )}


                              {/* ==================================================
                                  TIME
                              ================================================== */}

                              <div
                                className="
                                  mt-1
                                  flex
                                  items-center
                                  justify-end
                                  gap-1
                                "
                              >

                                <p
                                  className={`
                                    text-[10px]

                                    ${
                                      isMine
                                        ? "text-blue-100"
                                        : "text-slate-400 dark:text-slate-500"
                                    }
                                  `}
                                >
                                  {formatDate(
                                    message.created_at
                                  )}
                                </p>


                                {isMine && (

                                  <Check
                                    size={12}
                                    className="
                                      text-blue-100
                                    "
                                  />

                                )}

                              </div>

                            </div>

                          </div>

                        );

                      }
                    )}

                  </div>

                )}

              </div>


              {/* ======================================================
                  MESSAGE INPUT
              ====================================================== */}

              <div
                className="
                  flex-shrink-0
                  border-t
                  border-slate-200
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-900
                  p-4
                "
              >

                {/* ==================================================
                    SELECTED FILE PREVIEW
                ================================================== */}

                {selectedFile && (

                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      justify-between
                      rounded-xl
                      border
                      border-blue-200
                      bg-blue-50
                      px-3
                      py-2
                      dark:border-blue-900
                      dark:bg-blue-950
                    "
                  >

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-2
                      "
                    >

                      <Paperclip
                        size={16}
                        className="
                          flex-shrink-0
                          text-blue-600
                        "
                      />

                      <div
                        className="
                          min-w-0
                        "
                      >

                        <p
                          className="
                            truncate
                            text-xs
                            font-semibold
                            text-slate-700
                            dark:text-slate-200
                          "
                        >
                          {
                            selectedFile.name
                          }
                        </p>

                        <p
                          className="
                            text-[10px]
                            text-slate-500
                            dark:text-slate-400
                          "
                        >
                          {(
                            selectedFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={
                        removeSelectedFile
                      }
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-500
                        hover:bg-white
                        hover:text-red-500
                        dark:hover:bg-slate-800
                      "
                    >

                      <X
                        size={15}
                      />

                    </button>

                  </div>

                )}


                {/* ==================================================
                    LOCAL TYPING
                ================================================== */}

                {isTyping && (

                  <div
                    className="
                      mb-2
                      px-1
                      text-[11px]
                      font-medium
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    You are typing...
                  </div>

                )}


                {/* ==================================================
                    INPUT ROW
                ================================================== */}

                <div
                  className="
                    flex
                    items-end
                    gap-2
                  "
                >

                  {/* FILE INPUT */}

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    className="hidden"
                    onChange={
                      handleFileSelect
                    }
                  />


                  {/* ATTACHMENT BUTTON */}

                  <button
                    type="button"
                    onClick={
                      handleAttachmentClick
                    }
                    disabled={
                      sending ||
                      !isOnline
                    }
                    title="Attach file"
                    className="
                      flex
                      h-12
                      w-12
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-slate-300
                      bg-slate-50
                      text-slate-600
                      transition
                      hover:bg-slate-100
                      hover:text-blue-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:border-slate-600
                      dark:bg-slate-800
                      dark:text-slate-300
                      dark:hover:bg-slate-700
                    "
                  >

                    <Paperclip
                      size={19}
                    />

                  </button>


                  {/* TEXT INPUT */}

                  <textarea
                    value={
                      messageText
                    }
                    onChange={
                      handleMessageChange
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    placeholder={
                      isOnline
                        ? "Type your message..."
                        : "You are offline..."
                    }
                    rows={1}
                    disabled={
                      !isOnline ||
                      sending
                    }
                    className="
                      min-h-[48px]
                      max-h-32
                      flex-1
                      resize-none
                      rounded-2xl
                      border
                      border-slate-300
                      dark:border-slate-600
                      bg-slate-50
                      dark:bg-slate-800
                      px-4
                      py-3
                      text-sm
                      text-slate-800
                      dark:text-white
                      placeholder:text-slate-400
                      dark:placeholder:text-slate-500
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />


                  {/* SEND BUTTON */}

                  <button
                    type="button"
                    onClick={
                      handleSendMessage
                    }
                    disabled={
                      sending ||
                      !isOnline ||
                      (
                        !messageText.trim() &&
                        !selectedFile
                      )
                    }
                    className="
                      flex
                      h-12
                      w-12
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-600
                      text-white
                      shadow
                      transition
                      hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >

                    <Send
                      size={19}
                    />

                  </button>

                </div>


                {/* ==================================================
                    INPUT FOOTER
                ================================================== */}

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-3
                    px-1
                  "
                >

                  <p
                    className="
                      text-[11px]
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Press Enter to send •
                    Shift + Enter for a new line
                  </p>


                  <p
                    className="
                      flex-shrink-0
                      text-[10px]
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    Max file: 10 MB
                  </p>

                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}