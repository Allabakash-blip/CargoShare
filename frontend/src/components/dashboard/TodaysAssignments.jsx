import { Truck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMyBookings } from "../../services/bookingService";

export default function TodaysAssignments() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await getMyBookings();

      setBookings(data.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-700
      bg-white
      dark:bg-slate-900
      shadow-lg
      "
    >
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">

        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Today's Assignments
          </h2>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Bookings assigned to you
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard/tracking")}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
        >
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="p-6 space-y-4">

        {bookings.length === 0 ? (

          <div className="text-center py-10">

            <Truck
              size={42}
              className="mx-auto text-slate-300"
            />

            <p className="mt-4 text-slate-500 dark:text-slate-400">
              No assignments available.
            </p>

          </div>

        ) : (

          bookings.map((booking) => (

            <div
              key={booking.booking_id}
              className="
              flex
              items-center
              justify-between

              rounded-2xl

              border
              border-slate-200
              dark:border-slate-700

              p-4

              hover:bg-slate-50
              dark:hover:bg-slate-800

              transition
              "
            >
              <div>

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Booking #{booking.booking_id}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {booking.pickup_location} → {booking.delivery_location}
                </p>

              </div>

              <span
                className="
                rounded-full
                bg-blue-100
                dark:bg-blue-900

                px-3
                py-1

                text-xs
                font-semibold

                text-blue-700
                dark:text-blue-300
                "
              >
                Assigned
              </span>

            </div>

          ))

        )}

      </div>

    </div>
  );
}