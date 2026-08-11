import { useEffect, useRef, useState } from "react";
import {
  Search,
  Package,
  Truck,
  CreditCard,
  MapPinned,
  Building2,
  Users,
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "../../services/searchService";

export default function CommandPalette({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const inputRef = useRef(null);

  const [query, setQuery] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  // Focus input whenever palette opens
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timer);

  }, [isOpen]);

  // Reset palette whenever closed
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setLoading(false);
    }
  }, [isOpen]);

  // Search
  useEffect(() => {

    if (!isOpen) return;

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
          setSelectedIndex(0);
        }

      } catch (err) {

        console.error(err);

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };

  }, [query, isOpen]);
    // Keyboard navigation
  useEffect(() => {

    if (!isOpen) return;

    const handleKeyDown = (e) => {

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          Math.min(prev + 1, results.length - 1)
        );

        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();

        setSelectedIndex((prev) =>
          Math.max(prev - 1, 0)
        );

        return;
      }

      if (e.key === "Enter") {

        if (results[selectedIndex]) {

          navigate(results[selectedIndex].route);

          onClose();

        }

      }

    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

  }, [
    isOpen,
    results,
    selectedIndex,
    navigate,
    onClose,
  ]);

  const getIcon = (type) => {

    switch (type) {

      case "Booking":
        return <Package size={18} />;

      case "Container":
        return <Truck size={18} />;

      case "Tracking":
        return <MapPinned size={18} />;

      case "Payment":
        return <CreditCard size={18} />;

      case "Logistics":
        return <Building2 size={18} />;

      case "User":
        return <Users size={18} />;

      case "Notification":
        return <Bell size={18} />;

      default:
        return <Search size={18} />;

    }

  };

  if (!isOpen) return null;
    return (
    <div
      className="
      fixed
      inset-0
      z-[9999]

      flex
      items-start
      justify-center

      pt-24

      bg-black/50
      backdrop-blur-sm
      "
      onClick={onClose}
    >

      <div
        onClick={(e) => e.stopPropagation()}
        className="
        w-full
        max-w-2xl

        rounded-3xl

        bg-white
        dark:bg-slate-900

        border
        border-slate-200
        dark:border-slate-700

        shadow-2xl

        overflow-hidden

        transition-colors
        duration-300
        "
      >

        {/* Search Bar */}

        <div
          className="
          flex
          items-center

          px-6
          py-5

          border-b
          border-slate-200
          dark:border-slate-700
          "
        >

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            ref={inputRef}
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search bookings, users, payments..."
            className="
            ml-4

            flex-1

            bg-transparent

            outline-none

            text-lg

            text-slate-900
            dark:text-white

            placeholder:text-slate-400
            "
          />

          <span
            className="
            text-xs

            px-2
            py-1

            rounded-lg

            bg-slate-100
            dark:bg-slate-800

            text-slate-500
            "
          >
            ESC
          </span>

        </div>

        {/* Results */}

        <div className="max-h-[450px] overflow-y-auto">

          {loading && (

            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              Searching...
            </div>

          )}

          {!loading &&
            query &&
            results.length === 0 && (

              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                No results found
              </div>

            )}

          {!loading &&
            results.map((item, index) => (

              <button
                key={`${item.type}-${item.id}`}
                onClick={() => {

                  navigate(item.route);

                  onClose();

                }}
                className={`
                w-full

                flex
                items-center
                gap-4

                px-6
                py-4

                transition-all

                ${
                  selectedIndex === index
                    ? "bg-blue-50 dark:bg-slate-800"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                }
                `}
              >

                <div
                  className="
                  h-11
                  w-11

                  rounded-xl

                  bg-blue-100
                  dark:bg-slate-700

                  flex
                  items-center
                  justify-center

                  text-blue-600
                  dark:text-blue-300
                  "
                >
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 text-left">

                  <div className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </div>

                </div>

                <span
                  className="
                  rounded-full

                  bg-blue-100
                  dark:bg-blue-900/40

                  px-3
                  py-1

                  text-xs

                  text-blue-700
                  dark:text-blue-300
                  "
                >
                  {item.type}
                </span>

              </button>

            ))}

        </div>

        {/* Footer */}

        <div
          className="
          flex
          items-center
          justify-between

          px-6
          py-4

          border-t
          border-slate-200
          dark:border-slate-700

          text-xs
          text-slate-500
          dark:text-slate-400
          "
        >

          <span>
            ↑ ↓ Navigate
          </span>

          <span>
            Enter to open
          </span>

          <span>
            Esc to close
          </span>

        </div>

      </div>

    </div>
  );
}
