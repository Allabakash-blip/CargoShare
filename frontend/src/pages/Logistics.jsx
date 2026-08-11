import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Truck,
  Building2,
} from "lucide-react";
import { toast } from "react-toastify";


import { getUser } from "../utils/auth";

import {
  getLogistics,
  deleteLogistics,
} from "../services/logisticsService";

import {
  getMyBookings,
  updateBookingStatus,
} from "../services/bookingService";

import CreateLogisticsModal from "../components/logistics/CreateLogisticsModal";
import EditLogisticsModal from "../components/logistics/EditLogisticsModal";
import StatusBadge from "../components/ui/StatusBadge";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Logistics() {
  const user = getUser();

  const isAdmin = user?.role === "Admin";
  const isLogistics = user?.role === "Logistics";

  const [searchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState(
    Number(searchParams.get("highlight"))
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  useEffect(() => {
    setHighlightId(Number(searchParams.get("highlight")));
  }, [searchParams]);

  const [logistics, setLogistics] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedLogistics, setSelectedLogistics] = useState(null);

  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    if (isAdmin) fetchLogistics();
    if (isLogistics) fetchMyBookings();
  }, []);

  useEffect(() => {
    if (highlightId == null || Number.isNaN(highlightId)) return;

    let rowId = "";

    if (isAdmin) rowId = `logistics-${highlightId}`;
    if (isLogistics) rowId = `booking-${highlightId}`;

    const row = document.getElementById(rowId);

    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const timer = setTimeout(() => {
      setHighlightId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    logistics,
    myBookings,
    highlightId,
    isAdmin,
    isLogistics,
  ]);

  const fetchLogistics = async () => {
    try {
      const data = await getLogistics();
      setLogistics(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load Logistics Providers");
    }
  };

  const handleDelete = (id) => {
  setSelectedDeleteId(id);
  setConfirmOpen(true);
};
const confirmDelete = async () => {
  try {
    await deleteLogistics(selectedDeleteId);

    toast.success("Logistics Provider deleted successfully");

    fetchLogistics();

  } catch (err) {
    console.error(err);

    toast.error(
      err.response?.data?.detail ||
      "Failed to delete Logistics Provider"
    );
  }

  setConfirmOpen(false);
  setSelectedDeleteId(null);
};

  const handleEdit = (item) => {
    setSelectedLogistics(item);
    setOpenEditModal(true);
  };

  const fetchMyBookings = async () => {
    try {
      const data = await getMyBookings();
      setMyBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assigned bookings");
    }
  };

  const handleStatusUpdate = async (
    bookingId,
    currentStatus
  ) => {
    let nextStatus = "";

    if (currentStatus === "Assigned") nextStatus = "In Transit";
    else if (currentStatus === "In Transit") nextStatus = "Completed";
    else return;

    try {
      await updateBookingStatus(
        bookingId,
        nextStatus
      );

      toast.success(`Booking marked as ${nextStatus}`);

      fetchMyBookings();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to update booking status"
      );
    }
  };

  if (isAdmin) {
    return (
      <>
        <CreateLogisticsModal
          isOpen={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onSuccess={fetchLogistics}
        />

        {openEditModal && selectedLogistics && (
          <EditLogisticsModal
            logistics={selectedLogistics}
            onClose={() => {
              setOpenEditModal(false);
              setSelectedLogistics(null);
            }}
            onSuccess={fetchLogistics}
          />
        )}

        <PageHeader
          title="Logistics Management"
          subtitle="Manage logistics providers and transport companies."
        >
          <Button
            leftIcon={Plus}
            onClick={() => setOpenCreateModal(true)}
          >
            Add Logistics
          </Button>
        </PageHeader>
        <div
  className="
    overflow-hidden
    rounded-3xl
    border
    border-slate-200
    dark:border-slate-700
    bg-white
    dark:bg-slate-900
    shadow-lg
    transition-all
  "
>
  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead
        className="
          bg-slate-100
          dark:bg-slate-800
          border-b
          border-slate-200
          dark:border-slate-700
        "
      >
        <tr>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Company
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Contact Person
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Vehicle
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Capacity
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Status
          </th>

          <th className="px-6 py-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
            Actions
          </th>

        </tr>
      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

        {logistics.length > 0 ? (

          logistics.map((item) => (

            <tr
              key={item.logistics_id}
              id={`logistics-${item.logistics_id}`}
              style={
                item.logistics_id === highlightId
                  ? {
                      transition: "all 1s ease",
                      boxShadow:
                        "0 0 20px rgba(250,204,21,.8)",
                    }
                  : {}
              }
              className={`
                transition-all
                duration-300
                hover:bg-blue-50
                dark:hover:bg-slate-800

                ${
                  item.logistics_id === highlightId
                    ? "bg-yellow-200 ring-2 ring-yellow-400 animate-pulse"
                    : ""
                }
              `}
            >

              <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      h-11
                      w-11
                      rounded-xl
                      bg-blue-100
                      dark:bg-blue-900
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Building2
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      {item.company_name}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5">

                <div className="font-semibold text-slate-800 dark:text-white">
                  {item.contact_person}
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {item.phone}
                </div>

              </td>

              <td className="px-6 py-5">

                <div className="font-semibold text-slate-800 dark:text-white">
                  {item.vehicle_type}
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {item.vehicle_number}
                </div>

              </td>

              <td className="px-6 py-5">

                <span
                  className="
                    rounded-full
                    bg-cyan-100
                    dark:bg-cyan-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-cyan-700
                    dark:text-cyan-300
                  "
                >
                  {item.capacity} Tons
                </span>

              </td>

              <td className="px-6 py-5">

                <StatusBadge
                  status={item.status}
                />

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <button
                    onClick={() => handleEdit(item)}
                    className="
                      rounded-xl
                      bg-blue-100
                      dark:bg-blue-900
                      p-3
                      text-blue-600
                      hover:scale-110
                      transition
                    "
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.logistics_id)
                    }
                    className="
                      rounded-xl
                      bg-red-100
                      dark:bg-red-900
                      p-3
                      text-red-600
                      hover:scale-110
                      transition
                    "
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))

        ) : (
                    <tr>
            <td
              colSpan={6}
              className="
                py-20
                text-center
                text-slate-500
                dark:text-slate-400
              "
            >
              <div className="flex flex-col items-center gap-4">

                <Building2
                  size={56}
                  className="text-slate-300 dark:text-slate-600"
                />

                <div>

                  <p className="text-xl font-semibold">
                    No Logistics Providers
                  </p>

                  <p className="mt-2 text-sm">
                    Click "Add Logistics" to create your first provider.
                  </p>

                </div>

              </div>
            </td>
          </tr>
        )}

      </tbody>

    </table>

  </div>

</div>
        <ConfirmModal
  isOpen={confirmOpen}
  title="Delete Logistics Provider"
  message="Are you sure you want to delete this logistics provider? This action cannot be undone."
  onConfirm={confirmDelete}
  onCancel={() => {
    setConfirmOpen(false);
    setSelectedDeleteId(null);
  }}
/>
      </>
    );
  }

  // ======================================================
  // LOGISTICS USER VIEW
  // ======================================================

  return (
    <>

      <PageHeader
        title="My Assigned Bookings"
        subtitle="View and manage your assigned shipments."
      >
        <Truck
          size={34}
          className="text-blue-600"
        />
      </PageHeader>

      <div
        className="
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

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead
              className="
                bg-slate-100
                dark:bg-slate-800
                border-b
                border-slate-200
                dark:border-slate-700
              "
            >

              <tr>

                <th className="px-6 py-5 text-left">
                  Booking ID
                </th>

                <th className="px-6 py-5 text-left">
                  Pickup
                </th>

                <th className="px-6 py-5 text-left">
                  Delivery
                </th>

                <th className="px-6 py-5 text-left">
                  Goods
                </th>

                <th className="px-6 py-5 text-left">
                  Weight
                </th>

                <th className="px-6 py-5 text-left">
                  Status
                </th>

                <th className="px-6 py-5 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {myBookings.length > 0 ? (

                myBookings.map((booking) => (

                  <tr
                    key={booking.booking_id}
                    id={`booking-${booking.booking_id}`}
                    style={
                      booking.booking_id === highlightId
                        ? {
                            transition: "all 1s ease",
                            boxShadow:
                              "0 0 20px rgba(250,204,21,.8)",
                          }
                        : {}
                    }
                    className={`
                      transition-all
                      duration-300
                      hover:bg-blue-50
                      dark:hover:bg-slate-800
                      ${
                        booking.booking_id === highlightId
                          ? "bg-yellow-200 ring-2 ring-yellow-400 animate-pulse"
                          : ""
                      }
                    `}
                  >

                    <td className="px-6 py-5 font-semibold text-slate-800 dark:text-white">
                      #{booking.booking_id}
                    </td>

                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                      {booking.pickup_location}
                    </td>

                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                      {booking.delivery_location}
                    </td>

                    <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                      {booking.goods_description}
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className="
                          rounded-full
                          bg-cyan-100
                          dark:bg-cyan-900
                          px-4
                          py-2
                          text-sm
                          font-semibold
                          text-cyan-700
                          dark:text-cyan-300
                        "
                      >
                        {booking.weight} kg
                      </span>

                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        status={booking.status}
                      />
                    </td>

                    <td className="px-6 py-5 text-center">

                      {booking.status === "Assigned" && (

                        <Button
                          onClick={() =>
                            handleStatusUpdate(
                              booking.booking_id,
                              booking.status
                            )
                          }
                        >
                          Start Transit
                        </Button>

                      )}

                      {booking.status === "In Transit" && (

                        <Button
                          variant="success"
                          onClick={() =>
                            handleStatusUpdate(
                              booking.booking_id,
                              booking.status
                            )
                          }
                        >
                          Mark Completed
                        </Button>

                      )}

                      {booking.status === "Completed" && (

                        <span
                          className="
                            inline-flex
                            items-center
                            rounded-full
                            bg-green-100
                            dark:bg-green-900/40
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-green-700
                            dark:text-green-300
                          "
                        >
                          ✓ Completed
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan={7}
                    className="
                      py-20
                      text-center
                      text-slate-500
                      dark:text-slate-400
                    "
                  >

                    <div className="flex flex-col items-center gap-4">

                      <Truck
                        size={56}
                        className="text-slate-300 dark:text-slate-600"
                      />

                      <div>

                        <p className="text-xl font-semibold">
                          No Assigned Bookings
                        </p>

                        <p className="mt-2 text-sm">
                          There are currently no bookings assigned to you.
                        </p>

                      </div>

                    </div>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </>
  );
}