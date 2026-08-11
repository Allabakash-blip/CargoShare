import {
  LayoutDashboard,
  Package,
  Truck,
  MapPinned,
  CreditCard,
  Bell,
  LogOut,
  Building2,
  BarChart3,
  History,
  Users,
  UserCircle,
  TruckIcon,
  Menu,
  PanelLeftClose,
  MessageCircle,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";

import { removeToken, getUser } from "../../utils/auth";
import { getProfile } from "../../services/profileService";

import {
  getConversations,
  updatePresence,
} from "../../services/chatService";


export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {

  const navigate = useNavigate();

  const user = getUser();
  const role = user?.role || "";

  const [profile, setProfile] = useState(null);
  const [chatUnreadCount, setChatUnreadCount] = useState(0);


  // ============================================================
  // MOBILE LABEL CONTROL
  // ============================================================

  // On mobile, always show the complete menu even if the
  // desktop sidebar was previously collapsed.

  const showLabels =
    mobileMenuOpen || !collapsed;


  // ============================================================
  // LOAD PROFILE + CHAT UNREAD COUNT
  // ============================================================

  useEffect(() => {

    loadProfile();
    loadChatUnreadCount();


    // Receive exact unread count from Chat page

    const handleChatUnreadUpdated = (event) => {

      const count =
        Number(
          event.detail?.unreadCount
        ) || 0;

      setChatUnreadCount(count);

    };


    window.addEventListener(
      "chat-unread-updated",
      handleChatUnreadUpdated
    );


    // Periodically check for new incoming messages

    const interval =
      setInterval(() => {

        loadChatUnreadCount();

      }, 10000);


    return () => {

      window.removeEventListener(
        "chat-unread-updated",
        handleChatUnreadUpdated
      );

      clearInterval(interval);

    };

  }, []);


  // ============================================================
  // LOAD PROFILE
  // ============================================================

  const loadProfile = async () => {

    try {

      const data =
        await getProfile();

      setProfile(data);

    } catch (err) {

      console.error(
        "Failed to load profile:",
        err
      );

    }

  };


  // ============================================================
  // LOAD CHAT UNREAD COUNT
  // ============================================================

  const loadChatUnreadCount = async () => {

    try {

      const conversations =
        await getConversations();

      const totalUnread =
        (conversations || []).reduce(
          (total, conversation) =>
            total +
            (
              Number(
                conversation.unread_count
              ) || 0
            ),
          0
        );

      setChatUnreadCount(
        totalUnread
      );

    } catch (err) {

      console.error(
        "Failed to load chat unread count:",
        err
      );

    }

  };


  // ============================================================
  // ROLE BASED MENU
  // ============================================================

  let menu = [];


  // ============================================================
  // ADMIN
  // ============================================================

  if (role === "Admin") {

    menu = [

      {
        icon: LayoutDashboard,
        title: "Dashboard",
        path: "/dashboard",
      },

      {
        icon: BarChart3,
        title: "Analytics",
        path: "/dashboard/analytics",
      },

      {
        icon: History,
        title: "Activity Logs",
        path: "/dashboard/activity-logs",
      },

      {
        icon: Users,
        title: "Users",
        path: "/dashboard/users",
      },

      {
        icon: Package,
        title: "Bookings",
        path: "/dashboard/bookings",
      },

      {
        icon: Building2,
        title: "Logistics",
        path: "/dashboard/logistics",
      },

      {
        icon: Truck,
        title: "Containers",
        path: "/dashboard/containers",
      },

      {
        icon: MapPinned,
        title: "Tracking",
        path: "/dashboard/tracking",
      },

      {
        icon: CreditCard,
        title: "Payments",
        path: "/dashboard/payments",
      },

      {
        icon: Bell,
        title: "Notifications",
        path: "/dashboard/notifications",
      },

      {
        icon: UserCircle,
        title: "My Profile",
        path: "/dashboard/profile",
      },

    ];

  }


  // ============================================================
  // TRADER
  // ============================================================

  else if (role === "Trader") {

    menu = [

      {
        icon: LayoutDashboard,
        title: "Dashboard",
        path: "/dashboard",
      },

      {
        icon: BarChart3,
        title: "Analytics",
        path: "/dashboard/analytics",
      },

      {
        icon: Package,
        title: "Bookings",
        path: "/dashboard/bookings",
      },

      {
        icon: MapPinned,
        title: "Tracking",
        path: "/dashboard/tracking",
      },

      {
        icon: CreditCard,
        title: "Payments",
        path: "/dashboard/payments",
      },

      {
        icon: Bell,
        title: "Notifications",
        path: "/dashboard/notifications",
      },

      {
        icon: MessageCircle,
        title: "Chat",
        path: "/dashboard/chat",
      },

      {
        icon: UserCircle,
        title: "My Profile",
        path: "/dashboard/profile",
      },

    ];

  }


  // ============================================================
  // LOGISTICS
  // ============================================================

  else if (role === "Logistics") {

    menu = [

      {
        icon: LayoutDashboard,
        title: "Dashboard",
        path: "/dashboard",
      },

      {
        icon: BarChart3,
        title: "Analytics",
        path: "/dashboard/analytics",
      },

      {
        icon: Building2,
        title: "Logistics",
        path: "/dashboard/logistics",
      },

      {
        icon: Truck,
        title: "Containers",
        path: "/dashboard/containers",
      },

      {
        icon: MapPinned,
        title: "Tracking",
        path: "/dashboard/tracking",
      },

      {
        icon: Bell,
        title: "Notifications",
        path: "/dashboard/notifications",
      },

      {
        icon: MessageCircle,
        title: "Chat",
        path: "/dashboard/chat",
      },

      {
        icon: UserCircle,
        title: "My Profile",
        path: "/dashboard/profile",
      },

    ];

  }


  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {

    try {

      // Mark current user offline
      await updatePresence(false);

    } catch (err) {

      console.error(
        "Failed to update presence during logout:",
        err
      );

    } finally {

      // Always logout even if presence update fails
      removeToken();

      navigate("/login");

    }

  };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <aside
  className={`
    fixed
    top-2
    bottom-2
    left-2
    z-[100]

    h-[calc(100dvh-16px)]
    max-h-[calc(100dvh-16px)]

    w-[280px]

    ${
      collapsed
        ? "md:w-24"
        : "md:w-72"
    }

    ${
      mobileMenuOpen
        ? "translate-x-0"
        : "-translate-x-[calc(100%+16px)]"
    }

    md:translate-x-0
    md:static
    md:h-full
    md:max-h-none

    transition-all
    duration-300

    rounded-[28px]

    bg-white/80
    dark:bg-slate-950/80

    backdrop-blur-2xl

    border
    border-slate-200/60
    dark:border-slate-700/50

    shadow-2xl

    overflow-y-auto
    overflow-x-hidden

    overscroll-contain

    flex
    flex-col

    min-h-0
  `}
>

      {/* ======================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          absolute
          -top-20
          -left-20
          h-72
          w-72
          rounded-full
          bg-blue-500/15
          blur-[120px]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          -right-24
          h-64
          w-64
          rounded-full
          bg-cyan-500/10
          blur-[120px]
          pointer-events-none
        "
      />


      {/* ======================================================
          LOGO / HEADER
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          items-center
          justify-between

          px-5
          py-5

          border-b
          border-slate-200
          dark:border-slate-700

          flex-shrink-0
        "
      >

        {/* --------------------------------------------------
            LEFT SIDE - LOGO
        -------------------------------------------------- */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              h-12
              w-12
              rounded-xl

              bg-gradient-to-br
              from-blue-600
              to-cyan-500

              flex
              items-center
              justify-center

              shadow-lg
              shadow-blue-500/30

              shrink-0
            "
          >

            <TruckIcon
              size={24}
              className="text-white"
            />

          </div>


          {showLabels && (

            <div
              className="
                leading-tight
                min-w-0
              "
            >

              <h1
                className="
                  text-[20px]
                  font-extrabold
                  text-slate-900
                  dark:text-white
                "
              >
                CargoShare
              </h1>

              <p
                className="
                  text-xs
                  text-slate-500
                  dark:text-slate-400
                  whitespace-nowrap
                "
              >
                Logistics Management
              </p>

            </div>

          )}

        </div>


        {/* --------------------------------------------------
            DESKTOP COLLAPSE BUTTON
        -------------------------------------------------- */}

        {!collapsed && (

          <button
            type="button"
            onClick={() =>
              setCollapsed(true)
            }
            className="
              hidden
              md:flex

              h-9
              w-9

              rounded-xl

              items-center
              justify-center

              bg-slate-100
              dark:bg-slate-800

              hover:bg-blue-100
              dark:hover:bg-slate-700

              transition-all
              duration-300

              flex-shrink-0
            "
            aria-label="Collapse sidebar"
          >

            <PanelLeftClose
              size={18}
            />

          </button>

        )}


        {/* --------------------------------------------------
            MOBILE CLOSE BUTTON
        -------------------------------------------------- */}

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen?.(false)
          }
          className="
            flex
            md:hidden

            h-9
            w-9

            rounded-xl

            items-center
            justify-center

            bg-slate-100
            dark:bg-slate-800

            hover:bg-blue-100
            dark:hover:bg-slate-700

            text-slate-700
            dark:text-slate-200

            transition-all
            duration-300

            flex-shrink-0
          "
          aria-label="Close navigation menu"
        >

          <X
            size={19}
          />

        </button>

      </div>


      {/* ======================================================
          DESKTOP COLLAPSED MENU BUTTON
      ====================================================== */}

      {collapsed && (

        <div
          className="
            hidden
            md:flex

            justify-center
            py-4

            flex-shrink-0
          "
        >

          <button
            type="button"
            onClick={() =>
              setCollapsed(false)
            }
            className="
              h-10
              w-10

              rounded-xl

              bg-slate-100
              dark:bg-slate-800

              hover:bg-blue-100
              dark:hover:bg-slate-700

              flex
              items-center
              justify-center

              transition-all
              duration-300
            "
            aria-label="Expand sidebar"
          >

            <Menu
              size={18}
            />

          </button>

        </div>

      )}


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <div
  className="
    sticky
    bottom-0

    relative
    z-20

    px-4
    pt-2
    pb-4

    flex-shrink-0

    bg-slate-950/95
    dark:bg-slate-950/95

    backdrop-blur-xl
  "
>

        {menu.map(
          ({
            icon: Icon,
            title,
            path,
          }) => (

            <NavLink
              key={title}
              to={path}
              end={
                title === "Dashboard"
              }
              title={
                collapsed &&
                !mobileMenuOpen
                  ? title
                  : ""
              }
              onClick={() => {

                // Close mobile sidebar
                setMobileMenuOpen?.(
                  false
                );

              }}
            >

              {({ isActive }) => (

                <div
                  className={`
                    group
                    relative

                    flex
                    items-center

                    ${
                      showLabels
                        ? "gap-4"
                        : "justify-center"
                    }

                    px-5
                    py-3.5

                    rounded-2xl

                    cursor-pointer
                    overflow-hidden

                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-blue-600
                          via-indigo-600
                          to-cyan-500

                          text-white

                          shadow-lg
                          shadow-blue-500/30

                          translate-x-1
                        `
                        : `
                          text-slate-600
                          dark:text-slate-300

                          hover:bg-slate-100
                          dark:hover:bg-slate-800

                          hover:text-blue-600
                          dark:hover:text-white

                          hover:translate-x-1
                        `
                    }
                  `}
                >

                  {/* ICON */}

                  <Icon
                    size={20}
                    className="flex-shrink-0"
                  />


                  {/* TITLE */}

                  {showLabels && (

                    <span
                      className="
                        flex-1
                        whitespace-nowrap
                      "
                    >
                      {title}
                    </span>

                  )}


                  {/* ==================================================
                      CHAT UNREAD BADGE
                  ================================================== */}

                  {title === "Chat" &&
                    chatUnreadCount > 0 && (

                      <span
                        className={`
                          flex
                          items-center
                          justify-center

                          min-w-[20px]
                          h-5

                          rounded-full

                          bg-red-500
                          text-white

                          text-[10px]
                          font-bold

                          px-1

                          shadow-lg
                          shadow-red-500/30

                          ${
                            !showLabels
                              ? "absolute -right-1 -top-1"
                              : ""
                          }
                        `}
                      >

                        {chatUnreadCount >
                        99
                          ? "99+"
                          : chatUnreadCount}

                      </span>

                    )}

                </div>

              )}

            </NavLink>

          )
        )}

      </div>


      {/* ======================================================
          USER CARD
      ====================================================== */}

      <div
        className="
          relative
          z-10

          px-4
          pb-4

          flex-shrink-0

          transition-all
          duration-300
        "
      >

        <div
          className={`
            rounded-3xl

            bg-white/70
            dark:bg-slate-900/70

            backdrop-blur-xl

            border
            border-slate-200
            dark:border-slate-700

            shadow-lg

            transition-all
            duration-300

            ${
              showLabels
                ? "p-5"
                : "p-3 flex justify-center"
            }
          `}
        >

          {!showLabels ? (

            profile?.profile_picture ? (

              <img
                src={`http://127.0.0.1:8000/${profile.profile_picture.replace(
                  /\\/g,
                  "/"
                )}`}
                alt="Profile"
                className="
                  h-10
                  w-10

                  rounded-full

                  object-cover

                  border-2
                  border-blue-500
                "
              />

            ) : (

              <UserCircle
                size={34}
                className="text-blue-600"
              />

            )

          ) : (

            <>

              {/* ------------------------------------------------
                  PROFILE INFORMATION
              ------------------------------------------------ */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    h-12
                    w-12

                    rounded-2xl

                    overflow-hidden

                    flex
                    items-center
                    justify-center

                    bg-gradient-to-br
                    from-blue-600
                    to-cyan-500

                    flex-shrink-0
                  "
                >

                  {profile?.profile_picture ? (

                    <img
                      src={`http://127.0.0.1:8000/${profile.profile_picture.replace(
                        /\\/g,
                        "/"
                      )}`}
                      alt="Profile"
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  ) : (

                    <UserCircle
                      size={30}
                      className="text-white"
                    />

                  )}

                </div>


                <div
                  className="
                    min-w-0
                  "
                >

                  <p
                    className="
                      truncate

                      font-bold

                      text-slate-900
                      dark:text-white
                    "
                  >
                    {
                      profile?.full_name ||
                      user?.full_name ||
                      user?.email?.split("@")[0]
                    }
                  </p>

                  <p
                    className="
                      text-sm

                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {role}
                  </p>

                </div>

              </div>


              {/* ------------------------------------------------
                  ONLINE STATUS
              ------------------------------------------------ */}

              <div
                className="
                  mt-3

                  flex
                  items-center
                  gap-2
                "
              >

                <div
                  className="
                    h-2.5
                    w-2.5

                    rounded-full

                    bg-green-500

                    animate-pulse
                  "
                />

                <span
                  className="
                    text-sm

                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Online
                </span>

              </div>

            </>

          )}

        </div>

      </div>


      {/* ======================================================
          LOGOUT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          px-4
          pb-6

          flex-shrink-0
        "
      >

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className={`
            w-full

            flex
            items-center
            justify-center

            ${
              showLabels
                ? "gap-3"
                : "px-0"
            }

            py-3.5

            rounded-2xl

            font-semibold

            bg-gradient-to-r
            from-red-500
            to-red-600

            text-white

            shadow-lg
            shadow-red-500/20

            hover:shadow-red-500/40
            hover:-translate-y-0.5

            transition-all
            duration-300
          `}
        >

          <LogOut
            size={20}
          />

          {showLabels && (
            "Logout"
          )}

        </button>

      </div>

    </aside>

  );
}