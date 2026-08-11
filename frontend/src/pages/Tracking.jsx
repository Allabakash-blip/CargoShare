import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  MapPinned,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getTracking,
  createTracking,
  updateTracking,
  deleteTracking,
} from "../services/trackingService";

import CreateTrackingModal from "../components/tracking/CreateTrackingModal";
import UpdateTrackingModal from "../components/tracking/UpdateTrackingModal";

import StatusBadge from "../components/ui/StatusBadge";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import { getUser } from "../utils/auth";

import { toast } from "react-toastify";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Tracking() {
  const [tracking, setTracking] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [selectedTracking, setSelectedTracking] =
    useState(null);
  const [confirmOpen, setConfirmOpen] =
  useState(false);

const [trackingToDelete, setTrackingToDelete] =
  useState(null);

  const user = getUser();

  // ====================================
  // Global Search Highlight
  // ====================================

  const [searchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState(
    Number(searchParams.get("highlight"))
  );

  useEffect(() => {
    setHighlightId(
      Number(searchParams.get("highlight"))
    );
  }, [searchParams]);

  useEffect(() => {
    fetchTracking();
  }, []);

  useEffect(() => {
    if (!highlightId) return;

    const row = document.getElementById(
      `tracking-${highlightId}`
    );

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
  }, [tracking, highlightId]);

  const fetchTracking = async () => {
    try {
      const data = await getTracking();
      setTracking(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to load tracking records"
      );
    }
  };

  const handleCreateTracking = async (
    trackingData
  ) => {
    try {
      await createTracking(trackingData);

      toast.success(
        "Tracking record created successfully!"
      );

      fetchTracking();

      setOpenModal(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to create tracking"
      );
    }
  };

  const handleUpdateTracking = async (
    trackingData
  ) => {
    try {
      await updateTracking(
        selectedTracking.tracking_id,
        trackingData
      );

      toast.success(
        "Tracking updated successfully!"
      );

      fetchTracking();

      setUpdateModal(false);
      setSelectedTracking(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to update tracking"
      );
    }
  };

  const handleDelete = (trackingId) => {
  setTrackingToDelete(trackingId);
  setConfirmOpen(true);
};

const confirmDelete = async () => {
  try {
    await deleteTracking(trackingToDelete);

    toast.success(
      "Tracking record deleted successfully!"
    );

    fetchTracking();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
        "Failed to delete tracking"
    );
  } finally {
    setConfirmOpen(false);
    setTrackingToDelete(null);
  }
};

  return (
    <>
      <PageHeader
        title="Shipment Tracking"
        subtitle="Track shipments in real time."
      >
        {user?.role === "Logistics" && (
          <Button
            leftIcon={Plus}
            onClick={() => setOpenModal(true)}
          >
            Add Tracking
          </Button>
        )}
      </PageHeader>
      <div
  className="
    overflow-hidden
    rounded-3xl
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-700
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
            ID
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Booking
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Current Location
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Shipment Status
          </th>

          {user?.role === "Logistics" && (

            <th className="px-6 py-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
              Actions
            </th>

          )}

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

        {tracking.length > 0 ? (

          tracking.map((item) => (

            <tr
              key={item.tracking_id}
              id={`tracking-${item.tracking_id}`}
              style={
                item.tracking_id === highlightId
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
                  item.tracking_id === highlightId
                    ? "bg-yellow-200 ring-2 ring-yellow-400 animate-pulse"
                    : ""
                }
              `}
            >

              <td className="px-6 py-5 font-semibold text-slate-800 dark:text-white">
                #{item.tracking_id}
              </td>

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

                    <MapPinned
                      size={20}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      Booking #{item.booking_id}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                {item.current_location}
              </td>

              <td className="px-6 py-5">
                <StatusBadge
                  status={item.shipment_status}
                />
              </td>

              {user?.role === "Logistics" && (

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() => {
                        setSelectedTracking(item);
                        setUpdateModal(true);
                      }}
                      className="
                        rounded-xl
                        bg-blue-100
                        dark:bg-blue-900
                        px-4
                        py-2
                        text-blue-600
                        dark:text-blue-300
                        font-medium
                        hover:scale-105
                        transition
                      "
                    >
                      Update
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item.tracking_id)
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

              )}

            </tr>

          ))

        ) : (
                    <tr>

            <td
              colSpan={
                user?.role === "Logistics"
                  ? 5
                  : 4
              }
              className="
                py-20
                text-center
                text-slate-500
                dark:text-slate-400
              "
            >

              <div className="flex flex-col items-center gap-4">

                <MapPinned
                  size={56}
                  className="text-slate-300 dark:text-slate-600"
                />

                <div>

                  <p className="text-xl font-semibold">
                    No Tracking Records Found
                  </p>

                  <p className="mt-2 text-sm">
                    Create a tracking record to start monitoring shipments.
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

      {user?.role === "Logistics" && (

        <>
          <CreateTrackingModal
            isOpen={openModal}
            onClose={() =>
              setOpenModal(false)
            }
            onCreate={handleCreateTracking}
          />

          <UpdateTrackingModal
            isOpen={updateModal}
            onClose={() => {
              setUpdateModal(false);
              setSelectedTracking(null);
            }}
            tracking={selectedTracking}
            onUpdate={handleUpdateTracking}
          />
          <ConfirmModal
  isOpen={confirmOpen}
  title="Delete Tracking"
  message="Are you sure you want to delete this tracking record?"
  confirmText="Delete"
  cancelText="Cancel"
  onConfirm={confirmDelete}
  onCancel={() => {
    setConfirmOpen(false);
    setTrackingToDelete(null);
  }}
/>
        </>

      )}

    </>
  );
}