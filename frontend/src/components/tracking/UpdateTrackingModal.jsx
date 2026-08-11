import { useEffect, useState } from "react";
import Button from "../ui/Button";

export default function UpdateTrackingModal({
  isOpen,
  onClose,
  tracking,
  onUpdate,
}) {
  const [loading, setLoading] = useState(false);

const [formData, setFormData] = useState({
    current_location: "",
    shipment_status: "",
  });

  useEffect(() => {
    if (tracking) {
      setFormData({
        current_location: tracking.current_location,
        shipment_status: tracking.shipment_status,
      });
    }
  }, [tracking]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    await onUpdate(formData);

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          w-[480px]
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Update Shipment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Current Location */}

          <div>
            <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
              Current Location
            </label>

            <input
              type="text"
              placeholder="Enter current location"
              value={formData.current_location}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_location: e.target.value,
                })
              }
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
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
              "
            />
          </div>

          {/* Shipment Status */}

          <div>
            <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
              Shipment Status
            </label>

            <select
              value={formData.shipment_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shipment_status: e.target.value,
                })
              }
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
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                transition
              "
            >
              <option value="In Transit">
                In Transit
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="
                px-5
                py-3
                rounded-xl
                border
                border-slate-300
                dark:border-slate-600
                text-slate-700
                dark:text-slate-300
                hover:bg-slate-100
                dark:hover:bg-slate-800
                transition
              "
            >
              Cancel
            </button>

            <Button
  type="submit"
  loading={loading}
  disabled={loading}
  className="
    rounded-xl
    bg-blue-600
    hover:bg-blue-700
    text-white
    font-semibold
  "
>
  Update Shipment
</Button>

          </div>

        </form>
      </div>
    </div>
  );
}