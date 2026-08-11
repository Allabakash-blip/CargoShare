import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  ArrowRight,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getRecentActivities } from "../../services/activityDashboardService";
import useAutoRefresh from "../../hooks/useAutoRefresh";

export default function RecentActivity() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  const loadActivities = useCallback(async () => {
    try {
      const data = await getRecentActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  // Auto refresh every 30 seconds
  useAutoRefresh(loadActivities, 30000);

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
            <Activity className="text-blue-600" />
            Recent Activity
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Latest system activities
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/activity-logs")}
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

      {activities.length === 0 ? (
        <div className="py-10 text-center">
          <div className="text-5xl">📋</div>

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            No recent activity.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((item) => (
            <div
              key={item.log_id}
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
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800 dark:text-white">
                  {item.action}
                </p>

                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <User
                  size={16}
                  className="text-blue-500"
                />

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {item.user_email}
                </span>

                <span
                  className="
                  ml-auto
                  px-3
                  py-1
                  rounded-full
                  bg-blue-100
                  dark:bg-blue-900/40
                  text-blue-700
                  dark:text-blue-300
                  text-xs
                  font-semibold
                  "
                >
                  {item.user_role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}