import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getBookings } from "../../services/bookingService";
import StatusBadge from "../ui/StatusBadge";
import useAutoRefresh from "../../hooks/useAutoRefresh";

export default function RecentBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getBookings();
      setBookings(data.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Auto refresh every 30 seconds
  useAutoRefresh(fetchBookings, 30000);

  return (
    <div
      className="
      mt-10
      bg-white
      dark:bg-slate-800
      rounded-3xl
      shadow-md
      border
      border-slate-200
      dark:border-slate-700
      overflow-hidden
      transition-all
      duration-300
      "
    >
      {/* Header */}

      <div
        className="
        flex
        items-center
        justify-between
        px-7
        py-5
        border-b
        border-slate-200
        dark:border-slate-700
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Recent Bookings
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Latest shipment requests
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/bookings")}
          className="
          text-blue-600
          dark:text-blue-400
          font-semibold
          hover:underline
          "
        >
          View All →
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="py-12 text-center">

          <div className="text-5xl">
            📦
          </div>

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            No bookings found.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
              bg-slate-50
              dark:bg-slate-900
              "
            >
              <tr className="text-sm text-slate-600 dark:text-slate-300">

                <th className="px-6 py-4 text-left">
                  Booking
                </th>

                <th className="px-6 py-4 text-left">
                  Pickup
                </th>

                <th className="px-6 py-4 text-left">
                  Delivery
                </th>

                <th className="px-6 py-4 text-left">
                  Goods
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

              </tr>
            </thead>

            <tbody>

              {bookings.map((booking) => (

                <tr
                  key={booking.booking_id}
                  className="
                  border-t
                  border-slate-200
                  dark:border-slate-700
                  hover:bg-blue-50
                  dark:hover:bg-slate-700/40
                  transition
                  "
                >

                  <td className="px-6 py-5">

                    <span
                      className="
                      bg-blue-100
                      dark:bg-blue-900/40
                      text-blue-700
                      dark:text-blue-300
                      font-semibold
                      px-3
                      py-1
                      rounded-full
                      "
                    >
                      #{booking.booking_id}
                    </span>

                  </td>

                  <td className="px-6 py-5 font-medium text-slate-800 dark:text-white">
                    {booking.pickup_location}
                  </td>

                  <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                    {booking.delivery_location}
                  </td>

                  <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                    {booking.goods_description}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={booking.status} />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}