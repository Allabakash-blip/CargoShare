import { getUser } from "../../utils/auth";
import {
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

export default function DashboardHeader() {
  const user = getUser();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div
        className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-r
        from-blue-700
        via-blue-600
        to-cyan-600
        dark:from-slate-900
        dark:via-slate-800
        dark:to-slate-900
        text-white
        p-8
        shadow-xl
        border
        border-blue-500/20
        dark:border-slate-700
        transition-all
        duration-300
        "
      >
        {/* Background Glow */}

        <div
          className="
          absolute
          -top-16
          -right-16
          w-64
          h-64
          rounded-full
          bg-white/10
          blur-3xl
          "
        />

        <div
          className="
          relative
          flex
          flex-col
          lg:flex-row
          lg:justify-between
          lg:items-center
          gap-8
          "
        >
          {/* Left */}

          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              {greeting},{" "}
              <span className="text-cyan-300">
                {user?.role}
              </span>{" "}
              👋
            </h1>

            <p className="mt-4 text-lg text-blue-100 dark:text-slate-300">
              Welcome back to CargoShare.
            </p>

            <p className="mt-2 text-blue-200 dark:text-slate-400">
              Manage your logistics operations efficiently with
              real-time insights and analytics.
            </p>
          </div>

          {/* Right */}

          <div className="flex flex-col items-start lg:items-end gap-4">
            <div className="flex items-center gap-2 text-blue-100 dark:text-slate-300">
              <CalendarDays size={20} />

              <span className="font-medium">
                {today}
              </span>
            </div>

            <div
              className="
              flex
              items-center
              gap-2
              bg-white/15
              dark:bg-slate-700/50
              backdrop-blur-md
              px-5
              py-3
              rounded-2xl
              border
              border-white/20
              dark:border-slate-600
              "
            >
              <ShieldCheck
                size={20}
                className="text-green-300"
              />

              <span className="font-semibold">
                {user?.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Filter */}

      <div className="flex justify-end mt-6">
        <div className="flex items-center gap-3">

          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Filter:
          </span>

          <select
            className="
            w-44
            rounded-xl
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-700
            dark:text-white
            px-4
            py-2
            outline-none
            shadow-sm
            focus:ring-2
            focus:ring-blue-500
            transition
            "
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

        </div>
      </div>
    </>
  );
}