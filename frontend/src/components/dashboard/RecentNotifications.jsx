import { useEffect, useState, useCallback } from "react";
import {
  BellRing,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getRecentNotifications } from "../../services/dashboardNotificationService";
import useAutoRefresh from "../../hooks/useAutoRefresh";

export default function RecentNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = useCallback(async () => {
  try {
    const data = await getRecentNotifications();
    setNotifications(data);
  } catch (err) {
    console.error(err);
  }
}, []);
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // Auto refresh every 30 seconds
  useAutoRefresh(fetchNotifications, 30000);



  return (
    <div
      className="
      bg-white
      dark:bg-slate-800
      rounded-3xl
      shadow-md
      border
      border-slate-200
      dark:border-slate-700
      p-6
      hover:shadow-xl
      transition-all
      duration-300
      "
    >

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white">

            <BellRing className="text-orange-500" />

            Recent Notifications

          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Latest updates from the system
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/dashboard/notifications")
          }
          className="
          flex
          items-center
          gap-1
          text-blue-600
          dark:text-blue-400
          hover:underline
          font-medium
          "
        >
          View All
          <ArrowRight size={16} />
        </button>

      </div>

      {notifications.length === 0 ? (

        <div className="py-10 text-center">

          <div className="text-5xl">
            🔔
          </div>

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            No recent notifications.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {notifications.map((notification) => (

            <div
              key={notification.notification_id}
              className="
              rounded-2xl
              border
              border-slate-200
              dark:border-slate-700
              p-5
              hover:bg-slate-50
              dark:hover:bg-slate-700/40
              transition-all
              duration-300
              "
            >

              <p className="font-medium text-slate-800 dark:text-white">
                {notification.message}
              </p>

              <div className="flex items-center justify-between mt-4">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    notification.status === "Unread"
                      ? "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                      : "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                  }`}
                >
                  {notification.status}
                </span>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}