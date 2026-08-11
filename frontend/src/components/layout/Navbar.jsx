import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { getUser } from "../../utils/auth";
import { getProfile } from "../../services/profileService";
import { getUnreadCount } from "../../services/notificationService";
import { globalSearch } from "../../services/searchService";
import ThemeToggle from "../theme/ThemeToggle";

export default function Navbar({
  onOpenSearch,
}) {
  const user = getUser();
const navigate = useNavigate();
const location = useLocation();

const [profile, setProfile] = useState(null);
const [notificationCount, setNotificationCount] = useState(0);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {

  loadUnreadCount();

  const interval = setInterval(() => {
    loadUnreadCount();
  }, 5000);

  return () => clearInterval(interval);

}, []);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setLoading(false);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await globalSearch(query);

        if (!cancelled) {
          setResults(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setResults([]);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setNotificationCount(count);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
  loadProfile();
}, []);

const loadProfile = async () => {
  try {
    const data = await getProfile();
    setProfile(data);
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
};

  const getRoleBadge = () => {
    switch (user?.role) {
      case "Admin":
        return "bg-red-100 text-red-700";

      case "Trader":
        return "bg-blue-100 text-blue-700";

      case "Logistics":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <header
  className="
  relative
  z-[999]
  h-20
  bg-white/90
  dark:bg-slate-900
  backdrop-blur-md
  border-b
  border-slate-200
  dark:border-slate-700
  flex
  items-center
  justify-between
  px-8
  shadow-sm
  transition-colors
  duration-300
"
>

      {/* Search */}

      <div
        className="relative w-[520px]"
        ref={searchRef}
      >

        <div
          className="
          flex
          items-center
          bg-slate-100
          dark:bg-slate-800
          hover:bg-slate-50
          dark:hover:bg-slate-700
          rounded-2xl
          px-5
          py-3
          shadow-sm
          transition-colors
          duration-300
          "
        >

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
  type="text"
  readOnly
  onClick={onOpenSearch}
  placeholder="Search anything... (Ctrl + K)"
  className="
    bg-transparent
    outline-none
    ml-3
    w-full
    cursor-pointer
    text-slate-700
    dark:text-white
    placeholder:text-slate-400
    dark:placeholder:text-slate-500
  "
/>


        </div>

        {(loading || (query.trim() && results.length > 0)) && (

          <div
            className="
absolute
left-0
top-full
mt-3
w-full
max-h-[420px]
overflow-y-auto
overflow-x-hidden
bg-white
dark:bg-slate-800
rounded-2xl
shadow-2xl
border
border-slate-200
dark:border-slate-700
z-50
transition-colors
duration-300
scroll-smooth
"
          >

            {loading && (

              <div className="p-5 text-slate-500 dark:text-slate-400">
                Searching...
              </div>

            )}

            {!loading &&
              results.length === 0 &&
              query.trim() && (

                <div className="p-5 text-slate-500 dark:text-slate-400">
                  No results found
                </div>

              )}

            {!loading &&
              results.map((item) => (

                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setLoading(false);

                    navigate(item.route);
                  }}
                  className="
                  w-full
                  text-left
                  px-5
                  py-4
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  border-b
                  border-slate-200
                  dark:border-slate-700
                  last:border-none
                  transition-colors
                  duration-300
                  "
                >

                  <div className="font-semibold text-slate-800 dark:text-white">
                    {item.title}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {item.subtitle}
                  </div>

                  <span className="inline-block mt-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {item.type}
                  </span>

                </button>

              ))}

          </div>

        )}

      </div>

          {/* Right Side */}

      <div className="flex items-center gap-6">

        {/* Theme Toggle */}

        <ThemeToggle />

        {/* Notifications */}

        <button
  onClick={() => navigate("/dashboard/notifications")}
  className={`
relative
p-3
rounded-xl
transition-all
duration-300

${
  location.pathname === "/dashboard/notifications"
    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
    : "hover:bg-slate-100 dark:hover:bg-slate-800"
}
`}
>
  <Bell
    size={22}
    className="text-slate-700 dark:text-slate-300"
  />

  {notificationCount > 0 && (
    <span
  className="
  absolute
  top-2
  right-2

  h-3
  w-3

  rounded-full

  bg-red-500

  ring-2
  ring-white
  dark:ring-slate-900

  animate-pulse
  "
/>
  )}
</button>

        {/* User Card */}

        <div
          className="
          flex
          items-center
          gap-3
          bg-slate-50
          dark:bg-slate-800
          rounded-2xl
          px-4
          py-2
          shadow-sm
          border
          border-slate-200
          dark:border-slate-700
          transition-colors
          duration-300
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
      h-11
      w-11
      rounded-full
      object-cover
      border-2
      border-blue-500
    "
  />
) : (
  <UserCircle2
    size={42}
    className="text-blue-600"
  />
)}

          <div>

            <p className="font-semibold text-slate-800 dark:text-white">
              {profile?.full_name ||
  user?.full_name ||
  user?.email?.split("@")[0]}
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile?.email || user?.email}
            </p>

            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge()}`}
            >
              {user?.role}
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}