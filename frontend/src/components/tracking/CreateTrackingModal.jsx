import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../ui/Button";

export default function CreateTrackingModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    booking_id: "",
    current_location: "",
    shipment_status: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onCreate({
        booking_id: Number(formData.booking_id),
        current_location: formData.current_location,
        shipment_status: formData.shipment_status,
      });

      setFormData({
        booking_id: "",
        current_location: "",
        shipment_status: "",
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        p-6
        bg-black/50
        dark:bg-slate-950/70
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          z-[100000]
          w-full
          max-w-[520px]
          rounded-3xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-700
          shadow-2xl
          p-8
          transition-colors
          duration-300
        "
      >
        {/* ==============================
            HEADER
        ============================== */}

        <h2
          className="
            text-3xl
            font-bold
            text-slate-900
            dark:text-white
            mb-8
          "
        >
          Add Tracking
        </h2>

        {/* ==============================
            FORM
        ============================== */}

        <div className="space-y-5">

          {/* Booking ID */}

          <input
            type="number"
            name="booking_id"
            placeholder="Booking ID"
            value={formData.booking_id}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
              transition
            "
          />

          {/* Current Location */}

          <input
            type="text"
            name="current_location"
            placeholder="Current Location"
            value={formData.current_location}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
              transition
            "
          />

          {/* Shipment Status */}

          <select
            name="shipment_status"
            value={formData.shipment_status}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
              transition
            "
          >
            <option value="">
              Select Status
            </option>

            <option value="In Transit">
              In Transit
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>

        </div>

        {/* ==============================
            BUTTONS
        ============================== */}

        <div className="flex justify-end gap-4 mt-8">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              text-slate-700
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              disabled:opacity-50
              transition
            "
          >
            Cancel
          </button>

          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            className="
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              hover:from-blue-700
              hover:to-indigo-700
              text-white
              font-semibold
            "
          >
            Add Tracking
          </Button>

        </div>

      </div>
    </div>,
    document.body
  );
}