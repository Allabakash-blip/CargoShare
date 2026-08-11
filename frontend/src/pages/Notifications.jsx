import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  Check,
} from "lucide-react";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import { toast } from "react-toastify";

export default function Notifications() {

  const [notifications, setNotifications] =
    useState([]);
    const previousCount = useRef(0);

    useEffect(() => {

  fetchNotifications(true);

  const interval = setInterval(() => {
    fetchNotifications(false);
  }, 5000);

  return () => clearInterval(interval);

}, []);

  const fetchNotifications = async (
  firstLoad = false
) => {
    try {
      const data = await getNotifications();
      if (!firstLoad) {

  if (data.length > previousCount.current) {

    toast.info(
      "🔔 New notification received!"
    );

  }

}

previousCount.current = data.length;

setNotifications(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to load notifications"
      );
    }
  };

  const handleMarkAsRead = async (id) => {
    try {

      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.notification_id === id
            ? {
                ...notification,
                status: "Read",
              }
            : notification
        )
      );

      toast.success(
        "Notification marked as read"
      );

    } catch {

      toast.error(
        "Failed to update notification"
      );

    }
  };

  const handleMarkAll = async () => {
    try {

      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          status: "Read",
        }))
      );

      toast.success(
        "All notifications marked as read"
      );

    } catch {

      toast.error(
        "Failed to update notifications"
      );

    }
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with system alerts and activities."
      >
        <Button
          leftIcon={CheckCheck}
          onClick={handleMarkAll}
        >
          Mark All Read
        </Button>
      </PageHeader>
      <div
  className="
    bg-white
    dark:bg-slate-900
    rounded-3xl
    shadow-lg
    border
    border-slate-200
    dark:border-slate-700
    overflow-hidden
  "
>

  {notifications.length === 0 ? (

    <div className="py-20">

      <div className="flex flex-col items-center">

        <Bell
          size={56}
          className="text-slate-300 dark:text-slate-600"
        />

        <h3 className="mt-5 text-xl font-semibold text-slate-700 dark:text-white">
          No Notifications
        </h3>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          You're all caught up.
        </p>

      </div>

    </div>

  ) : (

    <div className="divide-y divide-slate-200 dark:divide-slate-700">

      {notifications.map((notification) => (

        <div
          key={notification.notification_id}
          className={`
            flex
            items-center
            justify-between
            gap-6
            p-6
            transition-all
            duration-300
            hover:bg-slate-50
            dark:hover:bg-slate-800

            ${
              notification.status === "Unread"
                ? "bg-blue-50 dark:bg-blue-950/30"
                : ""
            }
          `}
        >

          <div className="flex items-start gap-4 flex-1">

            <div
              className={`
                h-12
                w-12
                rounded-2xl
                flex
                items-center
                justify-center

                ${
                  notification.status === "Unread"
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "bg-green-100 dark:bg-green-900"
                }
              `}
            >

              <Bell
                size={22}
                className={
                  notification.status === "Unread"
                    ? "text-blue-600"
                    : "text-green-600"
                }
              />

            </div>

            <div className="flex-1">

              <div className="flex items-center gap-3">

                <h3 className="font-semibold text-slate-800 dark:text-white">
                  {notification.title}
                </h3>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold

                    ${
                      notification.status === "Unread"
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    }
                  `}
                >
                  {notification.status}
                </span>

              </div>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {notification.message}
              </p>

            </div>

          </div>

          <div>
                        {notification.status === "Unread" ? (

              <Button
                variant="success"
                leftIcon={Check}
                onClick={() =>
                  handleMarkAsRead(
                    notification.notification_id
                  )
                }
              >
                Mark Read
              </Button>

            ) : (

              <Button
                variant="secondary"
                disabled
              >
                Read
              </Button>

            )}

          </div>

        </div>

      ))}

    </div>

  )}

</div>

    </>
  );
}