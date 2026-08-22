import { useState, useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  FileSpreadsheet,
  FileText,
  MessageCircle,
} from "lucide-react";
import {
  getBookings,
  createBooking,
  deleteBooking,
  assignBooking,
} from "../services/bookingService";

import { getUser } from "../utils/auth";
import { exportToExcel } from "../utils/exportExcel";

import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ConfirmModal from "../components/ui/ConfirmModal";

import CreateBookingModal from "../components/bookings/CreateBookingModal";
import AssignLogisticsModal from "../components/bookings/AssignLogisticsModal";
import { Download } from "lucide-react";
import { exportToPDF } from "../utils/exportPDF";
import DocumentsModal from "../components/bookings/DocumentsModal";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

export default function Bookings() {
  const user = getUser();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState(
    Number(searchParams.get("highlight"))
  );

  const [bookings, setBookings] = useState([]);

  const [openModal, setOpenModal] = useState(false);

  const [assignModalOpen, setAssignModalOpen] =
    useState(false);

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [confirmOpen, setConfirmOpen] =
    useState(false);

  const [selectedBookingId, setSelectedBookingId] =
    useState(null);
  const [documentsOpen, setDocumentsOpen] =
    useState(false);

  const [selectedBookingForDocs, setSelectedBookingForDocs] =
    useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    setHighlightId(
      Number(searchParams.get("highlight"))
    );
  }, [searchParams]);

  useEffect(() => {
    if (!highlightId || bookings.length === 0)
      return;

    const row = document.getElementById(
      `booking-${highlightId}`
    );

    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const timer = setTimeout(() => {
      setHighlightId(null);
    }, 2500);

    return () => clearTimeout(timer);
  }, [bookings, highlightId]);

  const fetchBookings = async () => {
  try {
    setLoading(true);

    const data = await getBookings();

    setBookings(data);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
      "Failed to load bookings"
    );

  } finally {
    setLoading(false);
  }
};

  const handleCreateBooking = async (bookingData) => {
  try {
    const newBooking = await createBooking(bookingData);

    // Add the new booking immediately
    setBookings((prev) => [newBooking, ...prev]);

    toast.success("Booking created successfully!");

    setOpenModal(false);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
      "Failed to create booking"
    );
  }
};

  const openDeleteModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteBooking(selectedBookingId);

      toast.success(
        "Booking deleted successfully!"
      );

      fetchBookings();
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to delete booking"
      );
    }

    setConfirmOpen(false);
    setSelectedBookingId(null);
  };

  const openAssignModal = (booking) => {
    setSelectedBooking(booking);
    setAssignModalOpen(true);
  };
  const openDocumentsModal = (booking) => {
    setSelectedBookingForDocs(booking);
    setDocumentsOpen(true);
  };

  const handleAssignBooking = async (
  bookingId,
  logisticsId
) => {
  try {
    const updatedBooking = await assignBooking(
      bookingId,
      logisticsId
    );

    // Update only the assigned booking
    setBookings((prev) =>
      prev.map((booking) =>
        booking.booking_id === bookingId
          ? updatedBooking
          : booking
      )
    );

    toast.success(
      "Logistics assigned successfully!"
    );

    setAssignModalOpen(false);
    setSelectedBooking(null);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
        "Failed to assign logistics"
    );
  }
};

  const handleExport = () => {
    const exportData = bookings.map(
      (booking) => ({
        Booking_ID: booking.booking_id,
        Pickup: booking.pickup_location,
        Delivery: booking.delivery_location,
        Goods:
          booking.goods_description || "-",
        Weight: `${booking.weight} kg`,
        Status: booking.status,
      })
    );
    

    exportToExcel(
      exportData,
      "Bookings"
    );
  };
  const handleExportPDF = () => {
  const exportData = bookings.map((booking) => ({
    Booking_ID: booking.booking_id,
    Pickup: booking.pickup_location,
    Delivery: booking.delivery_location,
    Goods: booking.goods_description || "-",
    Weight: `${booking.weight} kg`,
    Status: booking.status,
  }));

  exportToPDF(
    exportData,
    "Bookings_Report",
    "CargoShare - Bookings Report"
  );
};
  const openChat = (bookingId) => {
    navigate(`/dashboard/chat?booking=${bookingId}`);
  };

  const columns = [
    {
      accessorKey: "booking_id",
      header: "ID",
    },
    {
      accessorKey: "pickup_location",
      header: "Pickup",
    },
    {
      accessorKey: "delivery_location",
      header: "Delivery",
    },
    {
      accessorKey: "weight",
      header: "Weight",
      cell: ({ row }) =>
        `${row.original.weight} kg`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
        />
      ),
    },
    {
      id: "actions",

      header: "Actions",

      enableSorting: false,

      cell: ({ row }) => {
        const booking = row.original;

        if (loading) {
  return <LoadingSkeleton rows={8} />;
}

        return (
          <div className="flex justify-center gap-2">

  {(user?.role === "Trader" ||
    user?.role === "Logistics") &&
    booking.status !== "Pending" && (
      <button
        onClick={() =>
          openChat(booking.booking_id)
        }
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          bg-blue-600
          px-3
          py-1
          text-white
          transition
          hover:bg-blue-700
          dark:bg-blue-600
          dark:hover:bg-blue-700
        "
      >
        <MessageCircle size={15} />
        Chat
      </button>
    )}

  {user?.role === "Trader" && (
    <button
      onClick={() =>
        openDeleteModal(
          booking.booking_id
        )
      }
      className="
        bg-red-500
        hover:bg-red-600
        text-white
        px-3
        py-1
        rounded-lg
      "
    >
      Delete
    </button>
  )}

  <button
    onClick={() =>
      openDocumentsModal(booking)
    }
    className="
      bg-indigo-600
      hover:bg-indigo-700
      text-white
      px-3
      py-1
      rounded-lg
    "
  >
    📄 Documents
  </button>

            {user?.role === "Admin" && (
              <button
                disabled={
                  booking.status ===
                  "Assigned"
                }
                onClick={() =>
                  openAssignModal(
                    booking
                  )
                }
                className={`px-3 py-1 rounded-lg text-white ${
                  booking.status ===
                  "Assigned"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {booking.status ===
                "Assigned"
                  ? "Assigned"
                  : "Assign"}
              </button>
            )}

          </div>
        );
      },
    },
  ];
    return (
    <>
      <PageHeader
        title={
          user?.role === "Trader"
            ? "My Bookings"
            : "Bookings"
        }
        subtitle="Manage cargo shipment bookings"
      >
        <div className="flex gap-3">

      <Button
  onClick={handleExport}
  leftIcon={FileSpreadsheet}
  className="
    border
    border-emerald-200
    dark:border-emerald-800
    bg-emerald-50
    dark:bg-emerald-900/20
    text-emerald-700
    dark:text-emerald-300
    hover:bg-emerald-100
    dark:hover:bg-emerald-900/40
  "
>
  Export Excel
</Button>

<Button
  onClick={handleExportPDF}
  leftIcon={FileText}
  className="
    border
    border-rose-200
    dark:border-rose-800
    bg-rose-50
    dark:bg-rose-900/20
    text-rose-700
    dark:text-rose-300
    hover:bg-rose-100
    dark:hover:bg-rose-900/40
  "
>
  Export PDF
</Button>

  {user?.role === "Trader" && (
    <Button
      leftIcon={() => <span>+</span>}
      onClick={() => setOpenModal(true)}
    >
      New Booking
    </Button>
  )}

</div>
      </PageHeader>

      <DataTable
        columns={columns}
        data={bookings}
      />

      {user?.role === "Trader" && (
        <CreateBookingModal
          isOpen={openModal}
          onClose={() =>
            setOpenModal(false)
          }
          onCreate={
            handleCreateBooking
          }
        />
      )}

      {user?.role === "Admin" &&
        selectedBooking && (
          <AssignLogisticsModal
            booking={selectedBooking}
            isOpen={assignModalOpen}
            onClose={() => {
              setAssignModalOpen(false);
              setSelectedBooking(null);
            }}
            onAssign={
              handleAssignBooking
            }
          />
        )}
        {selectedBookingForDocs && (
  <DocumentsModal
    bookingId={
      selectedBookingForDocs.booking_id
    }
    isOpen={documentsOpen}
    onClose={() => {
      setDocumentsOpen(false);
      setSelectedBookingForDocs(null);
    }}
  />
)}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedBookingId(null);
        }}
      />
    </>
  );
}